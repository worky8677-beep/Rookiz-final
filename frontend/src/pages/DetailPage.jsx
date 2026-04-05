import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router";
import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faShareNodes,
  faDownload,
  faLeaf,
  faStar,
  faChevronRight,
  faPlay,
  faBolt,
  faThumbsUp,
  faGlobe,
} from "@fortawesome/free-solid-svg-icons";
import { fetchContentDetail, fetchContentVideos, fetchSimilarContent, fetchSeasonEpisodes, getImageUrl } from "../api/api";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { Card } from "../components/Card";
import { VideoPlayer } from "../components/VideoPlayer";
import { useMovieModal } from "../context/MovieModalContext";

// ================================================================
// 1. 토큰 기반 원자 컴포넌트
// ================================================================

/**
 * Pill — Chip·Tag·StatusBadge가 공유하는 base
 * 모두 rounded-full + px-3 py-1.5 구조
 */
function Pill({ children, className }) {
  return (
    <span className={twMerge("inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold", className)}>
      {children}
    </span>
  );
}

/** Chip — 카테고리/등급 식별자 (아이콘 + 라벨) */
const CHIP_VARIANTS = {
  kids:      { bg: "bg-green-200 text-green-700",         icon: faLeaf,     label: "키즈 4~7세" },
  junior:    { bg: "bg-blue-200 text-blue-700",           icon: faBolt,     label: "주니어 8~12세" },
  new:       { bg: "bg-primary-400 text-primary-700",     icon: faStar,     label: "신규" },
  popular:   { bg: "bg-secondary-400 text-secondary-900", icon: faThumbsUp, label: "인기" },
  recommend: { bg: "bg-blue-400 text-blue-950",           icon: faHeart,    label: "추천" },
  english:   { bg: "bg-green-400 text-green-900",           icon: faGlobe,    label: "ENG" },
};
function Chip({ variant }) {
  const v = CHIP_VARIANTS[variant];
  if (!v) return null;
  return (
    <Pill className={twMerge("text-sm font-bold", v.bg)}>
      <FontAwesomeIcon icon={v.icon} className="size-5" />
      {v.label}
    </Pill>
  );
}

/** RatingStars — 별 5개 + 숫자 점수 (TMDB 10점 → 5점 변환) */
function RatingStars({ score }) {
  if (!score) return null;
  const out5 = score / 2;
  const filled = Math.round(out5);
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }, (_, i) => (
        <FontAwesomeIcon
          key={i}
          icon={faStar}
          className={twMerge("text-xs", i < filled ? "text-primary-500" : "text-gray-50 opacity-50")}
        />
      ))}
      <span className="text-sm font-bold text-primary-500 leading-2">{out5.toFixed(1)}</span>
    </div>
  );
}

/** Tag — 장르 해시태그 (라벨만) */
function Tag({ label }) {
  return <Pill className="bg-gray-100 text-gray-500 font-medium">{label}</Pill>;
}

/** StatusBadge — 에피소드 시청 상태 */
function StatusBadge({ progress }) {
  if (progress === 100)
    return <Pill className="bg-transparent text-green-600 px-0 py-0 font-semibold">✓ 시청 완료</Pill>;
  if (progress > 0)
    return <Pill className="bg-transparent text-primary-500 px-0 py-0 font-semibold">{progress}% 시청</Pill>;
  return null;
}

// ================================================================
// 2. 복합 원자 컴포넌트
// ================================================================

/**
 * ActionBtn — 아이콘 박스(44px) + 라벨 세로 배치
 * 좋아요/공유/다운로드 모두 동일한 구조
 */
function ActionBtn({ icon, label, onClick, active = false }) {
  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 group">
      <span className={twMerge(
        "size-11 rounded-2xl flex items-center justify-center transition-colors",
        active
          ? "bg-secondary-100 border-[1.5px] border-secondary-500 text-secondary-500"
          : "bg-gray-100 group-hover:bg-gray-200 text-gray-500"
      )}>
        <FontAwesomeIcon icon={icon} className="text-base" />
      </span>
      <span className={twMerge(
        "text-[10px] font-semibold",
        active ? "text-secondary-300" : "text-gray-400"
      )}>{label}</span>
    </button>
  );
}

/**
 * EpisodeThumbnail — 썸네일 + 진행 상태 오버레이
 * 완료 / 재생 중(active) / 진행 중(progress bar) / 기본 3+1가지 상태
 */
