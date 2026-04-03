import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
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
import {
  fetchTrending,
  fetchKidsMovies,
  fetchLatestKidsMovies,
  fetchJuniorMovies,
  fetchJuniorDrama,
  fetchLatestJuniorMovies,
  fetchEnglishKidsContent,
  getImageUrl,
} from "../api/api";

const CHARACTERS = [
  { id: 1, name: "뽀로로",   poster_path: "/nJG4ieTjuZZWHBeh4wqsKv5JGJM.jpg" },
  { id: 2, name: "티니핑",   poster_path: "/rY8QGWz7xdsBx6Em1WnpqQZ2oIU.jpg" },
  { id: 3, name: "스폰지밥", poster_path: "/m37FIo3qXvtNWqqqmveWWd1lJlH.jpg" },
  { id: 4, name: "포켓몬",   poster_path: "/vaXQOBNdQVtxUMN96cR4qQRxmoQ.jpg" },
  { id: 5, name: "핑구",     poster_path: "/mc1gBxnqdXCvwQSfNYrBzes5trp.jpg" },
];

export default function MainPage({ mode = "kids" }) {
  const isKids = mode === "kids";
  const [trending, setTrending] = useState([]);
  const [movies, setMovies] = useState([]);
  const [drama, setDrama] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [englishContent, setEnglishContent] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setError(false);
    const safe = (promise, setter) =>
      promise.then(setter).catch(() => setError(true));

    safe(fetchTrending(), setTrending);
    safe((isKids ? fetchKidsMovies : fetchJuniorMovies)(), setMovies);
    safe((isKids ? fetchLatestKidsMovies : fetchLatestJuniorMovies)(), setLatestMovies);
    safe(fetchEnglishKidsContent(), setEnglishContent);
    if (!isKids) safe(fetchJuniorDrama(), setDrama);
  }, [isKids]);

  const openDetail = (item) => {
    const type = item.media_type === "tv" || item.first_air_date ? "tv" : "movie";
    navigate(`/movie/${item.id}${type === "tv" ? "?type=tv" : ""}`);
  };

  const openDetailById = (id) => navigate(`/movie/${id}`);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center">
      <Nav activeTab="main" />

      <HeroBanner
        image={getImageUrl(trending[0]?.backdrop_path || trending[0]?.poster_path, "original")}
        title="슈퍼 히어로 특공대!"
        desc="슈퍼히어로가 꿈인 승아는 친구들을 모아 특공대를 만든다!"
        subDesc="승아와 친구들의 좌충우돌 도전기"
        onPlay={() => trending[0] && openDetailById(trending[0].id)}
        onDetail={() => trending[0] && openDetailById(trending[0].id)}
      />

      <main className="w-full max-w-container flex flex-col gap-6 md:gap-10">
        <AgeTabGroup activeMode={mode} />

        {error && (
          <div className="mx-4 md:mx-10 bg-secondary-100 border border-secondary-500 rounded-2xl px-6 py-4 text-secondary-500 font-bold text-sm text-center">
            콘텐츠를 불러오는 중 오류가 발생했어요. 잠시 후 다시 시도해주세요.
          </div>
        )}

        <div className="flex flex-col gap-8 md:gap-10 pb-20">
          <ContentRow
            title="글로벌 루키즈! 영어로 배워요"
            items={englishContent}
            layout="grid"
            badge="eng"
            filter={(item) => item.original_language === "en"}
            onItemClick={isKids ? openDetail : (item) => navigate(`/movie/${item.id}?type=tv`)}
            className="px-4 md:px-10"
          />

          <ContentRow title="루의 추천" className="px-4 md:px-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 lg:grid-rows-2 gap-4 md:gap-10">
              {movies.slice(0, 5).map((item, i) => (
                <div key={item.id} className={i === 0 ? "col-span-2 lg:row-span-2" : ""}>
                  <Card
                    size={i === 0 ? "lg" : "sm"}
                    title={item.title || item.name}
                    image={getImageUrl(item.poster_path)}
                    className={i === 0 ? "aspect-[16/9] lg:aspect-auto lg:h-full" : "aspect-square"}
                    onClick={() => openDetailById(item.id)}
                  >
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
              <div className="flex gap-4 md:gap-10 overflow-x-auto pb-4 scrollbar-hide">
                {CHARACTERS.map((char) => (
                  <CharacterCard key={char.id} name={char.name} image={getImageUrl(char.poster_path)} />
                ))}
              </div>
            </ContentRow>
          )}

          <ContentRow
            title="인기 콘텐츠"
            items={movies}
            layout="grid"
            badge="rating"
            onItemClick={(item) => openDetailById(item.id)}
            className="px-4 md:px-10"
          />

          {!isKids && (
            <ContentRow
              title="주니어 드라마"
              items={drama}
              layout="grid"
              badge="rating"
              onItemClick={(item) => openDetailById(item.id)}
              className="px-4 md:px-10"
            />
          )}

          <ContentRow
            title="최신 콘텐츠"
            items={latestMovies}
            layout="grid"
            onItemClick={(item) => openDetailById(item.id)}
            className="px-4 md:px-10"
          />

          <PremiumBanner />
        </div>
      </main>

      <AiRooSticky />
      <Footer />
    </div>
  );
}
