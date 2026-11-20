import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import vm from 'node:vm';
import { fileURLToPath, pathToFileURL } from 'node:url';
import ts from 'typescript';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
function load(file, mocks = {}, globals = {}) {
  const source = fs.readFileSync(path.join(root, file), 'utf8').replaceAll('import.meta.url', JSON.stringify(pathToFileURL(path.join(root, file)).href));
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const mod = { exports: {} };
  vm.runInNewContext(code, { module: mod, exports: mod.exports, require(name) { if (name in mocks) return mocks[name]; if (name === 'server-only') return {}; if (name === 'crypto') return crypto; if (name === 'path') return path; if (name === './photo-settings') return load('src/lib/photo-settings.ts'); throw Error(`Unexpected import: ${name}`); }, Buffer, URL, Blob, DOMException, AbortController, AbortSignal, FormData, File, structuredClone, setTimeout, clearTimeout, process: { env: {}, cwd: () => root }, ...globals });
  return mod.exports;
}
const types = load('src/lib/types.ts');
const jsx = (type, props) => ({ type, props });
const editorContext = { Provider: 'editor-provider' };
function elements(tree) {
  if (Array.isArray(tree)) return tree.flatMap(elements);
  if (!tree || typeof tree !== 'object') return [];
  return [tree, ...elements(tree.props?.children), ...elements(tree.node)];
}
function hooks(context = null) {
  const slots = [];
  let cursor = 0;
  const react = {
    useEffect() {}, useId: () => 'test-id', useContext: () => context, useCallback: (fn) => fn,
    useRef(initial) { const index = cursor++; if (!(index in slots)) slots[index] = { current: initial }; return slots[index]; },
    useState(initial) { const index = cursor++; if (!(index in slots)) slots[index] = typeof initial === 'function' ? initial() : initial; return [slots[index], (value) => { slots[index] = typeof value === 'function' ? value(slots[index]) : value; }]; },
  };
  return { react, render(component, props) { cursor = 0; return component(props); } };
}
function clients(react, extra = {}) {
  return { react, 'react/jsx-runtime': { jsx, jsxs: jsx }, 'react-dom': { createPortal: (node, target) => ({ node, target }) }, 'next/navigation': { useRouter: () => ({ push() {}, replace() {}, refresh() {} }) }, 'next/image': 'img', './AdminEditorState': { AdminEditorState: editorContext }, './UploadStatus': 'upload-status', ...extra };
}
const secrets = { CLOUDINARY_CLOUD_NAME: 'test-cloud', CLOUDINARY_API_KEY: '123456', CLOUDINARY_API_SECRET: 'test-secret-not-a-real-key' };
const publicId = 'mert-paketleme/image/11111111-2222-3333-4444-555555555555';
const asset = { public_id: publicId, resource_type: 'image', type: 'upload', bytes: 100, format: 'jpg', secure_url: `https://res.cloudinary.com/test-cloud/image/upload/v1/${publicId}.jpg` };
function mediaModule(value = asset) {
  return load('src/lib/cloudinary.ts', { './types': types }, { process: { env: secrets }, fetch: async () => ({ ok: true, json: async () => value }) });
}

