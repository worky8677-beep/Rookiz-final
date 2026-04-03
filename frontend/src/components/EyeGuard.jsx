import { twMerge } from "tailwind-merge";
import { useEyeGuard, WARN_RATIO } from "../hooks/useEyeGuard";
import {
  EYE_STATUS,
  STATUS_TEXT,
  STATUS_BG_LIGHT,
  STATUS_BORDER,
  GAUGE_BG,
} from "../constants/eyeGuard";

export function EyeGuard() {
  const { videoRef, status, ratio, running, start, stop } = useEyeGuard();

  const msg = EYE_STATUS[status];
  const pct = Math.min(ratio / WARN_RATIO, 1);
  const isDanger = status === "danger";

  return (
    <div className="min-h-screen bg-dark-900 flex flex-col items-center justify-center text-dark-50 p-6 gap-6 font-sans">

      <div className="text-center">
        <div className="text-sm tracking-[4px] text-dark-500 mb-1.5 uppercase">Eye Guard</div>
        <div className="text-2xl font-bold text-dark-50">눈 거리 보호 앱</div>
      </div>

      <div className="relative w-eye-guard h-[210px] rounded-2xl overflow-hidden bg-dark-600 border border-dark-900">
        <video
          ref={videoRef}
          muted
          playsInline
          className={`w-full h-full object-cover [transform:scaleX(-1)] ${running ? "block" : "hidden"}`}
        />
        {!running && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
            <span className="text-4xl">📷</span>
            <span className="text-xs text-dark-600">카메라 대기 중</span>
          </div>
        )}
        {running && (
          <div
            className={twMerge(
              "absolute top-2.5 left-1/2 -translate-x-1/2 bg-black/70 rounded-full px-3.5 py-1 text-xs whitespace-nowrap backdrop-blur-sm border",
              STATUS_TEXT[status],
              STATUS_BORDER[status]
            )}
          >
            {msg.icon} {msg.text.split("\n")[0]}
          </div>
        )}
      </div>

      <div className="w-eye-guard">
        <div className="flex justify-between text-xs text-dark-500 mb-1.5">
          <span>멀다 (안전)</span>
          <span>가깝다 (위험)</span>
        </div>
        <div className="h-2 bg-dark-900 rounded overflow-hidden">
          <div
            className={twMerge("h-full rounded transition-[width] duration-150 ease-linear", GAUGE_BG[status])}
            style={{ width: `${pct * 100}%` }}
          />
        </div>
        <div className="text-center mt-1.5 text-xs text-dark-500">
          {running ? `얼굴 비율 ${Math.round(ratio * 100)}% (임계 ${Math.round(WARN_RATIO * 100)}%)` : "—"}
        </div>
      </div>

      <div
        className={twMerge(
          "w-eye-guard min-h-[72px] rounded-xl flex flex-col items-center justify-center gap-1 p-3 border transition-all duration-300",
          running ? `${STATUS_BG_LIGHT[status]} ${STATUS_BORDER[status]}` : "bg-dark-600 border-dark-500"
        )}
      >
        <div className={twMerge("transition-[font-size] duration-300", isDanger ? "text-3xl" : "text-2xl")}>
          {msg.icon}
        </div>
        <div
          className={twMerge(
            "text-sm text-center leading-relaxed whitespace-pre-line",
            isDanger ? "font-bold" : "font-normal",
            running ? STATUS_TEXT[status] : "text-dark-300"
          )}
        >
          {msg.text}
        </div>
      </div>

      <button
        onClick={running ? stop : start}
        disabled={status === "loading"}
        className={twMerge(
          "px-10 py-3 rounded-lg text-sm font-semibold border-0 tracking-wide transition-colors",
          status === "loading"
            ? "bg-dark-600 text-dark-500 cursor-not-allowed"
            : running
            ? "bg-dark-900 text-dark-300 cursor-pointer"
            : "bg-dark-action text-white cursor-pointer"
        )}
      >
        {status === "loading" ? "로딩 중..." : running ? "중지" : "시작"}
      </button>

      <div className="text-xs text-dark-600 text-center leading-7">
        적정 시청 거리: <span className="text-status-ok">30cm 이상</span><br />
        전면 카메라 필요
      </div>
    </div>
  );
}
