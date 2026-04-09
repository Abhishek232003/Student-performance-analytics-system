import { useState, useEffect } from "react";
import { sendMessageToLLM } from "../services/api";

export default function Chatbot({ isPopup = false }) {

  const [currentUser, setCurrentUser] = useState(null);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);
  }, []);

  // ✅ FORMAT LINKS
  const formatMessage = (text) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;

    return text.split(urlRegex).map((part, index) => {
      if (part.match(urlRegex)) {
        return (
          <a
            key={index}
            href={part}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-700 underline break-all"
          >
            {part}
          </a>
        );
      }
      return part;
    });
  };

  const handleSend = async () => {
    if (!input || !currentUser?.id) return;

    const userMsg = { type: "user", text: input };

    setMessages((prev) => [...prev, userMsg]);

    setInput(""); // clear input
    setIsTyping(true);
    setIsSending(true);

    try {
      const res = await sendMessageToLLM(input, currentUser.id);

      const text =
        typeof res === "string"
          ? res
          : res?.response || "Something went wrong";

      const botMsg = { type: "bot", text };

      setMessages((prev) => [...prev, botMsg]);

    } catch (error) {
      const botMsg = { type: "bot", text: "Something went wrong" };
      setMessages((prev) => [...prev, botMsg]);
    }

    setIsTyping(false);
    setIsSending(false);
  };

  return (
    <div className={`${isPopup ? "p-3 h-full flex flex-col" : "p-6 min-h-screen bg-gray-100 flex flex-col items-center"}`}>

      <h2 className="text-2xl font-bold mb-4">🤖 AI Assistant</h2>

      <div className={`${isPopup ? "flex-1 bg-white p-3 rounded-xl shadow overflow-y-auto" : "w-full max-w-xl bg-white p-4 rounded-xl shadow h-96 overflow-y-auto"}`}>

        {messages.map((msg, i) => (
          <div
            key={i}
            className={`mb-3 flex ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 max-w-[75%] break-words whitespace-pre-wrap ${
                msg.type === "user"
                  ? "bg-indigo-500 text-white rounded-2xl rounded-tr-sm"
                  : "bg-gray-400 text-black rounded-2xl rounded-tl-sm"
              }`}
            >
              {formatMessage(msg.text)}
            </div>
          </div>
        ))}

        {/* ✅ Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start mt-2">
            <span className="bg-gray-300 text-black px-3 py-2 rounded-lg animate-pulse">
              🤖 AI is typing...
            </span>
          </div>
        )}

      </div>

      <div className={`${isPopup ? "flex mt-2 gap-2" : "flex mt-4 gap-2 w-full max-w-xl"}`}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSend();
          }}
          className="flex-1 p-2 border rounded-lg"
          placeholder="Ask something..."
        />
        <button
          onClick={handleSend}
          className={`px-4 rounded-lg text-white transition-all duration-300 ${
            isSending
              ? "bg-indigo-400 scale-110 shadow-lg shadow-indigo-300 animate-pulse"
              : "bg-indigo-600"
          }`}
        >
          Send
        </button>
      </div>

    </div>
  );
}