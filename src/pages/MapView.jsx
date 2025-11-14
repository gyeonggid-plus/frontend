import { useMemo, useState } from "react";
import { MapPin, Navigation, PhoneCall } from "lucide-react";

const WELFARE_SPOTS = [
  {
    id: 1,
    name: "경기 복지센터",
    address: "수원시 팔달구 효원로 123",
    phone: "031-000-0000",
    coords: { x: 62, y: 40 },
  },
  {
    id: 2,
    name: "청년 지원센터",
    address: "용인시 기흥구 흥덕1로 22",
    phone: "031-111-0000",
    coords: { x: 38, y: 58 },
  },
  {
    id: 3,
    name: "가족 돌봄 거점",
    address: "고양시 일산동구 중앙로 110",
    phone: "031-222-0000",
    coords: { x: 28, y: 34 },
  },
];

export default function MapView() {
  const filters = ["전체", "도내", "근처"];
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [selected, setSelected] = useState(WELFARE_SPOTS[0]);

  const filteredSpots = useMemo(() => {
    if (activeFilter === "전체") return WELFARE_SPOTS;
    if (activeFilter === "근처") return WELFARE_SPOTS.slice(0, 2);
    return WELFARE_SPOTS;
  }, [activeFilter]);

  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#00a69c]">복지 지도</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">가까운 복지 센터 찾기</h1>
          <p className="text-sm text-slate-500">필터를 선택하고 지도에서 원하는 센터를 확인하세요.</p>
        </div>
        <div className="flex gap-2">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`rounded-full px-5 py-2 text-sm font-semibold ${
                activeFilter === filter
                  ? "bg-[#00a69c] text-white"
                  : "border border-slate-200 text-slate-500 hover:border-[#00a69c]/50 hover:text-[#00a69c]"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="relative h-[420px] rounded-3xl border border-slate-100 bg-gradient-to-br from-slate-100 via-white to-slate-200">
          {filteredSpots.map((spot) => (
            <button
              key={spot.id}
              style={{ left: `${spot.coords.x}%`, top: `${spot.coords.y}%` }}
              onClick={() => setSelected(spot)}
              className={`group absolute -translate-x-1/2 -translate-y-1/2 rounded-full border-2 bg-white p-2 shadow transition hover:scale-110 ${
                selected?.id === spot.id ? "border-[#00a69c]" : "border-white"
              }`}
            >
              <MapPin className="h-5 w-5 text-[#00a69c]" />
              <span className="pointer-events-none absolute left-1/2 top-full mt-1 hidden -translate-x-1/2 rounded-2xl bg-white px-3 py-1 text-xs text-slate-700 shadow group-hover:block">
                {spot.name}
              </span>
            </button>
          ))}
          <div className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow">
            내 위치 기준
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100 p-6">
          {selected ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#00a69c]">선택한 센터</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">{selected.name}</h2>
              <p className="mt-1 text-sm text-slate-500">{selected.address}</p>
              <div className="mt-4 flex flex-col gap-2 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <PhoneCall className="h-4 w-4 text-[#00a69c]" />
                  {selected.phone}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Navigation className="h-4 w-4 text-[#00a69c]" />
                  지도에서 길찾기를 확인하세요.
                </span>
              </div>
              <div className="mt-6 flex gap-3 text-sm font-semibold">
                <button className="flex-1 rounded-2xl border border-slate-200 py-3 text-slate-700 hover:border-[#00a69c]/40 hover:text-[#00a69c]">
                  방문 예약
                </button>
                <button className="flex-1 rounded-2xl bg-[#00a69c] py-3 text-white hover:bg-[#009085]">
                  바로 신청
                </button>
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-500">지도를 클릭해 센터를 선택하세요.</p>
          )}

          <div className="mt-8 space-y-3">
            {filteredSpots.map((spot) => (
              <button
                key={spot.id}
                onClick={() => setSelected(spot)}
                className={`w-full rounded-2xl border px-4 py-3 text-left text-sm transition ${
                  selected?.id === spot.id
                    ? "border-[#00a69c] bg-[#00a69c]/5 text-[#00a69c]"
                    : "border-slate-100 text-slate-700 hover:border-[#00a69c]/40"
                }`}
              >
                {spot.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
