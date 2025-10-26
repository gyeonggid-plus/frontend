import React, { useState } from "react";
import axios from "axios";

export default function Chat() {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const sendMessage = async () => {
    const res = await axios.post("http://127.0.0.1:8000/chat", {
      query: input,
    });
    setResult(res.data.result);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow w-[400px]">
      <h1 className="text-xl font-bold mb-4 text-blue-600">경기똑D+ 챗봇</h1>
      <textarea
        className="border w-full p-2 rounded mb-2"
        rows="3"
        placeholder="소득 250만원인데 받을 수 있는 복지는?"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button
        onClick={sendMessage}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
      >
        전송
      </button>
      {result && (
        <div className="mt-4 border-t pt-4 text-gray-700 whitespace-pre-wrap">
          {result}
        </div>
      )}
    </div>
  );
}
