import GoogleLoginButton from "../components/GoogleLoginButton";

export default function Login() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#00a69c] px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#00a69c]/10 text-[#00a69c]">
          <span className="text-2xl font-bold">D+</span>
        </div>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#00a69c]">도민의 복지 비서</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">경기D+</h1>
        <p className="mt-1 text-sm text-slate-500">간편하게 로그인하고 맞춤 혜택을 시작해 보세요.</p>

        <div className="mt-8 flex w-full flex-col gap-3">
          <div className="w-full rounded-full border border-slate-200 px-4 py-3">
            <GoogleLoginButton />
          </div>
        </div>

        <p className="mt-6 text-[11px] text-slate-400">복지 각지의 데이터를 연결하는 경기D+</p>
      </div>
    </main>
  );
}
