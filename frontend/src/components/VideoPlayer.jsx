import { useState, useRef, useEffect, useCallback } from "react";
import ReactPlayer from "react-player";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faVolumeXmark,
  faVolumeHigh,
  faTv,
  faPlay,
  faPause,
  faBackwardStep,
  faForwardStep,
  faClosedCaptioning,
  faExpand,
  faCompress,
  faGear,
  faUnlock,
} from "@fortawesome/free-solid-svg-icons";

const AUTO_HIDE_DELAY  = 3000;
const INTRO_END_SEC    = 90;  // 인트로 종료 시점 (초)
const OUTRO_START_SEC  = 30;  // 엔딩 구간 시작 (잔여 초)

// ── 상단 버튼 (38px, 어두운 배경) ────────────────────────────────
function TopBtn({ faIcon, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        "size-8 md:size-[38px] flex items-center justify-center rounded-full bg-gray-950/60 hover:bg-gray-950/40 transition-colors shrink-0",
        className
      )}
    >
      <FontAwesomeIcon icon={faIcon} className="text-white text-xs md:text-sm" />
    </button>
  );
}

// ── 하단 소형 버튼 ───────────────────────────────────────────────
function SmBtn({ faIcon, onClick, className }) {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        "size-8 md:size-[38px] flex items-center justify-center rounded-full bg-white/12 hover:bg-white/20 transition-colors shrink-0",
        className
      )}
    >
      <FontAwesomeIcon icon={faIcon} className="text-white text-xs md:text-sm" />
    </button>
  );
}

// ── 볼륨 버튼 ────────────────────────────────────────────────────
function VolumeBtn({ muted, onClick }) {
  return (
    <button
      onClick={onClick}
      className="size-7 md:size-[33px] flex items-center justify-center rounded-full bg-white/12 hover:bg-white/20 transition-colors shrink-0"
    >
      <FontAwesomeIcon
        icon={muted ? faVolumeXmark : faVolumeHigh}
        className="text-white text-[10px] md:text-[11px]"
      />
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

// ── 재생 중 진행 바 + 시간 ────────────────────────────────────────
function ProgressBar({ played, duration, onSeek }) {
  const fmt = (sec) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = Math.floor(sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onSeek?.((e.clientX - rect.left) / rect.width);
  };
  return (
    <div className="flex flex-col gap-1 w-full">
      <div className="w-full h-[4px] bg-white/20 rounded-full cursor-pointer" onClick={handleClick}>
        <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(played ?? 0) * 100}%` }} />
      </div>
      <div className="flex justify-between">
        <span className="text-[11px] text-white/60 font-semibold font-sans">{fmt((played ?? 0) * (duration ?? 0))}</span>
        <span className="text-[11px] text-white/40 font-semibold font-sans">{fmt(duration ?? 0)}</span>
      </div>
    </div>
  );
}

// ── 재생 전 프리뷰 바 ─────────────────────────────────────────────
function PreviewBar({ played, onSeek }) {
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onSeek?.((e.clientX - rect.left) / rect.width);
  };
  return (
    <div className="w-full h-[4px] bg-white/20 rounded-full cursor-pointer" onClick={handleClick}>
      <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(played ?? 0) * 100}%` }} />
    </div>
  );
}

