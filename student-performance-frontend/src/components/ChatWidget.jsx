import { useState } from "react";
import { MessageCircle, X } from "lucide-react";
import Chatbot from "../pages/Chatbot"; // ✅ IMPORTANT

export default function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Floating Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setOpen(!open)}
          className="bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-lg"
        >
          {open ? <X size={24} /> : <MessageCircle size={24} />}
        </button>
      </div>

      {/* Chat Popup */}
      {open && (
        <div className="fixed bottom-20 right-6 w-[360px] h-[520px] bg-white shadow-2xl rounded-xl z-50 flex flex-col">

          {/* Header */}
          <div className="bg-purple-600 text-white p-3 rounded-t-xl flex justify-between items-center">
            <h3 className="font-semibold">AI Assistant</h3>
            <button onClick={() => setOpen(false)}>
              <X size={18} />
            </button>
          </div>

          {/* Chatbot */}
          <div className="flex-1 overflow-hidden">
            <Chatbot  isPopup={true}  />
          </div>
        </div>
      )}
    </>
  );
}