import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useMovieModal } from "../context/MovieModalContext";
import { Nav } from "../components/Nav";
import { Footer } from "../components/Footer";
import { AgeTabGroup } from "../components/AgeTabGroup";
import { ContentRow } from "../components/ContentRow";
import { Card } from "../components/Card";
import { CharacterCard } from "../components/CharacterCard";
import { AiRooSticky } from "../components/AiRooSticky";
import { PremiumBanner } from "../components/PremiumBanner";
import { HeroBanner } from "../components/HeroBanner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { fetchTrending, fetchKidsMovies, fetchLatestKidsMovies, fetchJuniorMovies, fetchJuniorDrama, fetchLatestJuniorMovies, fetchEnglishKidsContent, fetchEnglishJuniorContent, getImageUrl } from "../api/api";

const CHARACTERS = [
  { id: 1, name: "뽀로로", poster_path: "/nJG4ieTjuZZWHBeh4wqsKv5JGJM.jpg" },
  { id: 2, name: "티니핑", poster_path: "/rY8QGWz7xdsBx6Em1WnpqQZ2oIU.jpg" },
  { id: 3, name: "스폰지밥", poster_path: "/m37FIo3qXvtNWqqqmveWWd1lJlH.jpg" },
  { id: 4, name: "포켓몬", poster_path: "/vaXQOBNdQVtxUMN96cR4qQRxmoQ.jpg" },
  { id: 5, name: "핑구", poster_path: "/mc1gBxnqdXCvwQSfNYrBzes5trp.jpg" },
];

export default function MainPage({ mode: modeProp = "kids" }) {
  const { pathname } = useLocation();
  const mode = pathname === "/junior" ? "junior" : modeProp;
  const isKids = mode === "kids";
  const [trending, setTrending] = useState([]);
  const [movies, setMovies] = useState([]);
  const [drama, setDrama] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [englishContent, setEnglishContent] = useState([]);
  const [error, setError] = useState(false);
  const { openMovie } = useMovieModal();
  const navigate = useNavigate();

  useEffect(() => {
    let stale = false;
    setError(false);
    const safe = (promise, setter) =>
      promise.then((data) => { if (!stale) setter(data); })
             .catch(() => { if (!stale) setError(true); });

    safe(fetchTrending(), setTrending);
    safe((isKids ? fetchKidsMovies : fetchJuniorMovies)(), setMovies);
    safe((isKids ? fetchLatestKidsMovies : fetchLatestJuniorMovies)(), setLatestMovies);
    safe((isKids ? fetchEnglishKidsContent : fetchEnglishJuniorContent)(), setEnglishContent);
    if (!isKids) safe(fetchJuniorDrama(), setDrama);
    return () => { stale = true; };
  }, [isKids]);

  const open = (id, type = "movie", sec = null) => openMovie(id, type, mode, sec);

  return (
    <div className={`min-h-screen flex flex-col items-center ${isKids ? "bg-green-100/50" : "bg-blue-100/50"}`}>
      <Nav activeTab="main" mode={mode} />

      <HeroBanner 
        items={latestMovies.slice(0, 3)}
        getImageUrl={getImageUrl}
        onPlay={(item) => item && open(item.id, "movie", "new")} 
        onDetail={(item) => item && open(item.id, "movie", "new")} 
      />

      <main className="w-full max-w-container flex flex-col gap-6 md:gap-10">
        <AgeTabGroup activeMode={mode} />

        {error && <div className="mx-4 md:mx-10 bg-secondary-100 border border-secondary-500 rounded-2xl px-6 py-4 text-secondary-500 font-bold text-sm text-center">콘텐츠를 불러오는 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.</div>}

        <div className="flex flex-col gap-8 md:gap-10 pb-20">
          <ContentRow
            title="글로벌 루키즈! 영어로 배워요"
            items={englishContent}
            layout="grid"
            badge="eng"
            filter={(item) => item.original_language === "en"}
            onItemClick={(item) => open(item.id, "tv", "english")}
            viewAllLink={`/category?category=english&mode=${mode}`}
            className="px-4 md:px-10"
          />

          <ContentRow title="루의 추천" viewAllLink={`/category?category=recommend&mode=${mode}`} className="px-4 md:px-10">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:grid-rows-2 gap-4 md:gap-6 lg:gap-10">
              {movies.slice(0, 5).map((item, i) => (
                <div key={item.id} className={i === 0 ? "col-span-2 lg:row-span-2" : ""}>
                  <Card size={i === 0 ? "lg" : "sm"} title={item.title || item.name} image={getImageUrl(item.poster_path)} className={i === 0 ? "aspect-[16/9] lg:aspect-auto lg:h-full" : "aspect-square"} onClick={() => open(item.id, "movie", "recommend")}>
                    <span className="text-xs md:text-sm font-semibold text-primary-500 mt-0.5 md:mt-1">
                      <FontAwesomeIcon icon={faStar} /> {item.vote_average?.toFixed(1)}
                    </span>
                  </Card>
                </div>
              ))}
            </div>
          </ContentRow>

          {isKids && (
            <ContentRow title="인기 있는 캐릭터" showViewAll={false} className="px-4 md:px-10">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-10">
                {CHARACTERS.map((char) => (
                  <CharacterCard key={char.id} name={char.name} image={getImageUrl(char.poster_path)} onClick={() => navigate(`/search?q=${encodeURIComponent(char.name)}&mode=${mode}`)} />
                ))}
              </div>
            </ContentRow>
          )}

          <ContentRow title="인기 콘텐츠" items={movies} layout="grid" badge="rating" onItemClick={(item) => open(item.id, "movie", "popular")} viewAllLink={`/category?category=popular&mode=${mode}`} className="px-4 md:px-10" />

          {!isKids && <ContentRow title="주니어 드라마" items={drama} layout="grid" badge="rating" onItemClick={(item) => open(item.id, "tv", "popular")} viewAllLink={`/category?category=drama&mode=${mode}`} className="px-4 md:px-10" />}

          <ContentRow title="최신 콘텐츠" items={latestMovies} layout="grid" onItemClick={(item) => open(item.id, "movie", "new")} viewAllLink={`/category?category=latest&mode=${mode}`} className="px-4 md:px-10" />

          <PremiumBanner />
        </div>
      </main>

      <AiRooSticky />
      <Footer />
    </div>
  );
}