function EpisodeThumbnail({ stillPath, progress, active }) {
  const isCompleted  = progress === 100;
  const isInProgress = progress > 0 && progress < 100;

  return (
    <div className="relative w-20 h-14 rounded-2xl overflow-hidden shrink-0 bg-gray-200">
      {stillPath && (
        <img src={getImageUrl(stillPath, "w200")} alt="" className="w-full h-full object-cover" />
      )}

      {/* 완료: 반투명 오버레이 + 재생 아이콘 */}
      {isCompleted && (
        <div className="absolute inset-0 bg-black/45 flex items-center justify-center">
          <div className="size-[18px] rounded-full bg-white/20 border border-white/30 flex items-center justify-center">
            <FontAwesomeIcon icon={faPlay} className="text-white text-[8px] translate-x-px" />
          </div>
        </div>
      )}

      {/* 현재 재생 중: 밝은 오버레이 + 큰 재생 아이콘 */}
      {active && !isCompleted && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
          <FontAwesomeIcon icon={faPlay} className="text-white text-base" />
        </div>
      )}

      {/* 진행 중: 하단 progress bar */}
      {isInProgress && (
        <div className="absolute bottom-0 left-0 w-full h-0.5 bg-black/30">
          <div className="h-full bg-primary-500" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

/**
 * EpisodeCard — EpisodeThumbnail + StatusBadge 컴포지션
 * active(노란 테두리/배경) / default(회색) 두 가지 상태
 */
function EpisodeCard({ episode, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={twMerge(
        "group flex items-center w-full h-[93px] px-3.5 rounded-2xl border-[1.5px] cursor-pointer transition-all",
        active ? "bg-primary-100 border-primary-500" : "bg-gray-50 border-gray-100 hover:border-gray-200"
      )}
    >
      <EpisodeThumbnail
        stillPath={episode.still_path}
        progress={episode.progress}
        active={active}
      />

      <div className="flex flex-col flex-1 px-4 min-w-0 text-left gap-0.5">
        {/* 화수 + 상태 뱃지 */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-extrabold text-primary-500">{episode.episode_number}화</span>
          <StatusBadge progress={episode.progress} />
        </div>
        {/* 제목 */}
        <p className="text-sm font-bold text-gray-950 truncate">
          {episode.episode_number}화 - {episode.name}
        </p>
        {/* 런타임 */}
        <span className="text-xs text-gray-200 font-medium">{episode.runtime}분</span>
      </div>

      <FontAwesomeIcon icon={faChevronRight} className="text-gray-200 group-hover:text-gray-400 transition-colors shrink-0" />
    </div>
  );
}

/**
 * SeasonBtn — 시즌 선택 버튼
 * active: primary-500 배경 / default: white + gray 테두리
 */
function SeasonBtn({ n, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        "px-4 py-2 rounded-[14px] text-sm font-bold transition-all",
        active ? "bg-primary-500 text-gray-950" : "bg-white text-gray-600 border border-gray-100"
      )}
    >
      시즌 {n}
    </button>
  );
}

/**
 * TabBtn — 탭 메뉴 버튼
 * active: gray-950 + primary-500 언더라인 / default: gray-300
 */
function TabBtn({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        "px-5 py-3 text-sm font-bold relative transition-colors whitespace-nowrap",
        active ? "text-gray-950" : "text-gray-300"
      )}
    >
      {label}
      {active && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary-500 rounded-full" />}
    </button>
  );
}

/**
 * SectionHeader — 섹션 제목 + 더보기 버튼
 * "이런 콘텐츠도 있어요" / "시즌" 영역 등에서 재사용
 */
function SectionHeader({ title, onViewAll }) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-base font-extrabold text-gray-950">{title}</h2>
      {onViewAll && (
        <button onClick={onViewAll} className="flex items-center gap-1 text-sm font-bold text-gray-600">
          더보기
          <FontAwesomeIcon icon={faChevronRight} className="text-xs" />
        </button>
      )}
    </div>
  );
}

// ================================================================
// 3. 콘텐츠 정보 탭
// ================================================================

function InfoRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex items-start py-2.5 border-b border-gray-100 last:border-b-0">
      <span className="w-28 shrink-0 text-sm font-semibold text-gray-400 leading-2">{label}</span>
      <span className="text-sm font-bold text-gray-950 leading-2">{value}</span>
    </div>
  );
}

