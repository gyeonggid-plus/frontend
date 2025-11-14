import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
  Navigate,
  useLocation,
} from "react-router-dom";
import { Home as HomeIcon, LogOut, Map, MessageCircle, Search } from "lucide-react";
import Home from "./pages/Home";
import BenefitSearch from "./pages/BenefitSearch";
import MapView from "./pages/MapView";
import Chatbot from "./pages/Chatbot";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

function AppLayout() {
  const location = useLocation();
  const { isAuthenticated, logout, user } = useAuth();
  const isLoginPage = location.pathname === "/login";
  const isChatPage = location.pathname === "/chat";

  const navLinks = [
    { path: "/", label: "홈", protected: true },
    { path: "/search", label: "복지 찾기", protected: true },
    { path: "/map", label: "복지 지도", protected: true },
    { path: "/chat", label: "챗봇", protected: true },
  ];

  const filteredNav = navLinks.filter((link) => {
    if (link.protected && !isAuthenticated) return false;
    return true;
  });

  return (
    <div className={isLoginPage ? "min-h-screen" : "min-h-screen bg-slate-50 text-slate-900"}>
      {!isLoginPage && (
        <header className="border-b border-slate-200 bg-white">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3 text-center sm:text-left">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#00a69c]/10 text-[#00a69c]">
                <span className="text-xl font-bold">D+</span>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-slate-400 sm:text-xs">경기 복지 비서</p>
                <p className="text-base font-semibold text-slate-900 sm:text-lg">경기D+</p>
              </div>
            </div>

            <nav className="hidden flex-wrap items-center justify-center gap-2 text-xs font-semibold sm:flex sm:justify-start sm:text-sm">
              {filteredNav.map(({ path, label }) => (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `rounded-full px-3 py-2 transition ${
                      isActive ? "bg-[#00a69c]/10 text-[#00a69c]" : "text-slate-500 hover:text-[#00a69c]"
                    }`
                  }
                >
                  {label}
                </NavLink>
              ))}
            </nav>

            <div className="flex flex-wrap items-center justify-end gap-2 text-xs text-slate-500 sm:gap-4 sm:text-sm">
              <span className="font-medium text-slate-600">
                {isAuthenticated ? `안녕하세요, ${user?.name || "경기도민"}님` : ""}
              </span>
              {isAuthenticated ? (
                <button
                  onClick={logout}
                  className="rounded-full border border-slate-200 px-4 py-2 text-slate-600 transition hover:border-slate-300 hover:text-[#00a69c]"
                >
                  로그아웃
                </button>
              ) : (
                <NavLink
                  to="/login"
                  className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:border-slate-300 hover:text-[#00a69c]"
                >
                  로그인
                </NavLink>
              )}
            </div>
          </div>
        </header>
      )}

      <main
        className={
          isLoginPage
            ? "min-h-screen"
            : `mx-auto w-full max-w-6xl px-4 ${isChatPage ? "pb-32" : "pb-24"} pt-8 sm:min-h-[calc(100vh-80px)] sm:px-6 sm:py-10`
        }
      >
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
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
          <Route
            path="*"
            element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />}
          />
        </Routes>
      </main>

      {isAuthenticated && !isLoginPage && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-slate-200 bg-white/95 py-3 sm:hidden">
          <div className="mx-auto flex max-w-md items-center text-xs font-semibold">
            {filteredNav.map(({ path, label }) => {
              const Icon =
                path === "/"
                  ? HomeIcon
                  : path === "/search"
                  ? Search
                  : path === "/map"
                  ? Map
                  : MessageCircle;
              return (
                <NavLink
                  key={path}
                  to={path}
                  className={({ isActive }) =>
                    `flex flex-1 flex-col items-center gap-1 rounded-full px-3 py-1 text-center ${
                      isActive ? "text-[#00a69c]" : "text-slate-500"
                    }`
                  }
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </NavLink>
              );
            })}
            <button
              onClick={logout}
              className="flex flex-1 flex-col items-center gap-1 rounded-full px-3 py-1 text-slate-500"
              >
              <LogOut className="h-5 w-5" />
              로그아웃
            </button>
          </div>
        </nav>
      )}
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
