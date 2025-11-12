import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import Home from "./pages/Home";
import BenefitSearch from "./pages/BenefitSearch";
import MapView from "./pages/MapView";
import Chatbot from "./pages/Chatbot";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();

  const navLinks = [
    { path: "/", label: "홈" },
    { path: "/search", label: "복지 검색", protected: true },
    { path: "/map", label: "복지 지도", protected: true },
    { path: "/chat", label: "챗봇", protected: true },
    { path: "/login", label: "로그인" },
  ];

  const filteredNav = navLinks.filter((link) => {
    if (link.protected && !isAuthenticated) return false;
    if (link.path === "/login" && isAuthenticated) return false;
    return true;
  });

  const renderNavLink = ({ path, label }) => (
    <NavLink
      key={path}
      to={path}
      onClick={() => setMenuOpen(false)}
      className={({ isActive }) =>
        isActive
          ? "border-b-2 border-white pb-1 font-semibold"
          : "hover:text-gray-200 transition"
      }
    >
      {label}
    </NavLink>
  );

  return (
    <Router>
      <header className="bg-blue-600 text-white shadow-md sticky top-0 z-50">
        <nav className="flex justify-between items-center px-6 py-3">
          <h1 className="text-lg sm:text-xl font-bold tracking-wide">경기 복지 도우미</h1>

          <div className="hidden md:flex items-center gap-4 text-lg">
            {filteredNav.map(renderNavLink)}
            {isAuthenticated && (
              <button
                onClick={() => logout()}
                className="border border-white/60 rounded-full px-3 py-1 text-sm hover:bg-white hover:text-blue-600 transition"
              >
                로그아웃
              </button>
            )}
          </div>

          <button
            className="md:hidden p-2 rounded hover:bg-blue-500 transition"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label="모바일 메뉴 토글"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

        {menuOpen && (
          <div className="md:hidden flex flex-col bg-blue-700 text-white px-6 py-3 space-y-3 animate-slide-down">
            {filteredNav.map(({ path, label }) => (
              <NavLink
                key={path}
                to={path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "font-semibold border-l-4 border-white pl-2"
                    : "pl-2 hover:text-gray-200 transition"
                }
              >
                {label}
              </NavLink>
            ))}
            {isAuthenticated && (
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="border border-white rounded-full px-3 py-1 text-sm"
              >
                로그아웃
              </button>
            )}
          </div>
        )}
      </header>

      <main className="p-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/search"
            element={
              <ProtectedRoute>
                <BenefitSearch />
              </ProtectedRoute>
            }
          />
          <Route
            path="/map"
            element={
              <ProtectedRoute>
                <MapView />
              </ProtectedRoute>
            }
          />
          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <Chatbot />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>
    </Router>
  );
}
