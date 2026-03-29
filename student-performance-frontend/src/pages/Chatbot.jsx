import { useState, useEffect } from "react";
import { sendMessageToLLM } from "../services/api";

export default function Chatbot() {

  // ✅ State definitions (IMPORTANT)
  const [currentUser, setCurrentUser] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);

  // ✅ Load user from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    console.log("Loaded User:", user);
    setCurrentUser(user);
  }, []);

  // ✅ Send message handler
  const handleSend = async () => {
    if (!input || !currentUser?.id) {
      console.log("User not loaded yet");
      return;
    }

    // Add user message
    const userMsg = { type: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await sendMessageToLLM(input, currentUser.id);

      console.log("FULL RESPONSE:", res);

      const text =
        typeof res === "string"
          ? res
          : res?.response || "Something went wrong";

      const botMsg = { type: "bot", text };
      setMessages((prev) => [...prev, botMsg]);

    } catch (error) {
      console.error("Chat error:", error);

      const botMsg = { type: "bot", text: "Something went wrong" };
      setMessages((prev) => [...prev, botMsg]);
    }

    setInput("");
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 flex flex-col items-center">

      <h2 className="text-2xl font-bold mb-4">🤖 AI Assistant</h2>

      <div className="w-full max-w-xl bg-white p-4 rounded-xl shadow h-96 overflow-y-auto">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-2 ${
              msg.type === "user" ? "text-right" : "text-left"
            }`}
          >
            <span className="inline-block bg-indigo-500 text-white px-3 py-2 rounded-lg">
              {msg.text}
            </span>
          </div>
        ))}
      </div>

      <div className="flex mt-4 gap-2 w-full max-w-xl">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded-lg"
          placeholder="Ask something..."
        />
        <button
          onClick={handleSend}
          className="bg-indigo-600 text-white px-4 rounded-lg"
        >
          Send
        </button>
      </div>

    </div>
  );
}