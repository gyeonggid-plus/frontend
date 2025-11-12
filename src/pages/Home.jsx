import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, CalendarDays, MapPin, MessageCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const FALLBACK_RECOMMENDATIONS = [
  {
    id: 1,
    title: "청년 월세 지원",
    desc: "만 19~34세 무주택 청년에게 월 최대 20만 원을 지원합니다.",
    region: "수원시",
    category: "주거",
  },
  {
    id: 2,
    title: "한부모 가족 돌봄비",
    desc: "돌봄 공백이 생긴 한부모 가정에 월 30만 원 돌봄비를 제공합니다.",
    region: "고양시",
    category: "돌봄",
  },
  {
    id: 3,
    title: "경기형 긴급복지",
    desc: "갑작스러운 위기 가구에 생계·의료비를 신속하게 지원합니다.",
    region: "경기도",
    category: "긴급",
  },
];

const UPCOMING_ALERTS = [
  { id: "apply-1", title: "청년 월세 지원 서류 제출", due: "D-3", action: "바로 제출" },
  { id: "visit-1", title: "복지센터 방문 상담", due: "11월 21일(목)", action: "길찾기" },
  { id: "sms-1", title: "맞춤 복지 소식 알림", due: "이번 주 발송 예정", action: "알림 관리" },
];

export default function Home() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const { user } = useAuth();
  const navigate = useNavigate();

  const [healthStatus, setHealthStatus] = useState("확인 중...");
  const [recommendations, setRecommendations] = useState(FALLBACK_RECOMMENDATIONS);
  const [loadingBenefit, setLoadingBenefit] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadStatus() {
      try {
        const res = await fetch(`${BASE_URL}/api/health`);
        const data = await res.json();
        if (!cancelled) setHealthStatus(data.status || "ok");
      } catch {
        if (!cancelled) setHealthStatus("서버 연결 실패");
      }
    }

    async function loadBenefits() {
      try {
        const res = await fetch(`${BASE_URL}/api/welfare/list`);
        if (!res.ok) throw new Error("failed to load benefits");
        const data = await res.json();
        if (!cancelled && Array.isArray(data?.welfare)) {
          const normalized = data.welfare.slice(0, 3).map((item) => ({
            id: item.id,
            title: item.title,
            desc: item.desc,
            region: item.region,
            category: "복지",
          }));
          setRecommendations(normalized);
        }
      } catch {
        // fallback already set
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
    if (hour < 12) return "좋은 아침이에요";
    if (hour < 18) return "반가워요";
    return "편안한 저녁 되세요";
  }, []);

  const actionButtons = [
    { id: "map", label: "복지 지도 보기", icon: <MapPin className="h-5 w-5" />, path: "/map" },
    { id: "chat", label: "챗봇에게 질문", icon: <MessageCircle className="h-5 w-5" />, path: "/chat" },
    {
      id: "calendar",
      label: "일정 · 알림 관리",
      icon: <CalendarDays className="h-5 w-5" />,
      path: "/search",
    },
  ];

  return (
    <section className="flex flex-col gap-8">
      <div className="rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 p-6 text-white shadow-lg">
        <p className="text-xs uppercase tracking-wide opacity-80">오늘의 복지 큐레이션</p>
        <h1 className="mt-2 text-2xl font-semibold">
          {greeting}, {user?.name || "경기도민"}님!
        </h1>
        <p className="mt-1 text-white/90">
          맞춤 혜택, 진행 중인 일정, 챗봇 상담까지 이곳에서 한 번에 확인하세요.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-white/90">
          <span className="rounded-full bg-white/20 px-4 py-1">백엔드 상태: {healthStatus}</span>
          <span className="rounded-full bg-white/20 px-4 py-1">Google 로그인 연결됨</span>
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
          <header className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">맞춤 추천 복지</h2>
            <button className="text-sm text-blue-600 hover:text-blue-500" onClick={() => navigate("/search")}>
              더 보기
            </button>
          </header>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {recommendations.map((benefit) => (
              <article
                key={benefit.id}
                className="rounded-xl border border-slate-100 p-4 shadow transition hover:shadow-md"
              >
                <div className="flex items-center gap-2 text-xs font-medium text-sky-600">
                  <span>{benefit.category}</span>
                  <span className="text-slate-400">•</span>
                  <span>{benefit.region}</span>
                </div>
                <h3 className="mt-2 text-lg font-semibold text-slate-900">{benefit.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{benefit.desc}</p>
                <button
                  className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-500"
                  onClick={() => navigate("/search")}
                >
                  자세히 보기 →
                </button>
              </article>
            ))}
            {!recommendations.length && !loadingBenefit && (
              <p className="text-sm text-slate-500">추천 데이터를 불러오지 못했습니다.</p>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <header className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">빠른 실행</h2>
          </header>
          <div className="mt-4 flex flex-col gap-3">
            {actionButtons.map((action) => (
              <button
                key={action.id}
                onClick={() => navigate(action.path)}
                className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-semibold text-slate-800 transition hover:border-blue-500 hover:bg-blue-50"
              >
                <div className="flex items-center gap-3">
                  <span className="rounded-full bg-blue-100 p-2 text-blue-600">{action.icon}</span>
                  {action.label}
                </div>
                <span className="text-blue-500">→</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">다가오는 일정 & 알림</h2>
            <button onClick={() => navigate("/chat")} className="text-sm text-blue-600 hover:text-blue-500">
              챗봇에게 일정 물어보기
            </button>
          </div>
          <ul className="mt-4 space-y-4">
            {UPCOMING_ALERTS.map((alert) => (
              <li
                key={alert.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm shadow-sm"
              >
                <div>
                  <p className="font-semibold text-slate-900">{alert.title}</p>
                  <p className="text-xs text-slate-500">{alert.due}</p>
                </div>
                <button className="text-sm font-medium text-blue-600 hover:text-blue-500">
                  {alert.action}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-2 text-slate-900">
            <Bell className="h-5 w-5 text-blue-500" />
            <h2 className="text-lg font-semibold">알림 설정</h2>
          </div>
          <p className="mt-2 text-sm text-slate-600">
            맞춤 혜택, 접수 마감, 상담 일정을 SMS와 캘린더로 자동 받아보세요.
          </p>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <label className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
              <span>SMS 알림 받기</span>
              <input type="checkbox" className="h-5 w-5 accent-blue-600" defaultChecked />
            </label>
            <label className="flex items-center justify-between rounded-xl border border-slate-200 px-4 py-3">
              <span>Google Calendar 연동</span>
              <input type="checkbox" className="h-5 w-5 accent-blue-600" defaultChecked />
            </label>
          </div>
          <p className="mt-3 text-xs text-slate-400">
            ※ 현재는 데모 UI입니다. Calendar/SMS API 연결 후 자동화할 예정이에요.
          </p>
        </div>
      </section>
    </section>
  );
}
