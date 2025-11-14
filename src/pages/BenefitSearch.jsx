import { useMemo, useState } from "react";
import { Filter, Search } from "lucide-react";

const DUMMY_BENEFITS = [
  {
    id: 1,
    title: "청년 주거비 지원",
    category: "주거",
    desc: "청년층의 주거 안정을 위해 보증금/월세를 지원합니다.",
    agency: "경기도청",
  },
  {
    id: 2,
    title: "경기 긴급복지",
    category: "긴급",
    desc: "갑작스러운 위기 상황을 맞은 가구에 생계/의료비를 지원합니다.",
    agency: "경기도 복지국",
  },
  {
    id: 3,
    title: "문화누리 카드",
    category: "문화",
    desc: "저소득층의 문화생활을 위해 연간 바우처를 제공합니다.",
    agency: "문화체육관광부",
  },
];

export default function BenefitSearch() {
  const [keyword, setKeyword] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const categories = ["전체", "주거", "긴급", "문화"];

  const filtered = useMemo(() => {
    return DUMMY_BENEFITS.filter((item) => {
      const matchCategory = selectedCategory === "전체" || item.category === selectedCategory;
      const matchKeyword =
        !keyword || item.title.includes(keyword) || item.desc.includes(keyword);
      return matchCategory && matchKeyword;
    });
  }, [keyword, selectedCategory]);

  return (
    <section className="rounded-3xl bg-white p-8 shadow-sm">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-6">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#00a69c]">맞춤 찾기</p>
          <h1 className="mt-1 text-2xl font-semibold text-slate-900">복지 혜택 검색</h1>
          <p className="text-sm text-slate-500">원하는 키워드와 조건으로 복지 제도를 찾아보세요.</p>
        </div>
        <div className="flex items-center gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                selectedCategory === category
                  ? "bg-[#00a69c] text-white"
                  : "border border-slate-200 text-slate-500 hover:border-[#00a69c]/50 hover:text-[#00a69c]"
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </header>

      <div className="mt-6 flex items-center gap-3 rounded-2xl border border-slate-200 px-4 py-3">
        <Search className="h-5 w-5 text-slate-400" />
        <input
          className="flex-1 border-none text-sm outline-none placeholder:text-slate-400"
          placeholder="예: 청년, 주거, 긴급, 문화 등"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button className="flex items-center gap-2 rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-500">
          <Filter className="h-4 w-4" />
          고급 필터
        </button>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {filtered.map((benefit) => (
          <article key={benefit.id} className="rounded-2xl border border-slate-100 p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>{benefit.category}</span>
              <span>{benefit.agency}</span>
            </div>
            <h2 className="mt-2 text-lg font-semibold text-slate-900">{benefit.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{benefit.desc}</p>
            <div className="mt-4 flex gap-3 text-sm font-semibold">
              <button className="flex-1 rounded-2xl border border-slate-200 py-2 text-slate-600 hover:border-[#00a69c]/50 hover:text-[#00a69c]">
                자세히 보기
              </button>
              <button className="flex-1 rounded-2xl bg-[#00a69c] py-2 text-white hover:bg-[#009085]">
                신청하기
              </button>
            </div>
          </article>
        ))}
        {!filtered.length && (
          <div className="col-span-full rounded-2xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
            검색 조건에 맞는 복지 혜택이 없습니다.
          </div>
        )}
      </div>
    </section>
  );
}
