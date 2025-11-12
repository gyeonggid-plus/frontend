export default function LoginPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white px-6">
      {/* 로고 + 서비스 이름 */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-12 h-12 rounded-full bg-[#0C8CE9] flex items-center justify-center text-white font-bold text-xl">
          D+
        </div>
        <h1 className="text-[#0C8CE9] text-sm mt-2 font-semibold">
          Gyeonggi D+
        </h1>
        <p className="text-gray-800 text-lg font-semibold mt-1 text-center leading-tight">
          도민의 복지 비서, 경기똑D+
        </p>
      </div>

      {/* 가운데 이미지 */}
      <div className="w-40 h-40 bg-gray-200 rounded-md mb-8 overflow-hidden flex items-center justify-center">
        {/* 추후 이미지가 있다면 <Image /> 로 교체 */}
        <span className="text-gray-400 text-sm">이미지 들어갈 자리</span>
      </div>

      {/* 로그인 버튼 */}
      <div className="w-full max-w-sm flex flex-col gap-3">
        <button className="w-full border border-gray-300 rounded-lg py-3 flex items-center justify-center gap-2 text-gray-700 hover:bg-gray-50 transition">
          <img src="/icons/google.svg" alt="google" className="w-5 h-5" />
          Google로 로그인
        </button>

        <button className="w-full rounded-lg py-3 flex items-center justify-center gap-2 bg-[#FEE500] text-gray-900 font-medium hover:brightness-95 transition">
          <img src="/icons/kakao.svg" alt="kakao" className="w-5 h-5" />
          카카오로 로그인
        </button>
      </div>

      <p className="text-gray-400 text-xs mt-8">
        복지 사각지대 없는 경기도를 위해
      </p>
    </main>
  );
}
