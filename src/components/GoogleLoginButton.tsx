import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function hasNewUserMarker(value) {
  if (value == null) return false;
  if (typeof value === "string") {
    const normalized = value.toLowerCase().replace(/\s+/g, " ");
    return normalized === "new user" || normalized === "new_user";
  }
  if (typeof value === "object") {
    return Object.values(value).some((entry) => hasNewUserMarker(entry));
  }
  return false;
}

export default function GoogleLoginButton() {
  const divRef = useRef<HTMLDivElement | null>(null);
  const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
  const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string;
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const scriptId = "google-identity";

    const init = () => {
      if (!window.google || !divRef.current || !CLIENT_ID) return;
      window.google.accounts.id.initialize({
        client_id: CLIENT_ID,
        callback: async (res: any) => {
          const verifyToken = async () => {
            const response = await fetch(`${BASE_URL}/api/auth/google/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id_token: res.credential }),
            });
            const result = await response.json();
            if (!response.ok)
              throw new Error(result?.detail || "로그인에 실패했습니다");
            return result;
          };

          try {
            const firstData = await verifyToken();

            const isNewUser =
              firstData.status === "created" ||
              firstData.new_user === true ||
              firstData.is_new === true ||
              firstData.created === true ||
              hasNewUserMarker(firstData.user);

            let token = firstData.access_token;
            let normalizedUser =
              typeof firstData.user === "object" && firstData.user !== null
                ? (firstData.user as Record<string, unknown>)
                : firstData.profile ??
                  (firstData.email ? { email: firstData.email } : null);

            if (isNewUser && !token) {
              const secondData = await verifyToken();
              token = secondData.access_token;
              normalizedUser =
                (typeof secondData.user === "object" && secondData.user !== null
                  ? (secondData.user as Record<string, unknown>)
                  : null) ||
                normalizedUser ||
                (secondData.email ? { email: secondData.email } : null);
            }

            if (!token) {
              throw new Error("유효한 토큰을 받지 못했습니다");
            }

            login(token, normalizedUser, isNewUser);
            navigate(isNewUser ? "/survey" : "/", { replace: true });
          } catch (e) {
            console.error(e);
            alert("로그인에 실패했습니다. 다시 시도해 주세요.");
          }
        },
      });
      const width = Math.min(320, divRef.current.offsetWidth || 320);
      window.google.accounts.id.renderButton(divRef.current, {
        theme: "outline",
        size: "large",
        width,
        text: "continue_with",
        shape: "pill",
      });
    };

    if (!document.getElementById(scriptId)) {
      const s = document.createElement("script");
      s.id = scriptId;
      s.src = "https://accounts.google.com/gsi/client";
      s.async = true;
      s.defer = true;
      s.onload = init;
      document.head.appendChild(s);
    } else {
      init();
    }
  }, [BASE_URL, CLIENT_ID, login, navigate]);

  return <div ref={divRef} />;
}
