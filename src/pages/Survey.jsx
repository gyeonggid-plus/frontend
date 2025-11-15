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

const SEX_OPTIONS = [
  { value: "M", label: "남성" },
  { value: "F", label: "여성" },
];

export default function Survey() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { token, completeSurvey, user } = useAuth();
  const navigate = useNavigate();

  const [region, setRegion] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const parsedAge = Number(age);

    if (!region || !sex || !age) {
      setError("거주 지역, 나이, 성별을 모두 입력해 주세요.");
      return;
    }

    if (!Number.isInteger(parsedAge) || parsedAge <= 0) {
      setError("나이는 1 이상의 정수로 입력해 주세요.");
      return;
    }

    if (!user?.email) {
      setError("로그인 정보에서 이메일을 찾을 수 없습니다.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/api/auth/post_inform`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          email: user.email,
          age: parsedAge,
          location: region,
          sex,
        }),
      });
      if (!res.ok) {
        throw new Error("failed to save user info");
      }
      completeSurvey({ age: parsedAge, location: region, sex });
      navigate("/", { replace: true });
    } catch (err) {
      console.error(err);
      setError("정보 저장에 실패했습니다. 다시 시도해 주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-auto max-w-2xl rounded-3xl bg-white p-8 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">
        환영합니다! 기본 정보를 입력해 주세요
      </h1>
      <p className="mt-2 text-sm text-slate-500">
        맞춤 복지 추천을 위해 거주 지역, 나이, 성별을 입력해 주세요. 이후
        언제든지 마이페이지에서 변경할 수 있습니다.
      </p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-5">
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

        <label className="block text-sm font-semibold text-slate-700">
          나이
          <input
            type="number"
            min={1}
            value={age}
            onChange={(e) => setAge(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-[#00a69c] focus:outline-none"
            placeholder="만 나이를 입력하세요"
          />
        </label>

        <div className="text-sm font-semibold text-slate-700">
          성별
          <div className="mt-2 flex flex-wrap gap-3">
            {SEX_OPTIONS.map((option) => (
              <button
                type="button"
                key={option.value}
                onClick={() => setSex(option.value)}
                className={`rounded-2xl border px-4 py-2 text-sm transition ${
                  sex === option.value
                    ? "border-[#00a69c] bg-[#00a69c]/10 text-[#00a69c]"
                    : "border-slate-200 text-slate-600"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

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
