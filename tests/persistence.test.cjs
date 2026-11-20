const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const ts = require('typescript');

const root = path.join(__dirname, '..');
function load(file, mocks = {}, globals = {}) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const code = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } }).outputText;
  const mod = { exports: {} };
  vm.runInNewContext(code, { module: mod, exports: mod.exports, require(name) { if (name in mocks) return mocks[name]; if (name === 'server-only') return {}; if (['crypto', 'path'].includes(name)) return require(name); throw Error(`Unexpected import: ${name}`); }, Buffer, URL, AbortSignal, FormData, File, structuredClone, process: { env: {}, cwd: () => root }, ...globals });
  return mod.exports;
}
const types = load('src/lib/types.ts');
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
