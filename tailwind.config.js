export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      keyframes: {
        "slide-down": {
          "0%": { transform: "translateY(-10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        "slide-down": "slide-down 0.2s ease-out",
      },
      colors: {
        primary: "#2563eb", // 파란색
        background: "#f9fafb", // 밝은 회색
        text: "#111827",
      },
      fontFamily: {
        sans: ["Pretendard", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