function ContentInfoTab({ movie, mediaType }) {
  const isTV = mediaType === "tv";

  const studio = movie.production_companies?.map((c) => c.name).join(", ") || "-";
  const year = isTV
    ? [movie.first_air_date?.slice(0, 4), movie.last_air_date?.slice(0, 4)].filter(Boolean).join(" - ")
    : movie.release_date?.slice(0, 4) || "-";
  const episodes = isTV
    ? `${movie.number_of_episodes ?? "-"}화 (시즌 ${movie.number_of_seasons ?? "-"})`
    : null;
  const runtime = isTV
    ? movie.episode_run_time?.length ? `약 ${movie.episode_run_time[0]}분` : "-"
    : movie.runtime ? `${movie.runtime}분` : "-";
  const langMap = { ko: "한국어", en: "영어", ja: "일본어", zh: "중국어" };
  const lang = langMap[movie.original_language] ?? movie.original_language ?? "-";
  const rating = movie.adult ? "청소년 관람 불가" : "전체 관람가 (4세+)";
  const genres = movie.genres?.map((g) => g.name).join(" · ") || "-";

  return (
    <div className="flex flex-col py-2">
      <InfoRow label="제작사" value={studio} />
      <InfoRow label="방영 연도" value={year} />
      {isTV && <InfoRow label="총 에피소드" value={episodes} />}
      <InfoRow label="러닝타임" value={runtime} />
      <InfoRow label="언어" value={lang} />
      <InfoRow label="연령 등급" value={rating} />
      <InfoRow label="장르" value={genres} />
    </div>
  );
}

// ================================================================
// 4. 데이터 상수
// ================================================================

const DEFAULT_SEASON = 1;

// ================================================================
// 4. 페이지 컴포넌트
// ================================================================

