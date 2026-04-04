import { useState, useRef } from "react";
import ReactPlayer from "react-player";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTv } from "@fortawesome/free-solid-svg-icons";

const ICONS = {
  play:       "https://www.figma.com/api/mcp/asset/7d614a2a-0c5c-4e83-bb65-eed4d14c82d8",
  pause:      "https://www.figma.com/api/mcp/asset/dce73023-00b7-4637-acce-2cf9f40fbc95",
  prev:       "https://www.figma.com/api/mcp/asset/615267d7-382b-4f12-b240-d23830f7112d",
  next:       "https://www.figma.com/api/mcp/asset/eb17cddd-2252-41aa-ae64-d798d06687b1",
  volume:     "https://www.figma.com/api/mcp/asset/c3b0278f-47ed-4bb1-9453-e6ac50c641cc",
  muted:      "https://www.figma.com/api/mcp/asset/e80dcec2-c77e-4c10-aa1f-55a518c93052",
  caption:    "https://www.figma.com/api/mcp/asset/a373593c-4c95-4116-a246-5fd199fbe855",
  fullscreen: "https://www.figma.com/api/mcp/asset/b0b4a2b6-37ac-4370-9fd1-cad4ce4997b4",
  back:       "https://www.figma.com/api/mcp/asset/e832e8b4-1b35-45bc-8a96-621e43ea64de",
};

/**
 * 컨트롤 버튼 — icon(이미지 URL) 또는 faIcon(FA 아이콘) 중 하나를 전달
 * 모든 버튼 size-[33px] 통일, 호버 시 더 투명하게
 */
function CtrlBtn({ icon, faIcon, onClick, className, ...props }) {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        "size-[33px] flex items-center justify-center rounded-full bg-gray-950/60 hover:bg-gray-950/30 transition-colors shrink-0",
        className
      )}
      {...props}
    >
      {faIcon
        ? <FontAwesomeIcon icon={faIcon} className="text-white text-[15px]" />
        : <img src={icon} alt="" className="size-[15px] object-contain" />
      }
    </button>
  );
}

function PlayPauseBtn({ playing, onClick }) {
  return (
    <button
      onClick={onClick}
      aria-label={playing ? "일시정지" : "재생"}
      className="shrink-0 hover:scale-110 transition-transform drop-shadow-lg"
    >
      <img
        src={playing ? ICONS.pause : ICONS.play}
        alt={playing ? "일시정지" : "재생"}
        className="size-12.5 md:size-15 object-contain"
      />
    </button>
  );
}

function SkipBtn({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="h-[27px] px-[13px] rounded-xl flex items-center justify-center bg-gray-950/60 hover:bg-gray-950/30 transition-colors"
    >
      <span className="text-white font-extrabold text-sm font-sans leading-5 whitespace-nowrap">
        건너뛰기
      </span>
    </button>
  );
}

function ProgressBar({ played, duration, onSeek }) {
  const formatTime = (sec) => {
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
      <div
        className="w-full h-1 bg-white/20 rounded-full cursor-pointer"
        onClick={handleClick}
      >
        <div
          className="h-1 bg-primary-500 rounded-full"
          style={{ width: `${(played ?? 0) * 100}%` }}
        />
      </div>
      <div className="flex justify-between">
        <span className="text-xs text-white/60 font-semibold font-sans">
          {formatTime((played ?? 0) * (duration ?? 0))}
        </span>
        <span className="text-xs text-white/40 font-semibold font-sans">
          {formatTime(duration ?? 0)}
        </span>
      </div>
    </div>
  );
}

export function VideoPlayer({ youtubeKey, poster, title, subtitle, onBack, className }) {
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showCtrl, setShowCtrl] = useState(true);
  const playerRef = useRef(null);

  const togglePlay = () => setPlaying((v) => !v);
  const toggleMute = () => setMuted((v) => !v);
  const handleSeek = (ratio) => {
    playerRef.current?.seekTo(ratio);
    setPlayed(ratio);
  };

  const handleWrapperClick = () => {
    if (playing) setShowCtrl((v) => !v);
  };

  const ctrlVisible = showCtrl || !playing;

  return (
    <div
      className={twMerge("relative w-full overflow-hidden bg-black select-none aspect-video", className)}
      onClick={handleWrapperClick}
    >
      {poster && (
        <img
          src={poster}
          alt={title ?? ""}
          className="absolute inset-0 w-full h-full object-cover opacity-85"
          loading="eager"
        />
      )}

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

      <div className="absolute inset-0 pointer-events-none overlay-player" />

      {ctrlVisible && (
        <div
          className="absolute inset-0 flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* 상단: 뒤로가기 + 제목 + 우측 버튼 */}
          <div className="flex items-start justify-between px-5 pt-5 md:px-7 md:pt-6">
            <div className="flex items-center gap-3">
              <CtrlBtn icon={ICONS.back} onClick={onBack} aria-label="뒤로가기" />
              <div className="flex flex-col gap-0.5 min-w-0">
                {title && (
                  <p className="text-white font-extrabold text-sm md:text-base font-sans leading-5 truncate">
                    {title}
                  </p>
                )}
                {subtitle && (
                  <p className="text-white/70 text-xs font-sans truncate">{subtitle}</p>
                )}
              </div>
            </div>

            {/* 우: 재생 전 — 기기변경 / 재생 중 — 볼륨 + 풀스크린 */}
            <div className="flex items-center gap-2 shrink-0">
              {playing ? (
                <>
                  <CtrlBtn icon={muted ? ICONS.muted : ICONS.volume} onClick={toggleMute} aria-label={muted ? "음소거 해제" : "음소거"} />
                  <CtrlBtn icon={ICONS.fullscreen} aria-label="전체화면" />
                </>
              ) : (
                <CtrlBtn faIcon={faTv} aria-label="기기 변경" />
              )}
            </div>
          </div>

          {/* 중앙: 재생 전 — 큰 재생 버튼 / 재생 중 — Prev + Play/Pause + Next */}
          <div className="flex-1 flex flex-col items-center justify-center gap-3">
            {playing ? (
              <div className="flex items-center gap-6 md:gap-10">
                <CtrlBtn icon={ICONS.prev} aria-label="이전" />
                <PlayPauseBtn playing={playing} onClick={togglePlay} />
                <CtrlBtn icon={ICONS.next} aria-label="다음" />
              </div>
            ) : (
              <>
                <PlayPauseBtn playing={playing} onClick={togglePlay} />
                <p className="text-white font-semibold text-sm md:text-base font-sans mt-2">
                  ▶ 재생 버튼을 눌러 시작하세요
                </p>
              </>
            )}
          </div>

          {/* 하단: 재생 전 — 진행바 + 볼륨(우하단) / 재생 중 — 건너뛰기 + 자막 + 진행바 */}
          <div className="flex flex-col gap-3 px-5 pb-5 md:px-7 md:pb-6">
            {playing ? (
              <>
                <div className="flex items-center justify-between">
                  <SkipBtn />
                  <CtrlBtn
                    icon={ICONS.caption}
                    aria-label="자막"
                    className="bg-primary-500 hover:bg-primary-400"
                  />
                </div>
                <ProgressBar played={played} duration={duration} onSeek={handleSeek} />
              </>
            ) : (
              <>
                <ProgressBar played={played} duration={duration} onSeek={handleSeek} />
                <div className="flex justify-end">
                  <CtrlBtn icon={muted ? ICONS.muted : ICONS.volume} onClick={toggleMute} aria-label={muted ? "음소거 해제" : "음소거"} />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
