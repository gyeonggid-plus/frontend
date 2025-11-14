import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BadgeCheck, CalendarDays, MapPin, MessageCircle, Search, Sparkles } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const FALLBACK_RECOMMENDATIONS = [
  {
    id: 1,
    title: "청년 주거비 지원",
    desc: "19~34세 무주택 청년에게 보증금과 월세를 지원합니다.",
    region: "수원시",
    category: "주거",
  },
  {
    id: 2,
    title: "경기 긴급복지",
    desc: "갑작스러운 위기 상황 가구에 생계·의료비를 신속하게 지원합니다.",
    region: "경기도",
    category: "긴급",
  },
  {
    id: 3,
    title: "돌봄 공백 SOS",
    desc: "돌봄 공백이 있는 가정에 돌봄 인력과 비용을 지원합니다.",
    region: "고양시",
    category: "돌봄",
  },
  {
    id: 4,
    title: "문화누리 카드",
    desc: "문화 생활을 지원하기 위해 연간 바우처를 제공합니다.",
    region: "경기도",
    category: "문화",
  },
  {
    id: 5,
    title: "아이돌봄 바우처",
    desc: "아이돌봄 시간이 필요한 가정에 시간당 지원을 제공합니다.",
    region: "성남시",
    category: "돌봄",
  },
  {
    id: 6,
    title: "에너지 바우처",
    desc: "저소득층 겨울철 난방비 및 여름철 냉방비를 지원합니다.",
    region: "경기도",
    category: "생활",
  },
];

const QUICK_ACTIONS = [
  { id: "finder", label: "맞춤 복지 찾기", desc: "조건 설정 후 추천 받기", icon: Search, path: "/search" },
  { id: "map", label: "복지 지도", desc: "가까운 센터 확인", icon: MapPin, path: "/map" },
  { id: "chat", label: "챗봇 상담", desc: "실시간 질문 응답", icon: MessageCircle, path: "/chat" },
];

const RECENT_ACTIVITIES = [
  { id: "1", title: "청년 주거비 지원 신청", status: "검토 중", date: "2025.02.03" },
  { id: "2", title: "복지 플래너 상담 예약", status: "완료", date: "2025.01.23" },
  { id: "3", title: "경기 긴급복지 문의", status: "답변 완료", date: "2025.01.18" },
];

export default function Home() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { user } = useAuth();
  const navigate = useNavigate();

  const [healthStatus, setHealthStatus] = useState("정상");
  const [recommendations, setRecommendations] = useState(FALLBACK_RECOMMENDATIONS);
  const [loadingBenefit, setLoadingBenefit] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadStatus() {
      try {
        const res = await fetch(`${BASE_URL}/api/health`);
        const data = await res.json();
        if (!cancelled) setHealthStatus(data.status || "정상");
      } catch {
        if (!cancelled) setHealthStatus("연결 오류");
      }
    }

    async function loadBenefits() {
      try {
        const res = await fetch(`${BASE_URL}/api/welfare/list`);
        if (!res.ok) throw new Error("failed to load benefits");
        const data = await res.json();
        if (!cancelled && Array.isArray(data?.welfare)) {
          const normalized = data.welfare.slice(0, 6).map((item, index) => ({
            id: item.id ?? index,
            title: item.title,
            desc: item.desc,
            region: item.region,
            category: item.category ?? "복지",
          }));
          setRecommendations(normalized);
        }
      } catch {
        // keep fallback data
      } finally {
        if (!cancelled) setLoadingBenefit(false);
      }
    }

    loadStatus();
    loadBenefits();

    return () => {
      cancelled = true;
    };
  }, [BASE_URL]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "좋은 아침입니다";
    if (hour < 18) return "반갑습니다";
    return "편안한 저녁 보내세요";
  }, []);

  return (
    <section className="space-y-8">
      <div className="grid gap-6 rounded-3xl bg-white p-8 shadow-sm lg:grid-cols-[2fr,1fr]">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-[#00a69c]">오늘의 정보</p>
          <h1 className="mt-2 text-3xl font-bold text-slate-900">
            {greeting}, {user?.name || "경기도민"}님!
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            지금 신청 가능한 맞춤 복지 혜택과 진행 상황을 한눈에 확인할 수 있어요.
          </p>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-slate-600">
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2">
              <Sparkles className="h-4 w-4 text-[#00a69c]" />
              추천 혜택 {recommendations.length}건
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2">
              <BadgeCheck className="h-4 w-4 text-[#00a69c]" />
              서비스 상태 {healthStatus}
            </span>
          </div>
        </div>
        <div className="rounded-2xl border border-dashed border-slate-200 p-4 text-sm text-slate-500">
          <h2 className="text-base font-semibold text-slate-900">진행 중인 신청</h2>
          <p className="mt-1">지금은 확인된 신청 내역이 없습니다.</p>
          <button
            className="mt-4 w-full rounded-2xl bg-[#00a69c] py-3 text-sm font-semibold text-white"
            onClick={() => navigate("/search")}
          >
            새 복지 찾기
          </button>
        </div>
      </div>

      <section className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-900">추천 복지 혜택</h2>
          <button className="text-sm font-semibold text-[#00a69c]" onClick={() => navigate("/search")}>
            전체 보기
          </button>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recommendations.map((benefit) => (
            <article key={benefit.id} className="rounded-2xl border border-slate-100 p-5 shadow-sm">
              <div className="text-xs font-semibold text-slate-400">
                {benefit.category} · {benefit.region}
              </div>
              <h3 className="mt-2 text-lg font-semibold text-slate-900">{benefit.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{benefit.desc}</p>
              <button
                onClick={() => navigate("/search")}
                className="mt-4 text-sm font-semibold text-[#00a69c] hover:underline"
              >
                자세히 보기
              </button>
            </article>
          ))}
          {!recommendations.length && !loadingBenefit && (
            <div className="col-span-full rounded-2xl border border-dashed border-slate-200 p-6 text-sm text-slate-500">
              추천 데이터를 불러오지 못했습니다.
            </div>
          )}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="text-xl font-semibold text-slate-900">빠른 메뉴</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            {QUICK_ACTIONS.map(({ id, label, desc, icon: Icon, path }) => (
              <button
                key={id}
                onClick={() => navigate(path)}
                className="flex items-center justify-between rounded-2xl border border-slate-100 px-4 py-3 text-left transition hover:border-[#00a69c]/40 hover:bg-[#00a69c]/5"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-2xl bg-[#00a69c]/10 p-3 text-[#00a69c]">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-base font-semibold text-slate-900">{label}</p>
                    <p className="text-xs text-slate-500">{desc}</p>
                  </div>
                </div>
                <span className="text-sm text-[#00a69c]">바로가기</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-semibold text-slate-900">최근 활동</h2>
          <ul className="mt-4 space-y-4 text-sm">
            {RECENT_ACTIVITIES.map((activity) => (
              <li key={activity.id} className="rounded-2xl border border-slate-100 p-4">
                <p className="font-semibold text-slate-900">{activity.title}</p>
                <div className="mt-1 flex items-center justify-between text-xs text-slate-500">
                  <span>{activity.status}</span>
                  <span>{activity.date}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </section>
  );
}
