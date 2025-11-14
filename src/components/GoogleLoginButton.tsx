import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

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
          try {
            const r = await fetch(`${BASE_URL}/api/auth/google/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id_token: res.credential }),
            });
            const data = await r.json();
            if (!r.ok) throw new Error(data?.detail || "로그인에 실패했습니다");

            const userPayload = data.user;
            const isNewUser =
              userPayload === "new_user" ||
              userPayload?.status === "new" ||
              userPayload?.is_new ||
              userPayload?.type === "new_user";
            const normalizedUser =
              typeof userPayload === "object" && userPayload !== null
                ? userPayload
                : null;

            login(data.access_token, normalizedUser, isNewUser);
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
