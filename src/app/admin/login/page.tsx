import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/admin");

  return (
    <div className="max-w-sm mx-auto mt-24 border border-zinc-200 bg-white rounded-xl p-8 text-center">
      <h1 className="text-xl font-bold">Admin Girişi</h1>
      <p className="text-sm text-zinc-500 mt-2">
        Yetkili Google hesabınızla giriş yapın.
      </p>
      <form
        action={async () => {
          "use server";
          await signIn("google", { redirectTo: "/admin" });
        }}
        className="mt-6"
      >
        <button className="w-full bg-zinc-900 text-white font-semibold py-3 rounded-lg hover:bg-zinc-700">
          Google ile Giriş Yap
        </button>
      </form>
    </div>
  );
}
