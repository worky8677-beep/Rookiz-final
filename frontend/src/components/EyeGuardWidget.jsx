import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faXmark } from "@fortawesome/free-solid-svg-icons";
import { WARN_RATIO } from "../hooks/useEyeGuard";
import { EYE_STATUS, STATUS_TEXT, GAUGE_BG } from "../hooks/eyeGuard";
import { useEyeGuardContext } from "../context/EyeGuardContext";

export function EyeGuardDropdown() {
  const [open, setOpen] = useState(false);
  const dropRef = useRef(null);
  const { videoRef, status, ratio, running, start, stop } = useEyeGuardContext();

  useEffect(() => {
    if (!open) return;
    function onOutside(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  const statusInfo = EYE_STATUS[status];
  const pct = Math.min((ratio / WARN_RATIO) * 100, 100);
  const isDanger = status === "danger";

  return (
    <div ref={dropRef} className="relative">
      {/* 항상 DOM에 존재 — 드롭다운 열림과 무관하게 감지 유지 */}
      <video ref={videoRef} muted playsInline className="sr-only" />

      {/* 트리거 버튼 */}
      <button
        onClick={() => setOpen((v) => !v)}
        className={twMerge(
          "size-9.5 rounded-full flex items-center justify-center cursor-pointer transition-colors relative",
          isDanger
            ? "bg-status-danger/10 text-status-danger animate-pulse"
            : running
              ? "bg-status-ok/10 text-status-ok"
              : "bg-gray-50 text-gray-400 hover:bg-gray-100"
        )}
      >
        <FontAwesomeIcon icon={faEye} className="text-lg" />
        {running && (
          <div className={twMerge(
            "absolute top-1.75 right-1.75 size-2.5 rounded-full border-2 border-white",
            isDanger ? "bg-status-danger" : "bg-status-ok"
          )} />
        )}
      </button>

      {/* 드롭다운 패널 */}
      {open && (
        <div className={twMerge(
          "absolute right-0 top-[calc(100%+8px)] w-56 bg-white rounded-2xl shadow-lg border overflow-hidden z-50",
          isDanger ? "border-status-danger/30" : "border-gray-100"
        )}>
          {/* 헤더 */}
          <div className="px-3 py-2 bg-gray-50 flex items-center justify-between border-b border-gray-100">
            <span className="text-xs font-bold text-gray-500 tracking-wider">EYE GUARD</span>
            <div className="flex items-center gap-2">
              <span className={twMerge("text-xs font-bold", STATUS_TEXT[status])}>
                {statusInfo.icon} {statusInfo.label}
              </span>
              <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600">
                <FontAwesomeIcon icon={faXmark} className="text-sm" />
              </button>
            </div>
          </div>

          {/* 카메라 미리보기 */}
          <div className="relative h-28 bg-gray-100 overflow-hidden">
            <video
              ref={null}
              muted playsInline
              className="hidden"
            />
            {/* 실제 스트림은 숨겨진 videoRef로 흐름 — 여기선 상태만 표시 */}
            {!running && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                <FontAwesomeIcon icon={faEye} className="text-2xl text-gray-300" />
                <span className="text-xs text-gray-400">카메라 꺼짐</span>
              </div>
            )}
            {running && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
                <FontAwesomeIcon icon={faEye} className={twMerge("text-2xl", STATUS_TEXT[status])} />
                <span className={twMerge("text-xs font-bold", STATUS_TEXT[status])}>{statusInfo.label}</span>
              </div>
            )}
            {isDanger && (
              <div className="absolute inset-0 pointer-events-none animate-[blink_0.6s_ease-in-out_infinite_alternate] bg-status-danger/13" />
            )}
          </div>

          {/* 게이지 + 버튼 */}
          <div className="px-3 py-2.5">
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={twMerge("h-full rounded-full transition-[width,background] duration-150", GAUGE_BG[status])}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-xs text-gray-400">
                {running ? `비율 ${Math.round(ratio * 100)}%` : "시작을 눌러주세요"}
              </span>
              <button
                onClick={running ? stop : start}
                disabled={status === "loading"}
                className={twMerge(
                  "text-xs px-3 py-1 rounded-full font-bold transition-colors",
                  status === "loading" && "bg-gray-200 text-gray-400 cursor-not-allowed",
                  status !== "loading" && running && "bg-gray-100 text-gray-500 hover:bg-gray-200 cursor-pointer",
                  status !== "loading" && !running && "bg-primary-500 text-white hover:bg-primary-400 cursor-pointer"
                )}
              >
                {status === "loading" ? "로딩..." : running ? "중지" : "시작"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
