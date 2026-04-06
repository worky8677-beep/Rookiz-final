import { useState, useRef } from "react";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass, faComment, faTrophy,
  faCircleArrowUp, faRocket, faMedal,
} from "@fortawesome/free-solid-svg-icons";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { useProfile } from "../context/ProfileContext";
import { useMission } from "../context/MissionContext";

const BACKEND = `https://rookiz.onrender.com/chat`;
const imgRoo = "/Airoo-circle.png";

const INIT_MESSAGES = [
  {
    role: "bot",
    text: "안녕 나는 루야!\n궁금한 콘텐츠나 추천이 필요하면 뭐든 물어봐줘!",
    time: "오전 10:41",
  },
];

const QUICK_CHIPS = ["오늘의 추천 콘텐츠", "퀴즈 하고 싶어!"];

const QUIZ = {
  question: "오늘 시청한 <우주특공대>에서 주인공 민철이가 간 태양계에서 가장 작은 별은?",
  options: ["화성", "목성", "천왕성", "해왕성"],
  correct: 2, // 0-based index (천왕성 — 디자인 기준)
};

const INIT_MISSIONS = [
  { id: 1, text: "1시간만 보고 종료하기" },
  { id: 2, text: "오빠랑 30분씩 돌아가면서 보기" },
  { id: 3, text: "루처럼 멋진 자세로 보기" },
  { id: 4, text: "보고 싶은 영상이 생기면 부모님께 먼저 물어보기" },
];

const STARS = [
  { top: "31%", left: "0.8%",  size: 5, opacity: 0.59, color: "white"   },
  { top: "5%",  left: "33%",   size: 5, opacity: 0.37, color: "white"   },
  { top: "1%",  left: "14%",   size: 4, opacity: 0.56, color: "var(--color-star-gold)" },
  { top: "83%", left: "44%",   size: 5, opacity: 0.33, color: "white"   },
  { top: "42%", left: "4.5%",  size: 5, opacity: 0.52, color: "white"   },
  { top: "88%", left: "1.8%",  size: 4, opacity: 0.23, color: "var(--color-star-gold)" },
  { top: "33%", left: "33%",   size: 5, opacity: 0.17, color: "white"   },
  { top: "78%", left: "56%",   size: 3, opacity: 0.41, color: "var(--color-star-gold)" },
  { top: "81%", left: "73%",   size: 5, opacity: 0.29, color: "white"   },
  { top: "8%",  left: "75%",   size: 3, opacity: 0.30, color: "white"   },
  { top: "14%", left: "89%",   size: 5, opacity: 0.12, color: "var(--color-star-gold)" },
  { top: "77%", left: "27%",   size: 5, opacity: 0.36, color: "var(--color-star-gold)" },
  { top: "6%",  left: "93%",   size: 5, opacity: 0.36, color: "white"   },
  { top: "68%", left: "88%",   size: 2, opacity: 0.12, color: "var(--color-star-gold)" },
  { top: "42%", left: "10%",   size: 4, opacity: 0.10, color: "white"   },
  { top: "13%", left: "25%",   size: 3, opacity: 0.50, color: "white"   },
];

/* ── 선택지 카드 ── */
function OptionCard({ num, text, state = "default", onClick }) {
  const styles = {
    default:  "bg-white border-gray-100 text-gray-700 hover:border-gray-300",
    correct:  "bg-green-100 border-green-600 text-gray-700",
    wrong:    "bg-secondary-100 border-secondary-500 text-gray-700",
    done:     "bg-primary-100 border-primary-400 text-gray-700",
  };
  return (
    <button
      onClick={onClick}
      className={twMerge(
        "flex items-center gap-3 md:gap-5 h-16 md:h-22 pl-4 md:pl-5.5 pr-0.5 py-0.5 rounded-2xl md:rounded-3xl border-2 w-full transition-all duration-200 cursor-pointer",
        styles[state]
      )}
    >
      <span className="text-lg md:text-2xl font-extrabold text-primary-500 w-7 md:w-9 shrink-0">{num}</span>
      <span className="text-sm md:text-2xl font-extrabold text-left">{text}</span>
    </button>
  );
}

