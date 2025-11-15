import { useEffect, useMemo, useRef, useState } from "react";
import { MapPin, Navigation, PhoneCall } from "lucide-react";

const FALLBACK_SPOTS = [
  {
    id: 1,
    name: "경기 복지센터",
    address: "수원시 팔달구 효원로 123",
    phone: "031-000-0000",
    lat: 37.263537,
    lng: 127.028091,
  },
  {
    id: 2,
    name: "청년 지원센터",
    address: "용인시 기흥구 흥덕1로 22",
    phone: "031-111-0000",
    lat: 37.271662,
    lng: 127.124601,
  },
  {
    id: 3,
    name: "가족 돌봄 거점",
    address: "고양시 일산동구 중앙로 110",
    phone: "031-222-0000",
    lat: 37.65836,
    lng: 126.83202,
  },
];

const filters = ["전체", "도내", "근처"];
const DEFAULT_CENTER = { lat: 37.3854, lng: 127.1155 };
const KAKAO_SCRIPT_ID = "kakao-map-sdk";
const normalizeUrl = (url = "") => {
  if (!url) return "";
  return url.startsWith("http://") || url.startsWith("https://")
    ? url
    : `https://${url}`;
};

export default function MapView() {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [spots, setSpots] = useState(FALLBACK_SPOTS);
  const [selected, setSelected] = useState(FALLBACK_SPOTS[0]);
  const [activeFilter, setActiveFilter] = useState(filters[0]);
  const [userRegion, setUserRegion] = useState("");
  const [error, setError] = useState("");
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const [mapReady, setMapReady] = useState(false);

  const filteredSpots = useMemo(() => {
    const dataset = spots.slice();
    if (activeFilter === "근처") return dataset.slice(0, 5);
    if (activeFilter === "도내") return dataset.slice(0, 10);
    return dataset.slice(0, 20);
  }, [activeFilter, spots]);

  useEffect(() => {
    async function loadSpots() {
      try {
        const res = await fetch(`${BASE_URL}/api/facilities`);
        if (!res.ok) throw new Error("failed");
        const payload = await res.json();
        const remoteData = Array.isArray(payload?.data)
          ? payload.data
          : payload;
        if (Array.isArray(remoteData) && remoteData.length) {
          const normalized = remoteData.map((item, index) => ({
            id: item.id ?? index,
            name: item.name ?? item.title ?? item.service_name ?? "복지 센터",
            address:
              item.address ??
              item.location ??
              [item.sigun_name, item.address_detail]
                .filter(Boolean)
                .join(" ") ??
              "",
            phone: item.phone ?? item.contact ?? "",
            lat: Number(
              item.lat ?? item.latitude ?? item.y ?? DEFAULT_CENTER.lat
            ),
            lng: Number(
              item.lng ?? item.longitude ?? item.x ?? DEFAULT_CENTER.lng
            ),
            url:
              item.url ??
              item.service_url ??
              item.apply_method ??
              item.link ??
              "",
          }));
          setSpots(
            normalized.sort((a, b) => a.name.localeCompare(b.name, "ko"))
          );
          setSelected(normalized[0]);
          if (payload?.user_location) setUserRegion(payload.user_location);
        } else {
          setSpots(FALLBACK_SPOTS);
          setSelected(FALLBACK_SPOTS[0]);
          setUserRegion("");
        }
      } catch (err) {
        console.warn("Failed to load centers", err);
        setError(
          "실시간 센터 정보를 불러오지 못했습니다. 기본 데이터를 보여드릴게요."
        );
        setSpots(FALLBACK_SPOTS);
        setSelected(FALLBACK_SPOTS[0]);
        setUserRegion("");
      }
    }
    loadSpots();
  }, [BASE_URL]);

  useEffect(() => {
    const loadMap = () => {
      if (!window.kakao?.maps || !mapContainerRef.current) return;
      window.kakao.maps.load(() => {
        mapRef.current = new window.kakao.maps.Map(mapContainerRef.current, {
          center: new window.kakao.maps.LatLng(
            DEFAULT_CENTER.lat,
            DEFAULT_CENTER.lng
          ),
          level: 7,
        });
        setMapReady(true);
      });
    };

    if (window.kakao && window.kakao.maps) {
      loadMap();
      return;
    }

    const existingScript = document.getElementById(KAKAO_SCRIPT_ID);
    if (existingScript) {
      existingScript.addEventListener("load", loadMap);
      return () => existingScript.removeEventListener("load", loadMap);
    }

    const script = document.createElement("script");
    script.id = KAKAO_SCRIPT_ID;
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${
      import.meta.env.VITE_KAKAO_MAP_KEY
    }&autoload=false`;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", loadMap);
    document.head.appendChild(script);

    return () => {
      script.removeEventListener("load", loadMap);
    };
  }, []);

  useEffect(() => {
    if (!mapReady || !mapRef.current || !window.kakao) return;
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];
    filteredSpots.forEach((spot) => {
      const marker = new window.kakao.maps.Marker({
        map: mapRef.current,
        position: new window.kakao.maps.LatLng(spot.lat, spot.lng),
      });
      window.kakao.maps.event.addListener(marker, "click", () => {
        setSelected(spot);
        mapRef.current.panTo(new window.kakao.maps.LatLng(spot.lat, spot.lng));
      });
      markersRef.current.push(marker);
    });
  }, [filteredSpots, mapReady]);

  useEffect(() => {
    if (!selected || !mapReady || !mapRef.current || !window.kakao) return;
    mapRef.current.panTo(
      new window.kakao.maps.LatLng(selected.lat, selected.lng)
    );
  }, [selected, mapReady]);

  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#00a69c]">
            복지 지도
          </p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">
            가까운 복지 센터 찾기
          </h1>
          <p className="text-sm text-slate-500">
            {userRegion
              ? `${userRegion} 기준 추천 센터입니다.`
              : "필터를 선택하고 지도에서 원하는 센터를 확인하세요."}
          </p>
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
        <div className="relative h-[420px] overflow-hidden rounded-3xl border border-slate-100 bg-gradient-to-br from-slate-100 via-white to-slate-200 sm:h-[480px] lg:h-[520px]">
          <div ref={mapContainerRef} className="absolute inset-0" />
          <div className="absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-600 shadow">
            내 위치 기준
          </div>
        </div>

        <div className="rounded-3xl border border-slate-100 p-6">
          {error && (
            <p className="mb-4 rounded-2xl bg-red-50 px-4 py-2 text-xs text-red-500 text-center">
              {error}
            </p>
          )}
          {selected ? (
            <>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#00a69c]">
                선택한 센터
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-900">
                {selected.name}
              </h2>
              <p className="mt-1 text-sm text-slate-500">{selected.address}</p>
              <div className="mt-4 flex flex-col gap-2 text-sm text-slate-600">
                {selected.phone && (
                  <span className="inline-flex items-center gap-2">
                    <PhoneCall className="h-4 w-4 text-[#00a69c]" />
                    {selected.phone}
                  </span>
                )}
                <button
                  type="button"
                  className="inline-flex items-center gap-2 text-left text-sm font-semibold text-[#00a69c]"
                  onClick={() =>
                    window.open(
                      `https://map.kakao.com/link/to/${encodeURIComponent(
                        selected.name
                      )},${selected.lat},${selected.lng}`,
                      "_blank"
                    )
                  }
                >
                  <Navigation className="h-4 w-4" />
                  길찾기 열기
                </button>
                {selected.url ? (
                  <a
                    href={normalizeUrl(selected.url)}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-semibold text-[#00a69c] underline underline-offset-4"
                  >
                    기관 사이트 바로가기
                  </a>
                ) : (
                  <p className="text-xs text-slate-400">
                    기관 사이트 정보가 없습니다.
                  </p>
                )}
              </div>
            </>
          ) : (
            <p className="text-sm text-slate-500">
              지도에서 센터를 선택해 주세요.
            </p>
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
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full p-1.5 ${
                      selected?.id === spot.id
                        ? "bg-[#00a69c]/80 text-white"
                        : "bg-slate-100 text-[#00a69c]"
                    }`}
                  >
                    <MapPin className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="font-semibold">{spot.name}</p>
                    <p className="text-xs text-slate-500">{spot.address}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