test('Cloudinary signature exposes no secret and fixes the upload scope', () => {
  const cloud = mediaModule();
  const signed = cloud.signUpload('image');
  assert.match(signed.params.public_id, /^mert-paketleme\/image\//);
  assert.equal(signed.params.overwrite, 'false');
  assert.equal(signed.params.allowed_formats.includes('svg'), false);
  assert.equal(JSON.stringify(signed).includes(secrets.CLOUDINARY_API_SECRET), false);
});

test('media receipts bind the URL, resource type and administrator', async () => {
  const cloud = mediaModule();
  const receipt = await cloud.verifyUpload(publicId, 'image', 'admin@example.test');
  assert.equal(cloud.readMediaReceipt(receipt.token, 'image', 'admin@example.test'), asset.secure_url);
  assert.throws(() => cloud.readMediaReceipt(receipt.token, 'video', 'admin@example.test'));
  assert.throws(() => cloud.readMediaReceipt(receipt.token, 'image', 'other@example.test'));
  assert.throws(() => cloud.readMediaReceipt(receipt.token + 'x', 'image', 'admin@example.test'));
  const parts = receipt.token.split('.');
  const payload = JSON.parse(Buffer.from(parts[0], 'base64url').toString());
  payload.url = 'https://example.test/not-our-image.jpg';
  assert.throws(() => cloud.readMediaReceipt(Buffer.from(JSON.stringify(payload)).toString('base64url') + '.' + parts[1], 'image', 'admin@example.test'));
});

test('video verification accepts 100 MB and rejects larger files', async () => {
  const id = publicId.replace('/image/', '/video/');
  const video = { ...asset, public_id: id, resource_type: 'video', format: 'mp4', bytes: 100 * 1024 * 1024, secure_url: `https://res.cloudinary.com/test-cloud/video/upload/v1/${id}.mp4` };
  const receipt = await mediaModule(video).verifyUpload(id, 'video', 'admin@example.test');
  assert.equal(receipt.url, video.secure_url);
  await assert.rejects(mediaModule({ ...video, bytes: video.bytes + 1 }).verifyUpload(id, 'video', 'admin@example.test'));
});

test('Cloudinary metadata rejects foreign, oversized and unsupported assets', async () => {
  await assert.rejects(mediaModule().verifyUpload('foreign/image', 'image', 'admin@example.test'));
  for (const invalid of [{ ...asset, bytes: 3 * 1024 * 1024 }, { ...asset, format: 'svg' }, { ...asset, secure_url: 'https://example.test/image.jpg' }, { ...asset, resource_type: 'video' }]) {
    await assert.rejects(mediaModule(invalid).verifyUpload(publicId, 'image', 'admin@example.test'));
  }
});

function memoryDatabase(conflict = false) {
  let payload = { categories: [{ id: '1', slug: 'one', name: 'One', image: '/one.jpg' }], products: [], posts: [] };
  let revision = 0;
  let conflictPending = conflict;
  const statements = [];
  function sql(strings, ...values) {
    const text = strings.join('?');
    const query = { text, values, then(resolve, reject) {
      try {
        if (text.startsWith('SELECT payload, revision')) return Promise.resolve([{ payload: structuredClone(payload), revision }]).then(resolve, reject);
        if (text.startsWith('UPDATE mert_site_state')) {
          if (conflictPending) { conflictPending = false; payload.categories.push({ id: '2', name: 'Concurrent', slug: 'concurrent', image: '' }); revision++; return Promise.resolve([]).then(resolve, reject); }
          if (values[1] !== revision) return Promise.resolve([]).then(resolve, reject);
          payload = JSON.parse(values[0]); revision++;
          return Promise.resolve([{ revision }]).then(resolve, reject);
        }
        return Promise.resolve([]).then(resolve, reject);
      } catch (error) { return Promise.reject(error).then(resolve, reject); }
    } };
    return query;
  }
  sql.transaction = async (queries) => { statements.push(...queries.map((query) => query.text)); return queries.map(() => []); };
  const database = load('src/lib/database.ts', { '@neondatabase/serverless': { neon: () => sql }, fs: { existsSync: () => false }, '../../data/store.json': structuredClone(payload), './types': types }, { process: { env: { DATABASE_URL: 'mocked-only' }, cwd: () => root } });
  const store = load('src/lib/store.ts', { fs: { readFileSync() { throw Error('Unexpected disk read'); }, writeFileSync() { throw Error('Unexpected disk write'); } }, react: { cache: (fn) => fn }, 'next/server': { connection: async () => {} }, './database': database, './types': types }, { process: { env: { DATABASE_URL: 'mocked-only' }, cwd: () => root } });
  return { store, database, statements, data: () => structuredClone(payload) };
}

test('optimistic concurrency retains another administrator’s update', async () => {
  const { store, data } = memoryDatabase(true);
  await store.saveCategory({ name: 'New category' });
  assert.equal(data().categories.length, 3);
  assert(data().categories.some((category) => category.name === 'Concurrent'));
  assert(data().categories.some((category) => category.name === 'New category'));
});

test('one best seller, confirmation, media retention and ordering', async () => {
  const { store, data } = memoryDatabase();
  const normal = await store.saveProduct({ name: 'Normal', categoryId: '1' });
  const first = await store.saveProduct({ name: 'Best', categoryId: '1', featured: true, images: ['/detail.jpg'], video: '/movie.mp4' });
  await assert.rejects(store.saveProduct({ name: 'Replacement', categoryId: '1', featured: true }));
  const replacement = await store.saveProduct({ name: 'Replacement', categoryId: '1', featured: true }, first.id);
  assert.equal((await store.getProducts('1'))[0].id, replacement.id);
  assert.equal(data().products.find((product) => product.id === first.id).featured, false);
  await store.saveProduct({ id: first.id, name: 'Best edited', categoryId: '1' });
  const retained = data().products.find((product) => product.id === first.id);
  assert.deepEqual(retained.images, ['/detail.jpg']); assert.equal(retained.video, '/movie.mp4');
  await store.saveProduct({ id: first.id, name: 'Best edited', categoryId: '1', images: [], video: '' });
  assert.equal(data().products.find((product) => product.id === first.id).video, '');
  assert(data().products.some((product) => product.id === normal.id));
});

test('setup creates only application tables and never overwrites existing rows', async () => {
  const { database, statements } = memoryDatabase();
  await database.initializeDatabase();
  assert.equal(statements.filter((text) => text.startsWith('CREATE TABLE IF NOT EXISTS')).length, 3);
  assert(statements.filter((text) => text.startsWith('INSERT')).every((text) => text.includes('ON CONFLICT (id) DO NOTHING')));
  assert(statements.every((text) => !/DROP|TRUNCATE|DELETE/.test(text)));
});

test('upload API blocks unauthorized and cross-origin requests before signing', async () => {
  let email = 'denied@example.test';
  let calls = 0;
  const route = load('src/app/api/admin/uploads/route.ts', { 'next/server': { NextResponse: { json: (body, options) => ({ body, status: options.status }) } }, '@/auth': { auth: async () => ({ user: { email } }), ALLOWED_EMAILS: ['allowed@example.test'] }, '@/lib/types': types, '@/lib/cloudinary': { signUpload() { calls++; return {}; }, verifyUpload() { calls++; return {}; } } });
  const request = (origin) => new Request('https://site.example.test/api/admin/uploads', { method: 'POST', headers: { origin }, body: JSON.stringify({ operation: 'sign', kind: 'image' }) });
  assert.equal((await route.POST(request('https://site.example.test'))).status, 403);
  email = 'allowed@example.test';
  assert.equal((await route.POST(request('https://other.example.test'))).status, 403);
  assert.equal(calls, 0);
  assert.equal((await route.POST(request('https://site.example.test'))).status, 200);
  assert.equal(calls, 1);
});

test('large photos are resized, compressed and released before upload', async () => {
  let closed = false;
  const sizes = [];
  const canvas = { width: 0, height: 0, getContext: () => ({ drawImage() {} }), toBlob(done) { sizes.push([canvas.width, canvas.height]); done(new Blob([new Uint8Array(sizes.length < 5 ? 3 * 1024 * 1024 : 500000)], { type: 'image/webp' })); } };
  const photos = load('src/lib/photo-upload.ts', {}, { createImageBitmap: async () => ({ width: 6000, height: 4000, close() { closed = true; } }), document: { createElement: () => canvas } });
  const original = new File([new Uint8Array(4 * 1024 * 1024)], 'machine.jpg', { type: 'image/jpeg' });
  const result = await photos.optimizePhoto(original);
  assert.equal(result.type, 'image/webp');
  assert.equal(result.name, 'machine.webp');
  assert(result.size <= photos.PHOTO_UPLOAD_LIMIT);
  assert(sizes.length >= 5);
  assert(sizes.every(([width, height]) => width <= 2400 && Math.abs(width / height - 1.5) < 0.01));
  assert(closed);
});

test('small photos pass through; invalid, huge and animated GIF inputs stay bounded', async () => {
  const photos = load('src/lib/photo-upload.ts', {}, { createImageBitmap() { throw Error('Unexpected decode'); } });
  const small = new File(['small'], 'small.png', { type: 'image/png' });
  assert.equal(await photos.optimizePhoto(small), small);
  assert.equal(photos.photoError(new File([new Uint8Array(4 * 1024 * 1024)], 'large.jpg', { type: 'image/jpeg' })), '');
  await assert.rejects(photos.optimizePhoto(new File([new Uint8Array(21 * 1024 * 1024)], 'huge.jpg', { type: 'image/jpeg' })));
  await assert.rejects(photos.optimizePhoto(new File([new Uint8Array(3 * 1024 * 1024)], 'animated.gif', { type: 'image/gif' })));
  await assert.rejects(photos.optimizePhoto(new File(['bad'], 'bad.svg', { type: 'image/svg+xml' })));
});

test('photo decoder resources close on encoding failure', async () => {
  let closed = false;
  const photos = load('src/lib/photo-upload.ts', {}, { createImageBitmap: async () => ({ width: 3000, height: 2000, close() { closed = true; } }), document: { createElement: () => ({ getContext: () => ({ drawImage() {} }), toBlob: (done) => done(null) }) } });
  await assert.rejects(photos.optimizePhoto(new File([new Uint8Array(3 * 1024 * 1024)], 'photo.jpg', { type: 'image/jpeg' })));
  assert(closed);
});

test('gallery reordering preserves mixed saved/new photos and rejects injected references', () => {
  const gallery = load('src/lib/gallery-order.ts', { './types': types });
  const original = ['first', 'second', 'third'];
  assert.deepEqual(Array.from(gallery.movePhoto(original, 2, 0)), ['third', 'first', 'second']);
  assert.deepEqual(original, ['first', 'second', 'third']);
  assert.equal(gallery.movePhoto(original, 0, -1), original);
  assert.deepEqual(Array.from(gallery.orderedGallery(['/one', '/two'], ['/new'], ['existing:/two', 'new:0', 'existing:/one'])), ['/two', '/new', '/one']);
  assert.throws(() => gallery.orderedGallery(['/one'], [], ['existing:https://foreign.example/image.jpg']));
  assert.throws(() => gallery.orderedGallery(['/one', '/two'], [], ['existing:/one', 'existing:/one']));
});

test('product save keeps the selected mixed gallery order', async () => {
  let saved;
  const gallery = load('src/lib/gallery-order.ts', { './types': types });
  const actions = load('src/app/admin/actions.ts', {
    'next/cache': { revalidatePath() {} },
    '@/auth': { auth: async () => ({ user: { email: 'allowed@example.test' } }), ALLOWED_EMAILS: ['allowed@example.test'] },
    '@/lib/store': { getCategories: async () => [{ id: '1' }], getProducts: async () => [{ id: 'p1', name: 'Machine', images: ['/one', '/two'], video: '/movie.mp4' }], saveProduct: async (value) => { saved = value; } },
    '@/lib/database': {}, '@/lib/cloudinary': { readMediaReceipt: (value) => value ? '/new' : null }, '@/lib/gallery-order': gallery, '@/lib/types': types,
  });
  const data = new FormData();
  for (const [key, value] of [['id', 'p1'], ['name', 'Machine'], ['categoryId', '1'], ['mediaFields', '1'], ['retainedImage', '/one'], ['retainedImage', '/two'], ['galleryUpload', 'mock-receipt'], ['galleryOrder', 'new:0'], ['galleryOrder', 'existing:/two'], ['galleryOrder', 'existing:/one']]) data.append(key, value);
  const result = await actions.saveProductAction(data);
  assert.equal(result.error, undefined);
  assert.deepEqual(Array.from(saved.images), ['/new', '/two', '/one']);
  assert.equal(saved.video, '/movie.mp4');
});

test('editor scrolls its body separately from footer and upload overlay', () => {
  const rig = hooks();
  const editor = load('src/components/AdminEditor.tsx', clients(rig.react));
  const tree = rig.render(editor.default, { editing: true, title: 'Product', back: '/admin', children: 'form', formFooter: true });
  const dialog = elements(tree).find((node) => node.type === 'dialog');
  const [, body, footer, overlay] = dialog.props.children.props.children;
  assert.match(body.props.className, /overflow-y-auto/);
  assert.equal(footer.props.id, 'admin-editor-footer');
  assert.match(footer.props.className, /shrink-0/);
  assert.match(overlay.props.className, /absolute inset-0/);
});

test('fixed submit control targets its form and waits for preview processing', () => {
  const target = {};
  const rig = hooks({ footer: target, photoJobs: 1 });
  const form = load('src/components/AdminForm.tsx', clients(rig.react, { '@/lib/media-upload': {} }));
  const tree = rig.render(form.default, { action() {}, submitLabel: 'Ekle', children: 'fields' });
  const portal = tree.props.children[1];
  const button = elements(portal).find((node) => node.type === 'button');
  assert.equal(portal.target, target);
  assert.equal(button.props.form, tree.props.id);
  assert.equal(button.props.disabled, true);
});

test('form editor never dismisses on a backdrop click', () => {
  let navigations = 0;
  const rig = hooks();
  const editor = load('src/components/AdminEditor.tsx', clients(rig.react, { 'next/navigation': { useRouter: () => ({ push() { navigations++; } }) } }));
  const tree = rig.render(editor.default, { editing: true, title: 'Product', back: '/admin', children: 'form', formFooter: true });
  const dialog = elements(tree).find((node) => node.type === 'dialog');
  const backdrop = {};
  dialog.props.onClick({ target: backdrop, currentTarget: backdrop });
  assert.equal(navigations, 0);
});

test('editor guards close and Escape while processing, and confirms dirty dismissal', () => {
  let navigations = 0;
  let consent = false;
  const rig = hooks();
  const editor = load('src/components/AdminEditor.tsx', clients(rig.react, { 'next/navigation': { useRouter: () => ({ push() { navigations++; } }) } }), { window: { confirm: () => consent } });
  const tree = rig.render(editor.default, { editing: true, title: 'Product', back: '/admin', children: 'form', formFooter: true });
  const state = tree.props.value;
  const dialog = elements(tree).find((node) => node.type === 'dialog');
  state.setBusy(true); dialog.props.onCancel({ preventDefault() {} });
  state.setBusy(false);
  const finish = state.beginPhotoTask(); dialog.props.onCancel({ preventDefault() {} }); finish(); finish();
  state.markDirty(); dialog.props.onCancel({ preventDefault() {} });
  assert.equal(navigations, 0);
  consent = true; dialog.props.onCancel({ preventDefault() {} });
  assert.equal(navigations, 1);
});

test('photo previews use serialized workers without main-thread decoding', async () => {
  let active = 0, maxActive = 0, terminated = 0;
  class FakeWorker {
    postMessage(job) { assert.equal(job.mode, 'preview'); active++; maxActive = Math.max(maxActive, active); setTimeout(() => this.onmessage({ data: { blob: new Blob(['thumbnail'], { type: 'image/webp' }) } }), 5); }
    terminate() { active--; terminated++; }
  }
  const photos = load('src/lib/photo-upload.ts', {}, { Worker: FakeWorker, OffscreenCanvas: class {}, createImageBitmap() { throw Error('Main thread decode must not run'); } });
  const file = new File(['photo'], 'photo.jpg', { type: 'image/jpeg' });
  const results = await Promise.all([photos.photoPreview(file), photos.photoPreview(file)]);
  assert.equal(results.length, 2); assert.equal(maxActive, 1); assert.equal(terminated, 2); assert.equal(active, 0);
});

test('photo worker bounds preview dimensions and releases its decoded bitmap', async () => {
  const sent = [];
  let closed = false;
  const drawn = [];
  const scope = { postMessage: (value) => sent.push(value) };
  class Canvas {
    constructor(width, height) { this.width = width; this.height = height; }
    getContext() { return { drawImage: () => drawn.push([this.width, this.height]) }; }
    async convertToBlob() { return new Blob(['thumbnail'], { type: 'image/webp' }); }
  }
  load('src/lib/photo-worker.ts', {}, { globalThis: scope, OffscreenCanvas: Canvas, createImageBitmap: async () => ({ width: 6000, height: 4000, close() { closed = true; } }) });
  await scope.onmessage({ data: { file: new File(['photo'], 'photo.jpg', { type: 'image/jpeg' }), mode: 'preview' } });
  assert(sent[0].blob.size <= 120 * 1024);
  assert(drawn.every(([width, height]) => width <= 480 && height <= 480)); assert(closed);
});

test('canceling background photo processing terminates its worker', async () => {
  let stopped = 0;
  class FakeWorker { postMessage() {} terminate() { stopped++; } }
  const photos = load('src/lib/photo-upload.ts', {}, { Worker: FakeWorker, OffscreenCanvas: class {} });
  const controller = new AbortController();
  const job = photos.optimizePhoto(new File([new Uint8Array(3 * 1024 * 1024)], 'photo.jpg', { type: 'image/jpeg' }), controller.signal);
  await new Promise((resolve) => setTimeout(resolve, 0)); controller.abort();
  await assert.rejects(job, (error) => error.name === 'AbortError'); assert.equal(stopped, 1);
});

test('cover selection renders a small thumbnail rather than the original photo', async () => {
  let jobs = 0;
  const context = { beginPhotoTask() { jobs++; return () => jobs--; } };
  const rig = hooks(context);
  const original = new File([new Uint8Array(3 * 1024 * 1024)], 'machine.jpg', { type: 'image/jpeg' });
  const thumbnail = new Blob(['thumb'], { type: 'image/webp' });
  const created = [];
  const picker = load('src/components/PhotoPicker.tsx', clients(rig.react, { '@/lib/photo-upload': { photoError: () => '', photoPreview: async () => thumbnail } }), { URL: { createObjectURL(blob) { created.push(blob); return 'blob:small-preview'; }, revokeObjectURL() {} } });
  let tree = rig.render(picker.default, {});
  const input = elements(tree).find((node) => node.type === 'input');
  const control = { files: [original], setCustomValidity() {} };
  await input.props.onChange({ currentTarget: control });
  tree = rig.render(picker.default, {});
  assert.equal(elements(tree).find((node) => node.type === 'img').props.src, 'blob:small-preview');
  assert.equal(created[0], thumbnail); assert.notEqual(created[0], original); assert.equal(jobs, 0); assert.equal(control.files[0], original);
});

test('video selection does not decode or mount a video until explicitly previewed', () => {
  const rig = hooks({ markDirty() {} });
  const component = load('src/components/ProductVideoField.tsx', clients(rig.react), { URL: { createObjectURL: () => 'blob:video', revokeObjectURL() {} } });
  let tree = rig.render(component.default, { uploadsEnabled: true });
  const input = elements(tree).find((node) => node.type === 'input');
  input.props.onChange({ currentTarget: { files: [new File(['video'], 'machine.mp4', { type: 'video/mp4' })] } });
  tree = rig.render(component.default, { uploadsEnabled: true });
  assert.equal(elements(tree).filter((node) => node.type === 'video').length, 0);
  elements(tree).find((node) => node.type === 'button' && node.props.children === 'Videoyu önizle').props.onClick();
  tree = rig.render(component.default, { uploadsEnabled: true });
  assert.equal(elements(tree).find((node) => node.type === 'video').props.preload, 'none');
});

test('upload reports byte progress and retries verification without re-uploading', async () => {
  let transfers = 0, signs = 0, verifications = 0;
  class XHR {
    constructor() { this.upload = {}; }
    open() {}
    send() { transfers++; this.upload.onprogress({ lengthComputable: true, loaded: 50, total: 100 }); this.status = 200; this.onload(); }
    abort() { this.onabort(); }
  }
  const uploader = load('src/lib/media-upload.ts', { './photo-upload': { optimizePhoto: async (file) => file, photoError: () => '' } }, { XMLHttpRequest: XHR, fetch: async (_, options) => {
    const body = JSON.parse(options.body);
    if (body.operation === 'sign') { signs++; return { ok: true, json: async () => ({ url: 'https://uploads.example.test', apiKey: 'public', signature: 'test', params: { public_id: 'test-id' } }) }; }
    verifications++;
    return { ok: verifications > 1, json: async () => verifications === 1 ? { error: 'Temporary verification failure' } : { url: '/verified.jpg', token: 'test-receipt' } };
  } });
  const file = new File(['photo'], 'photo.jpg', { type: 'image/jpeg' });
  const data = () => { const value = new FormData(); value.append('image', file); return value; };
  const events = [];
  await assert.rejects(uploader.prepareMedia(data(), (event) => events.push(event)));
  const retry = data(); await uploader.prepareMedia(retry, (event) => events.push(event));
  assert.equal(signs, 1); assert.equal(transfers, 1); assert.equal(verifications, 2);
  assert(events.some((event) => event.stage === 'uploading' && event.percent === 50));
  assert.equal(retry.get('image'), null); assert.equal(retry.get('imageUpload'), 'test-receipt');
});

test('upload cancellation aborts the transfer before receipt or saving', async () => {
  let requests = 0;
  class XHR { constructor() { this.upload = {}; } open() {} send() {} abort() { this.onabort(); } }
  const uploader = load('src/lib/media-upload.ts', { './photo-upload': { optimizePhoto: async (file) => file, photoError: () => '' } }, { XMLHttpRequest: XHR, fetch: async () => { requests++; return { ok: true, json: async () => ({ url: 'https://uploads.example.test', apiKey: 'public', signature: 'test', params: { public_id: 'test-id' } }) }; } });
  const controller = new AbortController();
  const data = new FormData(); data.append('image', new File(['photo'], 'photo.jpg', { type: 'image/jpeg' }));
  const job = uploader.prepareMedia(data, () => {}, controller.signal);
  await new Promise((resolve) => setTimeout(resolve, 0)); controller.abort();
  await assert.rejects(job, (error) => error.name === 'AbortError');
  assert.equal(requests, 1); assert.equal(data.get('imageUpload'), null);
});

test('failed uploads and saves keep form values and never navigate away', async () => {
  let attempt = 0, saves = 0, navigations = 0;
  const busy = [];
  const rig = hooks({ footer: {}, overlay: {}, photoJobs: 0, setBusy: (value) => busy.push(value), markClean() {} });
  class Snapshot { constructor(form) { this.form = form; } }
  const component = load('src/components/AdminForm.tsx', clients(rig.react, { '@/lib/media-upload': { prepareMedia: async () => { if (attempt++ === 0) throw Error('Upload failed'); } }, 'next/navigation': { useRouter: () => ({ replace() { navigations++; }, refresh() { navigations++; } }) } }), { FormData: Snapshot });
  const values = { name: 'Machine', description: 'Keep this text', image: new File(['photo'], 'photo.jpg', { type: 'image/jpeg' }) };
  const control = { values, reset() { throw Error('Form must not reset'); } };
  const props = { children: 'fields', submitLabel: 'Ekle', action: async () => { saves++; return { error: 'Database temporarily unavailable' }; } };
  await rig.render(component.default, props).props.onSubmit({ preventDefault() {}, currentTarget: control });
  await rig.render(component.default, props).props.onSubmit({ preventDefault() {}, currentTarget: control });
  assert.equal(saves, 1); assert.equal(navigations, 0); assert.equal(control.values, values);
  assert(elements(rig.render(component.default, props)).some((node) => node.props?.role === 'alert'));
  assert.deepEqual(busy, [true, false, true, false]);
});

test('category form contains only a name and square photo picker', async () => {
  const page = load('src/app/admin/categories/page.tsx', { 'react/jsx-runtime': { jsx, jsxs: jsx }, 'next/link': 'link', '@/components/AdminEditor': 'editor', '@/components/AdminForm': 'admin-form', '@/components/PhotoPicker': 'photo-picker', '@/lib/cloudinary': { cloudinaryConfigured: () => true }, '@/lib/store': { getCategories: async () => [], getProducts: async () => [] }, '../actions': {} });
  const tree = await page.default({ searchParams: Promise.resolve({ new: '1' }) });
  const inputs = elements(tree).filter((node) => node.type === 'input');
  assert(inputs.some((node) => node.props.name === 'name'));
  assert(!inputs.some((node) => node.props.name === 'nameEn'));
  assert(elements(tree).some((node) => node.type === 'photo-picker'));
});

async function adminProductPage(query) {
  const product = { id: 'p1', name: 'Packing machine', slug: 'packing-machine', categoryId: 'c1', description: 'Product details', image: '/machine.jpg', images: ['/detail.jpg'], video: '/movie.mp4' };
  const page = load('src/app/admin/products/page.tsx', { 'react/jsx-runtime': { jsx, jsxs: jsx }, 'next/link': 'link', 'next/image': 'image', '@/components/AdminEditor': 'editor', '@/components/AdminForm': 'admin-form', '@/components/ProductMediaFields': 'media-fields', '@/components/CategoryPicker': 'category-picker', '@/components/ProductGalleryFields': 'gallery-fields', '@/components/ProductGallery': 'product-gallery', '@/lib/cloudinary': { cloudinaryConfigured: () => true }, '@/lib/store': { getCategories: async () => [{ id: 'c1', name: 'Machines' }], getProducts: async () => [product] }, '../actions': {} });
  return page.default({ searchParams: Promise.resolve(query) });
}

test('admin product cards open a preview and preserve category filtering', async () => {
  const tree = await adminProductPage({ category: 'c1' });
  assert(elements(tree).some((node) => node.type === 'link' && node.props.href === '/admin/products?category=c1&view=p1'));
  const photo = elements(tree).find((node) => node.type === 'img' && node.props.src === '/machine.jpg');
  assert.match(photo.props.className, /w-full/);
});

test('admin product preview includes gallery, description and public detail link', async () => {
  const tree = await adminProductPage({ category: 'c1', view: 'p1' });
  const editor = elements(tree).find((node) => node.type === 'editor');
  assert.equal(editor.props.wide, true);
  const gallery = elements(tree).find((node) => node.type === 'product-gallery');
  assert.equal(gallery.props.image, '/machine.jpg'); assert.equal(gallery.props.video, '/movie.mp4');
  assert(elements(tree).some((node) => node.props?.children === 'Product details'));
  assert(elements(tree).some((node) => node.type === 'link' && node.props.href === '/tr/urun/packing-machine'));
});

test('category photo-only edits preserve existing English translations', async () => {
  let saved;
  const actions = load('src/app/admin/actions.ts', { 'next/cache': { revalidatePath() {} }, '@/auth': { auth: async () => ({ user: { email: 'allowed@example.test' } }), ALLOWED_EMAILS: ['allowed@example.test'] }, '@/lib/store': { getCategories: async () => [{ id: '1', name: 'Makine', nameEn: 'Machine', image: '/old.jpg' }], saveCategory: async (value) => { saved = value; } }, '@/lib/database': {}, '@/lib/cloudinary': { readMediaReceipt: () => null }, '@/lib/gallery-order': {}, '@/lib/types': types });
  const data = new FormData(); data.set('id', '1'); data.set('name', 'Makine');
  const result = await actions.saveCategoryAction(data);
  assert.equal(result.error, undefined); assert.equal(saved.nameEn, 'Machine'); assert.equal(saved.image, '/old.jpg');
});
