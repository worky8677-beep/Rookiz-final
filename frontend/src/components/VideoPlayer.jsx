import { useState, useEffect } from "react";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faPlay } from "@fortawesome/free-solid-svg-icons";
import { useEyeGuardContext } from "../context/EyeGuardContext";

// ── 뒤로가기 버튼 ─────────────────────────────────────────────────
function BackBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="size-8 md:size-[38px] flex items-center justify-center rounded-full bg-gray-950/60 hover:bg-gray-950/40 transition-colors shrink-0"
    >
      <FontAwesomeIcon icon={faAngleLeft} className="text-white text-xs md:text-sm" />
    </button>
  );
}

// ── 재생 전 중앙 플레이 버튼 ─────────────────────────────────────
function BigPlayBtn({ onClick }) {
  return (
    <div className="flex flex-col items-center gap-3 md:gap-4">
      <button
        onClick={onClick}
        className="size-16 md:size-[87px] bg-primary-500 rounded-full flex items-center justify-center shadow-play-glow hover:scale-105 transition-transform"
        aria-label="재생"
      >
        <FontAwesomeIcon icon={faPlay} className="text-black text-xl md:text-[28px] translate-x-0.5" />
      </button>
      <p className="text-white text-xs md:text-sm font-semibold font-sans">▶ 재생 버튼을 눌러 시작하세요</p>
    </div>
  );
}

// ── 메인 VideoPlayer ──────────────────────────────────────────────
export function VideoPlayer({ youtubeKey, poster, title, subtitle, onBack, className, autoPlay = false }) {
  const [started, setStarted] = useState(autoPlay && !!youtubeKey);
  const { running, start, stop } = useEyeGuardContext();

  // 영상 재생 시 eye guard 자동 시작, 종료 시 중지
  useEffect(() => {
    if (started) { if (!running) start(); }
    else stop();
  }, [started]);

  function handleBack() {
    stop();
    onBack?.();
  }

  const iframeSrc = youtubeKey
    ? `https://www.youtube.com/embed/${youtubeKey}?autoplay=1&mute=1&rel=0&modestbranding=1&playsinline=1`
    : null;

  return (
    <div className={twMerge("relative w-full overflow-hidden bg-black select-none aspect-video", className)}>

      {/* ── 재생 전: 포스터 + 오버레이 ── */}
      {!started && (
        <>
          {poster && (
            <img
              src={poster}
              alt={title ?? ""}
              className="absolute inset-0 w-full h-full object-cover opacity-80"
              loading="eager"
            />
          )}
          <div className="absolute inset-0 pointer-events-none overlay-player" />

          {/* 상단 뒤로가기 */}
          <div className="absolute top-5 left-5 md:top-6 md:left-7 z-10">
            <BackBtn onClick={handleBack} />
          </div>

          {/* 중앙: 예고편 없을 때 안내 / 있을 때 플레이 버튼 */}
          <div className="absolute inset-0 flex items-center justify-center">
            {youtubeKey ? (
              <BigPlayBtn onClick={() => setStarted(true)} />
            ) : (
              <p className="text-white/60 text-sm font-semibold font-sans">예고편이 없습니다</p>
            )}
          </div>

          {/* 하단 제목 */}
          {(title || subtitle) && (
            <div className="absolute bottom-4 left-5 md:bottom-5 md:left-7 flex flex-col gap-0.5">
              {title && <p className="text-white font-extrabold text-sm md:text-base font-sans truncate">{title}</p>}
              {subtitle && <p className="text-white/70 text-xs font-sans truncate">{subtitle}</p>}
            </div>
          )}
        </>
      )}

      {/* ── 재생 후: YouTube iframe ── */}
      {started && iframeSrc && (
        <>
          <iframe
            className="absolute inset-0 w-full h-full"
            src={iframeSrc}
            title={title ?? "예고편"}
            allow="autoplay; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
          />
          {/* 뒤로가기 버튼만 오버레이 */}
          <div className="absolute top-5 left-5 md:top-6 md:left-7 z-10">
            <BackBtn onClick={handleBack} />
          </div>
        </>
      )}
    </div>
  );
}
