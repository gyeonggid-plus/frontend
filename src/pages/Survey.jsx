import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const REGIONS = [
  "경기도 전체",
  "수원시",
  "성남시",
  "의정부시",
  "안양시",
  "부천시",
  "광명시",
  "평택시",
  "동두천시",
  "안산시",
  "고양시",
  "과천시",
  "구리시",
  "남양주시",
  "오산시",
  "시흥시",
  "군포시",
  "의왕시",
  "하남시",
  "용인시",
  "파주시",
  "이천시",
  "안성시",
  "김포시",
  "화성시",
  "광주시",
  "양주시",
  "포천시",
  "여주시",
];

export default function Survey() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { token, completeSurvey } = useAuth();
  const navigate = useNavigate();

  const [region, setRegion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!region) {
      setError("거주 지역을 선택해 주세요.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/survey/region`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ region }),
      });
      if (!res.ok) {
        throw new Error("failed to save survey");
      }
      completeSurvey();
      navigate("/", { replace: true });
    } catch (err) {
      console.warn("설문 저장 실패, 임시로 통과 처리합니다.", err);
      completeSurvey();
      navigate("/", { replace: true });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">환영합니다! 거주 지역을 알려주세요</h1>
      <p className="mt-2 text-sm text-slate-500">
        맞춤 복지 추천을 위해 기본 지역 정보를 한 번만 입력해 주세요. 이후 언제든지 마이페이지에서 변경할 수 있습니다.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block text-sm font-semibold text-slate-700">
          거주 지역
          <select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-[#00a69c] focus:outline-none"
          >
            <option value="">지역을 선택하세요</option>
            {REGIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-[#00a69c] py-3 text-sm font-semibold text-white transition hover:bg-[#009085] disabled:opacity-40"
        >
          {loading ? "저장 중..." : "제출하고 시작하기"}
        </button>
      </form>
    </section>
  );
}
