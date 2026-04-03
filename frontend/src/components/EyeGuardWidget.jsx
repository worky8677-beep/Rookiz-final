import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
import { useEyeGuard, WARN_RATIO } from "../hooks/useEyeGuard";
import { EYE_STATUS, STATUS_TEXT, GAUGE_BG } from "../hooks/eyeGuard";

function Widget() {
  const dragRef = useRef({ dragging: false, ox: 0, oy: 0 });
  const [pos,  setPos]  = useState({ x: 16, y: 16 });
  const [open, setOpen] = useState(true);

  const { videoRef, status, ratio, running, start, stop } = useEyeGuard();

  useEffect(() => {
    const onMove = (e) => {
      if (!dragRef.current.dragging) return;
      const dx = e.clientX - dragRef.current.ox;
      const dy = e.clientY - dragRef.current.oy;
      dragRef.current.ox = e.clientX;
      dragRef.current.oy = e.clientY;
      setPos(p => ({ x: p.x - dx, y: p.y - dy }));
    };
    const onUp = () => { dragRef.current.dragging = false; };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => { window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp); };
  }, []);

  const onMouseDown = (e) => {
    dragRef.current = { dragging: true, ox: e.clientX, oy: e.clientY };
    e.preventDefault();
  };

  const statusInfo = EYE_STATUS[status];
  const pct = Math.min((ratio / WARN_RATIO) * 100, 100);
  const isDanger = status === "danger";

  return (
    <div
      className={twMerge("fixed z-[999999] select-none transition-[filter] duration-300", isDanger && "drop-shadow-[0_0_12px_color-mix(in_srgb,var(--color-status-danger)_53%,transparent)]")}
      style={{ right: `${pos.x}px`, top: `${pos.y}px` }}
    >
      {open && (
        <div className={twMerge(
          "w-50 bg-white rounded-xl overflow-hidden mb-2 transition-colors",
          isDanger ? "border border-status-danger/40" : "border border-gray-200"
        )}>
          {/* 드래그 헤더 */}
          <div
            onMouseDown={onMouseDown}
            className="px-3 py-2 bg-gray-50 cursor-grab flex items-center justify-between border-b border-gray-200"
          >
            <span className="text-xs text-gray-500 tracking-[2px]">EYE GUARD</span>
            <span className={twMerge("text-xs font-bold", STATUS_TEXT[status])}>
              {statusInfo.icon} {statusInfo.label}
            </span>
          </div>

          {/* 카메라 */}
          <div className="relative h-[112px] bg-gray-100">
            <video
              ref={videoRef} muted playsInline
              className={twMerge("w-full h-full object-cover [transform:scaleX(-1)]", running ? "block" : "hidden")}
            />
            {!running && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl">📷</span>
              </div>
            )}
            {isDanger && (
              <div className="absolute inset-0 pointer-events-none animate-[blink_0.6s_ease-in-out_infinite_alternate] bg-status-danger/13" />
            )}
          </div>

          {/* 게이지 + 버튼 */}
          <div className="px-3 py-2">
            <div className="h-1 bg-gray-200 rounded overflow-hidden">
              <div
                className={twMerge("h-full rounded transition-[width,background] duration-150", GAUGE_BG[status])}
                style={{ width: `${pct}%` }}
              />
            </div>
            <div className="mt-1.5 flex justify-between items-center">
              <span className="text-xs text-gray-400">
                {running ? `비율 ${Math.round(ratio * 100)}%` : "카메라 꺼짐"}
              </span>
              <button
                onClick={running ? stop : start}
                disabled={status === "loading"}
                className={twMerge(
                  "text-xs px-2.5 py-0.5 rounded font-semibold border-0",
                  status === "loading" && "bg-gray-300 text-gray-400 cursor-not-allowed",
                  status !== "loading" && running && "bg-gray-200 text-gray-500 cursor-pointer",
                  status !== "loading" && !running && "bg-blue-600 text-white cursor-pointer"
                )}
              >
                {status === "loading" ? "로딩..." : running ? "중지" : "시작"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 토글 버튼 */}
      <div className="flex justify-end">
        <button
          onClick={() => setOpen(o => !o)}
          className={twMerge(
            "size-9 rounded-full bg-white border flex items-center justify-center cursor-pointer text-base",
            isDanger ? "border-status-danger/40 text-status-danger" : "border-gray-200 text-gray-500"
          )}
        >
          {open ? "✕" : "👁"}
        </button>
      </div>
    </div>
  );
}

export function EyeGuardWidget() {
  return createPortal(<Widget />, document.body);
}