export default function DetailPage({ movieId: propMovieId, mediaType: propMediaType, onClose }) {
  const { movieId: paramId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { openMovie, mediaType: ctxMediaType, ageGroup, section } = useMovieModal();
  const movieId = propMovieId ?? paramId;
  const mediaType = propMediaType ?? searchParams.get("type") ?? ctxMediaType ?? "movie";

  const [movie,    setMovie]    = useState(null);
  const [videos,   setVideos]   = useState([]);
  const [similar,  setSimilar]  = useState([]);
  const [loading,  setLoading]  = useState(true);

  const [activeTab,       setActiveTab]       = useState(mediaType === "tv" ? "episodes" : "info");
  const [selectedSeason,  setSelectedSeason]  = useState(DEFAULT_SEASON);
  const [liked,           setLiked]           = useState(false);
  const [showAllSeasons,  setShowAllSeasons]  = useState(false);
  const [episodes,        setEpisodes]        = useState([]);
  const [epLoading,       setEpLoading]       = useState(false);

  useEffect(() => {
    if (!movieId) return;
    let stale = false;
    const load = async () => {
      setLoading(true);
      try {
        const [m, v, s] = await Promise.all([
          fetchContentDetail(movieId, mediaType),
          fetchContentVideos(movieId, mediaType),
          fetchSimilarContent(movieId, mediaType),
        ]);
        if (stale) return;
        setMovie(m);
        setVideos(v ?? []);
        setSimilar(s ?? []);
      } catch (err) {
        if (!stale) console.error(err);
      } finally {
        if (!stale) {
          setLoading(false);
          if (!onClose) window.scrollTo(0, 0);
        }
      }
    };
    load();
    return () => { stale = true; };
  }, [movieId, mediaType]);

  // TV일 때 시즌 변경 시 에피소드 로드
  useEffect(() => {
    if (!movieId || mediaType !== "tv") return;
    let stale = false;
    setEpLoading(true);
    fetchSeasonEpisodes(movieId, selectedSeason).then((eps) => {
      if (!stale) { setEpisodes(eps); setEpLoading(false); }
    });
    return () => { stale = true; };
  }, [movieId, mediaType, selectedSeason]);

  const handleSimilarClick = (m) => {
    const type = m.first_air_date ? "tv" : "movie";
    if (onClose) openMovie(m.id, type, ageGroup, section);
    else navigate(`/movie/${m.id}?type=${type}`);
  };

  // 연령 필터 상수
  const FORBIDDEN_G = [18, 10749, 27, 80, 53, 9648, 10752, 36];
  const KIDS_G      = [16, 10751, 10762];
  const filteredSimilar = similar.filter((m) => {
    const genres = m.genre_ids ?? m.genres?.map((g) => g.id) ?? [];
    if (genres.some((id) => FORBIDDEN_G.includes(id))) return false;
    if (ageGroup === "kids") return genres.some((id) => KIDS_G.includes(id));
    return true;
  });

  // ── 로딩 ────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className={twMerge(
        "flex flex-col items-center justify-center gap-4",
        onClose ? "h-64" : "min-h-screen bg-white"
      )}>
        <div className={twMerge(
          "bg-primary-300 rounded-full flex items-center justify-center animate-bounce overflow-hidden border-4 border-white",
          onClose ? "size-16" : "size-28 md:size-48"
        )}>
          <img src="/Airoo-circle.png" className="w-full h-full object-cover" alt="루" />
        </div>
        <p className={twMerge(
          "font-black text-primary-600 animate-pulse font-sans",
          onClose ? "text-base" : "text-xl md:text-3xl"
        )}>로딩중...</p>
      </div>
    );
  }

  if (!movie) return null;

  const trailer  = videos.find((v) => v.type === "Trailer" && v.site === "YouTube") || videos[0];
  const poster   = getImageUrl(movie.backdrop_path || movie.poster_path, "original");
  const title    = movie.title || movie.name || "";
  const isTV     = mediaType === "tv";
  const seasons  = movie.number_of_seasons ?? 1;
  const ctaLabel = isTV
    ? (seasons > 1 ? `시즌 1 · 1화부터 보기` : `1화부터 보기`)
    : "재생하기";
  const playerSubtitle = isTV
    ? (seasons > 1 ? `시즌 1 · 1화` : `1화`)
    : null;

  // ── 본문 ────────────────────────────────────────────────────────
  const content = (
    <div className="bg-white">

      {/* ① 비디오 플레이어 */}
      <VideoPlayer
        youtubeKey={trailer?.key}
        poster={poster}
        title={title}
        subtitle={playerSubtitle}
        onBack={onClose ?? (() => navigate(-1))}
        className={onClose ? "rounded-t-3xl" : "max-h-[560px]"}
        autoPlay={!!trailer?.key}
      />

      {/* ② 콘텐츠 정보 */}
      <section className="px-4 md:px-5 pt-4 md:pt-5 pb-3 md:pb-4 flex flex-col gap-3 md:gap-4">

        {/* 칩 + 액션 버튼 */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2.5 flex-1 min-w-0">
            {/* Chip 컴포지션 */}
            <div className="flex flex-wrap gap-2">
              {ageGroup && <Chip variant={ageGroup} />}
              {section && <Chip variant={section} />}
            </div>
            <h1 className="text-xl md:text-2xl font-extrabold text-gray-950 leading-tight">{title}</h1>
            <div className="flex items-center gap-2">
              <RatingStars score={movie.vote_average} />
              <p className="text-sm text-gray-300 font-medium">
                {mediaType === "tv" && movie.number_of_episodes
                  ? `· 총 ${movie.number_of_episodes}화`
                  : movie.runtime
                  ? `· ${movie.runtime}분`
                  : null}
                {movie.genres?.slice(0, 2).length > 0 && ` · ${movie.genres.slice(0, 2).map((g) => g.name).join(" / ")}`}
              </p>
            </div>
            <p className="text-sm text-gray-600 leading-snug font-medium">
              {movie.overview || "꼬마 탐험가 루나와 친구들이 신비로운 우주를 탐험하며 펼치는 신나는 모험! 별자리의 비밀을 풀고, 외계인 친구들과 우정을 나누며 성장하는 이야기를 담았어요."}
            </p>
          </div>

          {/* ActionBtn 컴포지션 */}
          <div className="flex gap-3 shrink-0 pt-1">
            <ActionBtn icon={faHeart} label="좋아요" active={liked} onClick={() => setLiked((v) => !v)} />
            <ActionBtn icon={faShareNodes} label="공유" />
            <ActionBtn icon={faDownload} label="저장" />
          </div>
        </div>

        {/* Tag 컴포지션 — 장르 + 제작 국가 + 사용 언어 (모두 한국어) */}
        {(() => {
          const COUNTRY_KO = { US: "미국", KR: "한국", JP: "일본", GB: "영국", FR: "프랑스", CN: "중국", AU: "호주", CA: "캐나다", DE: "독일", IT: "이탈리아" };
          const LANG_KO    = { ko: "한국어", en: "영어", ja: "일본어", zh: "중국어", fr: "프랑스어", es: "스페인어", de: "독일어" };
          const genreTags    = movie.genres?.map((g) => g.name) ?? [];
          const countryTags  = movie.production_countries?.map((c) => COUNTRY_KO[c.iso_3166_1]).filter(Boolean) ?? [];
          const langTags     = movie.spoken_languages?.map((l) => LANG_KO[l.iso_639_1]).filter(Boolean) ?? [];
          const tags = [...genreTags, ...countryTags, ...langTags];
          if (!tags.length) return null;
          return (
            <div className="flex flex-wrap gap-2">
              {tags.map((label, i) => <Tag key={i} label={`# ${label}`} />)}
            </div>
          );
        })()}

        {/* 이어보기 CTA */}
        <button className="w-full h-14 bg-primary-500 hover:bg-primary-400 text-gray-950 font-extrabold text-base rounded-2xl flex items-center justify-center gap-2.5 transition-colors">
          <FontAwesomeIcon icon={faPlay} />
          <span>{ctaLabel}</span>
        </button>
      </section>

      {/* ③ 시즌 + 탭 + 에피소드 */}
      <section className="px-4 md:px-5 flex flex-col gap-3 md:gap-4 pb-4 md:pb-6">

        {/* SeasonBtn 컴포지션 — TV이고 시즌이 2개 이상일 때만 표시 */}
        {mediaType === "tv" && movie.number_of_seasons > 1 && (() => {
          const MAX = 4;
          const total = movie.number_of_seasons;
          const seasons = Array.from({ length: total }, (_, i) => i + 1);
          const visible = showAllSeasons ? seasons : seasons.slice(0, MAX);
          const hasMore = total > MAX;
          return (
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-bold text-gray-950">시즌</span>
              {visible.map((n) => (
                <SeasonBtn key={n} n={n} active={selectedSeason === n} onClick={() => setSelectedSeason(n)} />
              ))}
              {hasMore && (
                <button
                  onClick={() => setShowAllSeasons((v) => !v)}
                  className="px-4 py-2 rounded-[14px] text-sm font-bold text-gray-400 border border-gray-100 transition-all"
                >
                  {showAllSeasons ? "접기" : `+${total - MAX}더보기`}
                </button>
              )}
            </div>
          );
        })()}

        {/* TabBtn 컴포지션 — TV일 때만 에피소드 탭 표시 */}
        <div className="flex border-b border-gray-100">
          {isTV && (
            <TabBtn label="에피소드" active={activeTab === "episodes"} onClick={() => setActiveTab("episodes")} />
          )}
          <TabBtn label="콘텐츠 정보" active={activeTab === "info"} onClick={() => setActiveTab("info")} />
        </div>

        {/* EpisodeCard 컴포지션 */}
        {activeTab === "episodes" && (
          epLoading
            ? <p className="text-sm text-gray-400 text-center py-6 font-medium">에피소드 불러오는 중...</p>
            : episodes.length === 0
              ? <p className="text-sm text-gray-400 text-center py-6 font-medium">에피소드 정보가 없어요.</p>
              : <div className="flex flex-col gap-3">
                  {episodes.map((ep) => (
                    <EpisodeCard
                      key={ep.id}
                      episode={ep}
                      active={false}
                      onClick={() => {}}
                    />
                  ))}
                </div>
        )}

        {activeTab === "info" && (
          <ContentInfoTab movie={movie} mediaType={mediaType} />
        )}
      </section>

      {/* ④ 추천 콘텐츠 */}
      {filteredSimilar.length > 0 && (
        <section className="px-4 md:px-5 pb-6 md:pb-8 flex flex-col gap-3 md:gap-4">
          {/* SectionHeader 컴포지션 */}
          <SectionHeader title="이런 콘텐츠도 있어요" onViewAll={() => {}} />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {filteredSimilar.slice(0, 4).map((m) => (
              <div key={m.id} className="cursor-pointer" onClick={() => handleSimilarClick(m)}>
                <Card
                  title={m.title || m.name}
                  image={getImageUrl(m.poster_path, "w300")}
                  size="sm"
                  className="aspect-3/4 rounded-3.5xl"
                />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );

  if (onClose) return content;

  return (
    <div className="min-h-screen bg-white">
      <Nav activeTab="main" />
      <main className="pb-16 max-w-3xl mx-auto">{content}</main>
      <Footer />
    </div>
  );
}