export default function AiRoo() {
  const { activeProfile } = useProfile();
  /* 대화 탭 상태 */
  const [activeTab, setActiveTab] = useState("talk");
  const [messages, setMessages] = useState(INIT_MESSAGES);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  /* 퀴즈 탭 상태 */
  const [selected, setSelected] = useState(null);
  const [pendingMissions, setPendingMissions] = useState(new Set());
  const { saveMissions, savedToday } = useMission();

  function toggleMission(id) {
    if (savedToday) return;
    setPendingMissions((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleSave() {
    if (savedToday) return;
    saveMissions(pendingMissions);
  }

  async function sendMessage(text) {
    const msg = (text ?? input).trim();
    if (!msg || loading) return;
    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setInput("");
    setLoading(true);
    try {
      console.log("Sending to:", BACKEND); // 디버깅용
      const res = await fetch(BACKEND, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: msg }),
      });
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch (err) {
      console.error("AI Roo Chat Error:", err);
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: "서버 연결에 실패했습니다. 다시 시도해주세요." },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: "smooth" }), 50);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  function getAnswerState(idx) {
    if (selected === null) return "default";
    if (idx === QUIZ.correct) return "correct";
    if (idx === selected) return "wrong";
    return "default";
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Nav activeTab="airon" />

      {/* ── 히어로 섹션 ── */}
      <section
        className="relative w-full overflow-hidden py-8 md:py-10 shrink-0 bg-linear-[169deg] from-airoo-from to-airoo-to"
      >
        {STARS.map((s, i) => (
          <div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{ top: s.top, left: s.left, width: s.size, height: s.size, opacity: s.opacity, backgroundColor: s.color }}
          />
        ))}

        <div className="relative z-10 max-w-container mx-auto px-4 md:px-10 flex flex-col gap-5">
          {/* 아바타 + 타이틀 */}
          <div className="flex items-center gap-3 md:gap-5">
            <div className="size-16 md:size-24 bg-primary-300 rounded-full overflow-hidden shrink-0 shadow-md flex items-center justify-center">
              <img src={imgRoo} alt="AI 루" className="w-[125px] h-auto object-contain -scale-x-100" />
            </div>
            <div className="flex flex-col gap-1">
              <h1 className="text-xl md:text-3xl font-bold text-white">AI 루</h1>
              <p className="text-sm md:text-base font-medium text-white/65">
                {activeProfile?.name}의 AI 친구 · 콘텐츠 추천 &amp; 퀴즈 도우미
              </p>
            </div>
          </div>

          {/* 탭 버튼 */}
          <div className="flex gap-2.5 items-center">
            <button
              onClick={() => setActiveTab("talk")}
              className={twMerge(
                "flex items-center gap-1.5 md:gap-2 h-11 md:h-15 px-4 md:px-5.5 rounded-full border-2 shadow-sm font-bold text-sm md:text-xl transition-all duration-200",
                activeTab === "talk"
                  ? "bg-blue-100 border-blue-500 text-gray-700"
                  : "bg-gray-100 border-gray-300 text-gray-400"
              )}
            >
              <FontAwesomeIcon icon={faComment} />
              루와 대화하기
            </button>
            <button
              onClick={() => setActiveTab("quiz")}
              className={twMerge(
                "flex items-center gap-1.5 md:gap-2 h-11 md:h-15 px-4 md:px-5.5 rounded-full border-2 shadow-sm font-bold text-sm md:text-xl transition-all duration-200",
                activeTab === "quiz"
                  ? "bg-primary-100 border-primary-500 text-gray-700"
                  : "bg-gray-100 border-gray-300 text-gray-400"
              )}
            >
              <FontAwesomeIcon icon={faTrophy} />
              퀴즈와 미션
            </button>
          </div>
        </div>
      </section>

      {/* ── 탭 콘텐츠 ── */}
      {activeTab === "talk" ? (

        /* ── 대화 탭 ── */
        <main className="flex-1 flex flex-col w-full max-w-container mx-auto px-4 md:px-10">
          <div className="flex-1 flex flex-col gap-4 py-4 min-h-75">
            {messages.map((m, i) =>
              m.role === "bot" ? (
                <div key={i} className="flex items-start gap-4">
                  <div className="size-9 md:size-12.5 bg-primary-300 rounded-full overflow-hidden shrink-0 flex items-center justify-center">
                    <img src={imgRoo} alt="루" className="w-16 h-auto object-contain -scale-x-100" />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <div className="bg-white rounded-tl-2xl rounded-tr-2xl rounded-br-2xl shadow-sm px-3 py-3 md:px-5 md:py-5 max-w-[85%] md:max-w-xl">
                      <p className="text-sm md:text-lg font-medium text-gray-700 whitespace-pre-wrap leading-6 md:leading-7">{m.text}</p>
                    </div>
                    {m.time && <span className="text-sm text-gray-400">{m.time}</span>}
                  </div>
                </div>
              ) : (
                <div key={i} className="flex justify-end">
                  <div className="bg-primary-400 rounded-tl-2xl rounded-tr-2xl rounded-bl-2xl px-5 py-4 max-w-xl">
                    <p className="text-base text-gray-900 whitespace-pre-wrap leading-7">{m.text}</p>
                  </div>
                </div>
              )
            )}
            {loading && (
              <div className="flex items-start gap-4">
                <div className="size-12.5 bg-primary-300 rounded-full overflow-hidden shrink-0 flex items-center justify-center">
                  <img src={imgRoo} alt="루" className="w-16 h-auto object-contain -scale-x-100" />
                </div>
                <div className="bg-white rounded-tl-2xl rounded-tr-2xl rounded-br-2xl shadow-sm px-3 py-3 md:px-5 md:py-5">
                  <p className="text-sm md:text-lg text-gray-400">...</p>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* 빠른 질문 칩 */}
          <div className="flex gap-2 md:gap-4 items-center py-4 flex-wrap">
            {QUICK_CHIPS.map((chip) => (
              <button
                key={chip}
                onClick={() => sendMessage(chip)}
                className="flex items-center gap-1 bg-primary-100 border border-primary-500 rounded-2xl h-11 px-5 text-sm font-bold text-gray-700 hover:bg-primary-200 transition-colors whitespace-nowrap"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* 입력 바 */}
          <div className="flex gap-3 md:gap-6 items-center py-3 mb-4">
            <div className="flex-1 bg-white border-4 border-primary-500 rounded-3xl h-14 md:h-20 flex items-center px-4 md:px-8 gap-3 md:gap-4 shadow-sm">
              <FontAwesomeIcon icon={faMagnifyingGlass} className="text-lg md:text-3xl text-gray-700 shrink-0" />
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="루에게 물어봐!"
                disabled={loading}
                className="flex-1 text-base md:text-xl font-medium text-gray-700 outline-none placeholder:text-gray-300 bg-transparent"
              />
            </div>
            <button
              onClick={() => sendMessage()}
              disabled={loading || !input.trim()}
              className="size-14 md:size-20 bg-primary-500 rounded-2xl flex items-center justify-center hover:bg-primary-400 transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FontAwesomeIcon icon={faCircleArrowUp} className="text-2xl md:text-4xl text-white" />
            </button>
          </div>
        </main>

      ) : (

        /* ── 퀴즈와 미션 탭 ── */
        <main className="flex-1 w-full max-w-container mx-auto px-4 md:px-10 py-10 flex flex-col gap-16">

          {/* 오늘의 퀴즈 */}
          <section className="flex flex-col gap-5">
            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-800 leading-8 md:leading-12">오늘의 퀴즈</h2>

            {/* 문제 카드 */}
            <div className="bg-blue-100 border-2 border-blue-200 rounded-3xl flex flex-col items-center justify-center gap-3.5 py-8 px-1">
              <FontAwesomeIcon icon={faRocket} className="text-4xl text-gray-700" />
              <p className="text-base md:text-2xl font-bold text-gray-700 text-center leading-7 md:leading-9">
                {QUIZ.question}
              </p>
            </div>

            {/* 보기 2×2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {QUIZ.options.map((opt, idx) => (
                <OptionCard
                  key={idx}
                  num={idx + 1}
                  text={opt}
                  state={getAnswerState(idx)}
                  onClick={() => selected === null && setSelected(idx)}
                />
              ))}
            </div>
          </section>

          {/* 루와의 미션 */}
          <section className="flex flex-col gap-5 pb-10">
            <h2 className="text-2xl md:text-4xl font-extrabold text-gray-800 leading-8 md:leading-12">루와의 미션</h2>

            {/* 안내 카드 */}
            <div className="bg-primary-100 border-2 border-primary-400 rounded-3xl flex flex-col items-center justify-center gap-3.5 py-8 px-1">
              <FontAwesomeIcon icon={faMedal} className="text-4xl text-gray-700" />
              <p className="text-base md:text-2xl font-bold text-gray-700 text-center leading-7 md:leading-9">
                미션을 잘 지키면 칭찬 하루 스티커를 붙여줄게! 오늘 어떤걸 지켰어?
              </p>
            </div>

            {/* 미션 2×2 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {INIT_MISSIONS.map((m) => (
                <OptionCard
                  key={m.id}
                  num={m.id}
                  text={m.text}
                  state={pendingMissions.has(m.id) ? "done" : "default"}
                  onClick={() => toggleMission(m.id)}
                />
              ))}
            </div>

            {/* 저장 버튼 */}
            <div className="flex justify-end items-center gap-3 pt-2">
              {savedToday && (
                <p className="text-sm font-semibold text-gray-400">
                  오늘의 미션은 이미 완료했어요! 내일 다시 도전해봐요 🎉
                </p>
              )}
              <button
                onClick={handleSave}
                disabled={savedToday}
                className={twMerge(
                  "flex items-center gap-2 h-11 px-6 rounded-full border-2 text-sm font-bold transition-all duration-200 shrink-0",
                  savedToday
                    ? "bg-primary-500 border-primary-500 text-white cursor-default"
                    : "bg-white border-primary-500 text-primary-800 hover:bg-primary-500 hover:text-white"
                )}
              >
                <FontAwesomeIcon icon={faMedal} className="text-base" />
                {savedToday ? "저장 완료!" : "미션 결과 저장하기"}
              </button>
            </div>
          </section>

        </main>
      )}

      <Footer />
    </div>
  );
}
