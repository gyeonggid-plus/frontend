import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import { Menu, X } from "lucide-react"; // 햄버거/닫기 아이콘
import Home from "./pages/Home";
import BenefitSearch from "./pages/BenefitSearch";
import MapView from "./pages/MapView";
import Chatbot from "./pages/Chatbot";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const navLinks = [
    { path: "/", label: "홈" },
    { path: "/search", label: "복지 검색" },
    { path: "/map", label: "지도 보기" },
    { path: "/chat", label: "챗봇" },
  ];

  return (
    <Router>
      {/* 헤더 */}
      <header className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
        <nav className="flex justify-between items-center px-6 py-3">
          {/* 로고 */}
          <h1 className="text-lg sm:text-xl font-bold tracking-wide">
            경기 복지 도우미+
          </h1>

          {/* 데스크톱 메뉴 */}
          <div className="hidden md:flex gap-6 text-lg">
            {navLinks.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  isActive
                    ? "border-b-2 border-white pb-1 font-semibold"
                    : "hover:text-gray-200 transition"
                }
              >
                {label}
              </NavLink>
            ))}
          </div>

          {/* 모바일 메뉴 버튼 */}
          <button
            className="md:hidden p-2 rounded hover:bg-blue-500 transition"
            onClick={toggleMenu}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* 모바일 드롭다운 메뉴 */}
        {menuOpen && (
          <div className="md:hidden flex flex-col bg-blue-700 text-white px-6 py-3 space-y-3 animate-slide-down">
            {navLinks.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)} // 메뉴 닫기
                className={({ isActive }) =>
                  isActive
                    ? "font-semibold border-l-4 border-white pl-2"
                    : "pl-2 hover:text-gray-200 transition"
                }
              >
                {label}
              </NavLink>
            ))}
          </div>
        )}
      </header>

      {/* 본문 */}
      <main className="p-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<BenefitSearch />} />
          <Route path="/map" element={<MapView />} />
          <Route path="/chat" element={<Chatbot />} />
        </Routes>
      </main>
    </Router>
  );
}
