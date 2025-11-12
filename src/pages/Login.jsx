import GoogleLoginButton from "../components/GoogleLoginButton";

export default function Login() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
      <div className="flex flex-col items-center mb-8 text-center">
        <div className="w-12 h-12 rounded-full bg-[#0C8CE9] flex items-center justify-center text-white font-bold text-xl">
          D+
        </div>
        <h1 className="text-[#0C8CE9] text-sm mt-2 font-semibold">Gyeonggi D+</h1>
        <p className="text-gray-800 text-lg font-semibold mt-1 leading-tight">
          도민의 복지 비서, 경기톡D+
        </p>
      </div>

      <div className="w-40 h-40 bg-gray-200 rounded-md mb-8 overflow-hidden flex items-center justify-center">
        <span className="text-gray-400 text-sm">아이콘 영역</span>
      </div>

      <div className="w-full max-w-sm flex flex-col gap-3">
        <GoogleLoginButton />

        <button className="w-full rounded-lg py-3 flex items-center justify-center gap-2 bg-[#FEE500] text-gray-900 font-medium hover:brightness-95 transition">
          <span className="text-base">카카오로 로그인</span>
        </button>
      </div>

      <p className="text-gray-400 text-xs mt-8">복지 사각지대 없는 경기도를 위해</p>
    </main>
  );
}

