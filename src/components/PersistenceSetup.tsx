import AdminForm from "./AdminForm";
import { initializeDatabaseAction } from "@/app/admin/actions";

export default function PersistenceSetup({ status, mediaReady }: { status: "missing" | "setup" | "ready" | "error"; mediaReady: boolean }) {
  if (status === "ready" && mediaReady) return <div className="mb-4 flex flex-wrap items-center gap-2 text-[10px] text-zinc-500"><span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />Neon hazır · Cloudinary ayarları mevcut</div>;
  return <section className="mb-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-950">
    <h2 className="text-sm font-semibold">Kalıcı kayıt bağlantıları</h2>
    <p className="mt-2 text-xs leading-relaxed">{status === "missing" ? "DATABASE_URL ortam değişkeni bulunamadı. Vercel’de Neon bağlantısını ve dağıtım ortamını kontrol edin." : status === "error" ? "Neon bağlantısı doğrulanamadı. Bağlantı adresini, parolayı ve hizmet durumunu kontrol edin. Başlangıç içerikleri gösteriliyor; yeni kayıt yapılamaz." : status === "setup" ? "Neon bağlantısı mevcut. İlk kullanım için tabloları oluşturup mevcut kategori, ürün, blog ve varsa iletişim mesajlarını aktarın. Var olan veritabanı kayıtlarının üzerine yazılmaz." : "Neon veritabanı hazır."}</p>
    {!mediaReady && <p className="mt-2 text-xs leading-relaxed">Cloudinary için CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY ve CLOUDINARY_API_SECRET değişkenlerini ekleyip yeniden dağıtın. Gizli anahtarlar tarayıcıya gönderilmez.</p>}
    {status === "setup" && <AdminForm action={initializeDatabaseAction} confirmMessage="Bu işlem eksik Neon tablolarını oluşturup başlangıç içeriklerini aktaracak. Mevcut kayıtların üzerine yazılmayacak. Devam edilsin mi?" className="mt-3 space-y-3"><button className="rounded-lg bg-zinc-950 px-4 py-2.5 text-xs font-semibold text-white">Veritabanını hazırla ve içerikleri aktar</button></AdminForm>}
  </section>;
}
