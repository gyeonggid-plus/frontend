import { useState, useEffect } from "react"; // useEffect 추가 (선택적)
import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import { Menu, X } from "lucide-react"; 
import Home from "./pages/Home";
import BenefitSearch from "./pages/BenefitSearch";
import MapView from "./pages/MapView";
import Chatbot from "./pages/Chatbot";
// 1. LoginPage 컴포넌트를 임포트합니다.
import LoginPage from "./pages/LoginPage"; 

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 로컬 스토리지 상태를 확인합니다.
  useEffect(() => {
    // 2. 앱이 켜질 때 토큰이 있는지 확인합니다.
    const token = localStorage.getItem('myAppToken');
    setIsLoggedIn(!!token);
  }, []);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  // 3. 로그아웃 처리 함수
  const handleLogout = () => {
      localStorage.removeItem('myAppToken');
      setIsLoggedIn(false);
      // 로그아웃 후 홈으로 이동 (또는 새로고침)
      window.location.href = "/";
  };

  // 4. 네비게이션 링크에 로그인/로그아웃 링크를 동적으로 추가합니다.
  const navLinks = [
    { path: "/", label: "홈" },
    { path: "/search", label: "복지 검색" },
    { path: "/map", label: "지도 보기" },
    { path: "/chat", label: "챗봇" },
    // 로그인 상태에 따라 링크를 다르게 보여줍니다.
    isLoggedIn 
        ? { path: "#", label: "로그아웃", onClick: handleLogout }
        : { path: "/login", label: "로그인" } 
  ].filter(Boolean); // 배열 필터링 (불필요한 요소 제거)

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
            {navLinks.map(({ path, label, onClick }) => (
              <NavLink
                key={path}
                to={path}
                onClick={onClick} // 로그아웃 링크 클릭 시 handleLogout 실행
                className={({ isActive }) =>
                  isActive
                    ? "border-b-2 border-white pb-1 font-semibold"
                    : "hover:text-gray-200 transition"
                }
              >
                {label}
              </NavLink>
            ))}
            {/* 추가적인 로그인/로그아웃 상태 표시를 여기에 넣을 수도 있습니다. */}
          </div>

          {/* 모바일 메뉴 버튼 (생략) */}
          <button
            className="md:hidden p-2 rounded hover:bg-blue-500 transition"
            onClick={toggleMenu}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {/* 모바일 드롭다운 메뉴 (생략) */}
        {menuOpen && (
          <div className="md:hidden flex flex-col bg-blue-700 text-white px-6 py-3 space-y-3 animate-slide-down">
            {navLinks.map(({ path, label, onClick }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => { setMenuOpen(false); if (onClick) onClick(); }} // 메뉴 닫기 및 로그아웃 처리
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

          {/* 5. LoginPage 라우트(경로) 추가 */}
          <Route path="/login" 
          element={<LoginPage onLoginSuccess={()=>setIsLoggedIn(true)}/>} />

        </Routes>
      </main>
    </Router>
  );
}