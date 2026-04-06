import { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faXmark } from "@fortawesome/free-solid-svg-icons";
import { Input } from "./Input";

const imgRoo = "/Airoo-circle.png";
const imgBubble = "/Airoo-talkbubble.png";
const BACKEND = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL}/chat`
  : `https://rookiz.onrender.com/chat`;

function ChatHeader({ onClose }) {
  return (
    <div className="flex items-center justify-between py-3 px-4 bg-primary-400">
      <div className="flex items-center gap-2">
        <img src={imgRoo} className="size-8 rounded-full" alt="루" />
        <span className="font-bold text-sm text-gray-900">AI 루</span>
      </div>
      <button onClick={onClose} className="size-7 flex items-center justify-center rounded-full hover:bg-primary-500 transition-colors text-gray-800">
        <FontAwesomeIcon icon={faXmark} />
      </button>
    </div>
  );
}

function ChatMessages({ messages, loading, bottomRef }) {
  return (
    <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 min-h-[150px] md:min-h-[200px] max-h-[240px] md:max-h-[340px] bg-primary-100">
      {messages.map((message, i) => (
        <div key={i} className={`py-2 px-3 max-w-4/5 text-sm leading-snug whitespace-pre-wrap break-words ${message.role === "user" ? "self-end bg-primary-400 text-gray-900 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl" : "self-start bg-white text-gray-800 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl shadow-sm"}`}>
          {message.text}
        </div>
      ))}
      {loading && <div className="self-start bg-white text-gray-400 rounded-tl-2xl rounded-tr-2xl rounded-br-2xl py-2 px-3 text-sm shadow-sm">...</div>}
      <div ref={bottomRef} />
    </div>
  );
}

function ChatInput({ input, loading, onInputChange, onSend, onKeyDown }) {
  return (
    <div className="flex border-t border-gray-100 p-2 gap-2 bg-white">
      <Input
        variant="chat"
        value={input}
        onChange={onInputChange}
        onKeyDown={onKeyDown}
        placeholder="메시지를 입력하세요..."
        disabled={loading}
        className="flex-1"
      />
      <button
        onClick={onSend}
        disabled={loading || !input.trim()}
        className="size-9 rounded-full bg-primary-400 text-gray-900 flex items-center justify-center hover:bg-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FontAwesomeIcon icon={faPaperPlane} className="text-sm" />
      </button>
    </div>
  );
}

export function AiRooSticky() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "bot", text: "안녕하세요! 영화에 대해 무엇이든 물어보세요 😊" }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    if (open) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(BACKEND, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: "서버 연결에 실패했습니다. 다시 시도해주세요." }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <>
      {open && (
        <div className="fixed bottom-28 right-6 md:bottom-40 md:right-20 w-80 md:w-96 max-h-[500px] bg-white rounded-3xl flex flex-col shadow-xl z-[99] overflow-hidden">
          <ChatHeader onClose={() => setOpen(false)} />
          <ChatMessages messages={messages} loading={loading} bottomRef={bottomRef} />
          <ChatInput input={input} loading={loading} onInputChange={(e) => setInput(e.target.value)} onSend={sendMessage} onKeyDown={handleKeyDown} />
        </div>
      )}

      <div className="fixed bottom-6 right-6 md:bottom-20 md:right-20 flex items-center gap-2 z-[100]">
        {!open && (
          <div className="relative hidden sm:block">
            <img src={imgBubble} className="w-40 md:w-[216px] md:translate-y-11 md:translate-x-7" alt="bubble" />
            <span className="absolute inset-0 flex items-center justify-center text-gray-600 text-base md:text-xl font-semibold mb-2 md:translate-y-12 md:translate-x-7">루에게 물어보세요!</span>
          </div>
        )}
        <div onClick={() => setOpen((v) => !v)} className="size-16 md:size-[95px] bg-primary-300 rounded-full flex items-center justify-center shadow-md cursor-pointer hover:scale-110 transition-transform overflow-hidden">
          <img src={imgRoo} className="w-20 md:w-[125px] h-auto object-contain" alt="AI 루" />
        </div>
      </div>
    </>
  );
}