// ── 메인 VideoPlayer ──────────────────────────────────────────────
export function VideoPlayer({ youtubeKey, poster, title, subtitle, onBack, className }) {
  const [playing, setPlaying]   = useState(false);
  const [muted, setMuted]       = useState(false);
  const [played, setPlayed]     = useState(0);
  const [duration, setDuration] = useState(0);
  const [ctrlVisible,   setCtrlVisible]   = useState(true);
  const [isFullscreen,  setIsFullscreen]  = useState(false);
  const playerRef      = useRef(null);
  const timerRef       = useRef(null);
  const containerRef   = useRef(null);
  const hasStarted     = useRef(false); // 첫 재생 여부

  // 3초 타이머 시작/리셋
  const resetTimer = useCallback(() => {
    clearTimeout(timerRef.current);
    setCtrlVisible(true);
    if (playing) {
      timerRef.current = setTimeout(() => setCtrlVisible(false), AUTO_HIDE_DELAY);
    }
  }, [playing]);

  // 재생 상태 변경 시 타이머 처리
  useEffect(() => {
    if (playing) {
      timerRef.current = setTimeout(() => setCtrlVisible(false), AUTO_HIDE_DELAY);
    } else {
      clearTimeout(timerRef.current);
      setCtrlVisible(true);
    }
    return () => clearTimeout(timerRef.current);
  }, [playing]);

  // 풀스크린 상태 동기화
  useEffect(() => {
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    document.addEventListener("webkitfullscreenchange", onChange);
    return () => {
      document.removeEventListener("fullscreenchange", onChange);
      document.removeEventListener("webkitfullscreenchange", onChange);
    };
  }, []);

  const requestFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (el.requestFullscreen) el.requestFullscreen();
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
  };

  const exitFullscreen = () => {
    if (document.exitFullscreen) document.exitFullscreen();
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
  };

  const toggleFullscreen = () => {
    if (isFullscreen) exitFullscreen();
    else requestFullscreen();
  };

  const togglePlay = () => setPlaying((v) => !v);
  const toggleMute = () => { setMuted((v) => !v); resetTimer(); };
  const handleSeek = (ratio) => { playerRef.current?.seekTo(ratio); setPlayed(ratio); resetTimer(); };

  // 마우스 이동 시 컨트롤 표시 + 타이머 리셋 (재생 중에만)
  const handleMouseMove = () => { if (playing) resetTimer(); };

  // 래퍼 클릭: 재생/일시정지 토글 (컨트롤 보이는 상태에서만)
  const handleWrapperClick = () => {
    if (playing && ctrlVisible) togglePlay();
  };

  return (
    <div
      ref={containerRef}
      className={twMerge("relative w-full overflow-hidden bg-black select-none aspect-video", className)}
      onMouseMove={handleMouseMove}
      onClick={handleWrapperClick}
    >
      {/* 포스터 */}
      {poster && (
        <img
          src={poster}
          alt={title ?? ""}
          className="absolute inset-0 w-full h-full object-cover opacity-80"
          loading="eager"
        />
      )}

      {/* 유튜브 플레이어 */}
      {youtubeKey && (
        <div className={twMerge("absolute inset-0", !playing && "invisible")}>
          <ReactPlayer
            ref={playerRef}
            url={`https://www.youtube.com/watch?v=${youtubeKey}`}
            width="100%"
            height="100%"
            playing={playing}
            muted={muted}
            onProgress={({ played: p }) => setPlayed(p)}
            onDuration={(d) => setDuration(d)}
          />
        </div>
      )}

      {/* 그라디언트 오버레이 */}
      <div className="absolute inset-0 pointer-events-none overlay-player" />

      {/* 컨트롤 레이어 — opacity 트랜지션으로 페이드 인/아웃 */}
      <div
        className={twMerge(
          "absolute inset-0 flex flex-col transition-opacity duration-300",
          ctrlVisible ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── 상단: 뒤로가기 + 제목 + 기기/잠금 ── */}
        <div className="flex items-start justify-between px-5 pt-5 md:px-7 md:pt-6">
          <div className="flex items-center gap-3">
            <TopBtn faIcon={faAngleLeft} onClick={onBack} />
            <div className="flex flex-col gap-0.5 min-w-0">
              {title && (
                <p className="text-white font-extrabold text-sm md:text-base font-sans leading-5 truncate">{title}</p>
              )}
              {subtitle && (
                <p className="text-white/70 text-xs font-sans truncate">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TopBtn faIcon={faTv} />
            {hasStarted.current && <TopBtn faIcon={faUnlock} />}
          </div>
        </div>

        {/* ── 중앙 ── */}
        <div className="flex-1 flex items-center justify-center">
          {!hasStarted.current ? (
            /* 프리뷰: 큰 플레이 버튼 + 안내 텍스트 */
            <BigPlayBtn onClick={() => {
              hasStarted.current = true;
              togglePlay();
              requestFullscreen();
            }} />
          ) : (
            /* 재생 중 / 일시정지: Prev(66) + Play·Pause(87 yellow) + Next(66) */
            <div className="flex items-center gap-6">
              <button
                onClick={(e) => { e.stopPropagation(); resetTimer(); }}
                className="size-[66px] flex items-center justify-center rounded-full bg-white/12 hover:bg-white/20 transition-colors"
                aria-label="이전"
              >
                <FontAwesomeIcon icon={faBackwardStep} className="text-white text-[22px]" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); togglePlay(); resetTimer(); }}
                className="size-[87px] bg-primary-500 rounded-full flex items-center justify-center shadow-play-glow hover:scale-105 transition-transform"
                aria-label={playing ? "일시정지" : "재생"}
              >
                <FontAwesomeIcon icon={playing ? faPause : faPlay} className="text-black text-[28px] translate-x-0.5" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); resetTimer(); }}
                className="size-[66px] flex items-center justify-center rounded-full bg-white/12 hover:bg-white/20 transition-colors"
                aria-label="다음"
              >
                <FontAwesomeIcon icon={faForwardStep} className="text-white text-[22px]" />
              </button>
            </div>
          )}
        </div>

        {/* ── 하단 ── */}
        {!hasStarted.current ? (
          /* 프리뷰: 볼륨(우하단) + 프리뷰바(최하단) */
          <>
            <div className="flex justify-end px-5 pb-3 md:px-7">
              <VolumeBtn muted={muted} onClick={toggleMute} />
            </div>
            <div onClick={(e) => e.stopPropagation()}>
              <PreviewBar played={played} onSeek={handleSeek} />
            </div>
          </>
        ) : (
          /* 재생 중 / 일시정지: 건너뛰기 + 진행바 + 하단 컨트롤 */
          <div className="flex flex-col gap-2 px-5 pb-4 md:px-7 md:pb-5">
            {/* 건너뛰기 / 다음화 */}
            <div className="flex justify-between h-[27px]">
              {played * duration < INTRO_END_SEC && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSeek(INTRO_END_SEC / duration);
                    resetTimer();
                  }}
                  className="h-[27px] px-3 rounded-xl bg-gray-950/60 hover:bg-gray-950/30 transition-colors"
                >
                  <span className="text-white font-extrabold text-sm font-sans whitespace-nowrap">건너뛰기</span>
                </button>
              )}
              <span className="flex-1" />
              {duration > 0 && duration - played * duration < OUTRO_START_SEC && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    resetTimer();
                  }}
                  className="h-[27px] px-3 rounded-xl bg-gray-950/60 hover:bg-gray-950/30 transition-colors"
                >
                  <span className="text-white font-extrabold text-sm font-sans whitespace-nowrap">다음화 &gt;</span>
                </button>
              )}
            </div>
            {/* 진행바 */}
            <div onClick={(e) => e.stopPropagation()}>
              <ProgressBar played={played} duration={duration} onSeek={handleSeek} />
            </div>
            {/* 하단 컨트롤 버튼 */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <SmBtn faIcon={faBackwardStep} onClick={(e) => { e.stopPropagation(); resetTimer(); }} aria-label="이전" />
                <button
                  onClick={(e) => { e.stopPropagation(); togglePlay(); resetTimer(); }}
                  className="size-[50px] bg-primary-500 rounded-full flex items-center justify-center shadow-play-glow-sm hover:scale-105 transition-transform"
                  aria-label={playing ? "일시정지" : "재생"}
                >
                  <FontAwesomeIcon icon={playing ? faPause : faPlay} className="text-black text-base translate-x-0.5" />
                </button>
                <SmBtn faIcon={faForwardStep} onClick={(e) => { e.stopPropagation(); resetTimer(); }} aria-label="다음" />
                <VolumeBtn muted={muted} onClick={(e) => { e.stopPropagation(); toggleMute(); }} />
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); resetTimer(); }}
                  className="size-[38px] flex items-center justify-center rounded-full bg-primary-500 hover:bg-primary-400 transition-colors shrink-0"
                  aria-label="자막"
                >
                  <FontAwesomeIcon icon={faClosedCaptioning} className="text-white text-sm" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); resetTimer(); }}
                  className="size-[38px] flex items-center justify-center rounded-full bg-gray-600 hover:bg-gray-500 transition-colors shrink-0"
                  aria-label="설정"
                >
                  <FontAwesomeIcon icon={faGear} className="text-white text-sm" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleFullscreen(); resetTimer(); }}
                  className="size-[38px] flex items-center justify-center rounded-full bg-white/12 hover:bg-white/20 transition-colors shrink-0"
                  aria-label={isFullscreen ? "화면 축소" : "전체화면"}
                >
                  <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} className="text-white text-sm" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
