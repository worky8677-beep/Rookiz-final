import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { Card } from "../components/Card";
import {
  fetchKidsMoviesByPage,
  fetchJuniorMoviesByPage,
  fetchLatestKidsMoviesByPage,
  fetchLatestJuniorMoviesByPage,
  fetchJuniorDramaByPage,
  fetchEnglishKidsContentByPage,
  fetchEnglishJuniorContentByPage,
  getImageUrl,
} from "../api/api";

const CATEGORY_CONFIG = {
  popular: { title: "인기 콘텐츠", kids: fetchKidsMoviesByPage, junior: fetchJuniorMoviesByPage },
  recommend: { title: "루의 추천", kids: fetchKidsMoviesByPage, junior: fetchJuniorMoviesByPage },
  latest: { title: "최신 콘텐츠", kids: fetchLatestKidsMoviesByPage, junior: fetchLatestJuniorMoviesByPage },
  drama: { title: "주니어 드라마", kids: fetchJuniorDramaByPage, junior: fetchJuniorDramaByPage },
  english: { title: "글로벌 루키즈! 영어로 배워요", kids: fetchEnglishKidsContentByPage, junior: fetchEnglishJuniorContentByPage },
};

gsap.registerPlugin(ScrollTrigger);

const COLS = 4;
const INITIAL_ROWS = 2;
const VIEWPORT_THRESHOLD = 0.1;
const DEBOUNCE_MS = 300;

export default function CategoryPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const mode = searchParams.get("mode") || "kids";
  const category = searchParams.get("category") || "popular";
  const config = CATEGORY_CONFIG[category] || CATEGORY_CONFIG.popular;

  const [movies, setMovies] = useState([]);
  const [visibleRows, setVisibleRows] = useState(INITIAL_ROWS);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const sentinelRef = useRef(null);
  const gridRef = useRef(null);
  const animatedRef = useRef(new Set());
  const debounceRef = useRef(null);
  const stateRef = useRef({ loading, hasMore, movies, visibleRows, page, mode, category });

  // 최신 state를 ref에 동기화 — 디바운스 콜백이 stale closure 참조 방지
  stateRef.current = { loading, hasMore, movies, visibleRows, page, mode, category };

  useEffect(() => {
    const fetchFn = mode === "junior" ? config.junior : config.kids;
    setLoading(true);
    fetchFn(1)
      .then((data) => {
        setMovies(data);
        setPage(1);
        setVisibleRows(INITIAL_ROWS);
        setHasMore(data.length >= 20);
        animatedRef.current.clear();
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [mode, category]);

  // ── 추가 데이터 로드 (ref 기반 디바운스) ──
  const loadMore = () => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const { loading: ld, hasMore: hm, movies: mv, visibleRows: vr, page: pg, mode: md, category: cat } = stateRef.current;
      if (ld || !hm) return;

      const totalNeeded = (vr + 1) * COLS;
      if (mv.length >= totalNeeded) {
        setVisibleRows((r) => r + 1);
        return;
      }

      setLoading(true);
      try {
        const cfg = CATEGORY_CONFIG[cat] || CATEGORY_CONFIG.popular;
        const fetchFn = md === "junior" ? cfg.junior : cfg.kids;
        const nextPage = pg + 1;
        const newData = await fetchFn(nextPage);
        if (newData.length === 0) {
          setHasMore(false);
        } else {
          setMovies((prev) => {
            const ids = new Set(prev.map((m) => m.id));
            return [...prev, ...newData.filter((m) => !ids.has(m.id))];
          });
          setPage(nextPage);
          setVisibleRows((r) => r + 1);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, DEBOUNCE_MS);
  };

  // ── IntersectionObserver (뷰포트 하단 10%) ──
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      { rootMargin: `0px 0px ${Math.round(window.innerHeight * VIEWPORT_THRESHOLD)}px 0px` },
    );

    observer.observe(sentinel);
    return () => {
      observer.disconnect();
      clearTimeout(debounceRef.current);
    };
  }, []);

  // ── GSAP ScrollTrigger 카드 등장 애니메이션 ──
  useEffect(() => {
    if (!gridRef.current) return;

    const triggers = [];
    const cards = gridRef.current.querySelectorAll("[data-card]");
    cards.forEach((card) => {
      const idx = card.dataset.card;
      if (animatedRef.current.has(idx)) return;
      animatedRef.current.add(idx);

      const tween = gsap.fromTo(
        card,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          delay: 0.05,
          scrollTrigger: {
            trigger: card,
            start: "top 100%",
            toggleActions: "play none none none",
          },
        },
      );
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    });

    ScrollTrigger.refresh();

    return () => {
      triggers.forEach((t) => t.kill());
    };
  }, [movies, visibleRows]);

  useEffect(() => {
    return () => {
      clearTimeout(debounceRef.current);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const visibleMovies = movies.slice(0, visibleRows * COLS);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <Nav activeTab="main" />

      <div className="w-full max-w-container flex flex-col gap-9 p-10">
        {/* 타이틀 */}
        <div className="flex items-center justify-between">
          <h1 className="text-4xl font-extrabold text-gray-700 leading-8">
            {config.title}
          </h1>
        </div>

        {/* 카드 그리드 */}
        <div
          ref={gridRef}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10"
        >
          {visibleMovies.map((movie, i) => (
            <div key={movie.id} data-card={i} className="opacity-0">
              <Card
                title={movie.title || movie.name}
                image={getImageUrl(movie.poster_path)}
                className="aspect-[3/4] rounded-3xl shadow-sm"
                onClick={() => navigate(`/movie/${movie.id}${movie.first_air_date ? `?type=tv${category === 'english' ? '&lang=en-US' : ''}` : ''}`)}
              />
            </div>
          ))}
        </div>

        {/* 로딩 표시 */}
        {loading && (
          <div className="w-full py-10 text-center">
            <p className="text-xl font-bold text-gray-400 animate-pulse">
              로딩중...
            </p>
          </div>
        )}

        {/* 무한스크롤 감지 센티널 */}
        <div ref={sentinelRef} className="h-1" />
      </div>

      <Footer />
    </div>
  );
}
