import { useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text: input }]);

    const res = await fetch("http://localhost:8000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: input }),
    });
    const data = await res.json();

    setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
    setInput("");
  };

  return (
    <div className="p-10 text-center">
      <h2 className="text-3xl font-semibold mb-4">복지 챗봇</h2>
      <div className="border rounded-lg p-4 max-w-lg mx-auto mb-4 h-96 overflow-y-auto">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`mb-2 ${
              m.sender === "user" ? "text-right" : "text-left"
            }`}
          >
            <span
              className={`inline-block px-3 py-2 rounded-lg ${
                m.sender === "user" ? "bg-blue-200" : "bg-gray-200"
              }`}
            >
              {m.text}
            </span>
          </div>
        ))}
      </div>
      <div className="flex justify-center gap-2">
        <input
          className="border rounded-lg p-2 flex-1 max-w-md"
          placeholder="복지 관련 질문을 입력하세요..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          전송
        </button>
      </div>
    </div>
  );
}
