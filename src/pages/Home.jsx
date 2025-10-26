import { useEffect, useState } from "react";

export default function Home() {
  const [status, setStatus] = useState("loading...");

  // .env 에서 BASE_URL 불러오기
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    fetch(`${BASE_URL}/api/health`)
      .then((res) => res.json())
      .then((data) => setStatus(JSON.stringify(data)))
      .catch(() => setStatus("서버 연결 실패"));
  }, [BASE_URL]);

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">
        경기 복지 도우미+
      </h1>
      <p className="text-gray-700 mb-4">
        복지 서비스를 지도와 챗봇으로 쉽게 찾아보세요!
      </p>
      <div className="p-4 bg-gray-100 border rounded-md inline-block">
        <p className="font-semibold">백엔드 연결 상태</p>
        <p>{status}</p>
      </div>
    </div>
  );
}
