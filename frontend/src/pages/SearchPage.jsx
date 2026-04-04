import { useState, useEffect } from 'react';
import { useLocation } from 'react-router';
import { searchMovies, fetchSimilarMovies, getImageUrl } from '../api/api';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { Searchbar } from '../components/Searchbar';
import { ContentRow } from '../components/ContentRow';
import { Card } from '../components/Card';

const GENRE_DRAMA = 18;
const GENRE_ROMANCE = 10749;
const GENRE_HORROR = 27;
const GENRE_CRIME = 80;
const GENRE_THRILLER = 53;
const GENRE_MYSTERY = 9648;
const FORBIDDEN_GENRES = [GENRE_DRAMA, GENRE_ROMANCE, GENRE_HORROR, GENRE_CRIME, GENRE_THRILLER, GENRE_MYSTERY];

function filterByAge(movies, mode) {
  return movies.filter((movie) => {
    const hasForbidden = movie.genre_ids.some((id) => FORBIDDEN_GENRES.includes(id));
    if (hasForbidden) return false;
    if (mode === "kids") {
      return movie.genre_ids.includes(16) && movie.genre_ids.includes(10751);
    }
    return true;
  });
}

export default function SearchPage() {
  const [results, setResults] = useState([]);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const location = useLocation();

  const isJuniorPath = location.pathname.includes('junior');
  const currentMode = isJuniorPath ? 'junior' : 'kids';

  useEffect(() => {
    setResults([]);
    setQuery('');
    setSelectedMovie(null);
  }, [location.pathname]);

  const handleSearch = async (searchTerm) => {
    if (!searchTerm?.trim()) return;
    setIsLoading(true);
    setQuery(searchTerm);
    setSelectedMovie(null);

    try {
      const movies = await searchMovies(searchTerm);
      setResults(filterByAge(movies, currentMode));
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardClick = async (movie) => {
    setSelectedMovie(movie);
    setIsLoading(true);
    
    try {
      const similarMovies = await fetchSimilarMovies(movie.id);
      setResults(filterByAge(similarMovies, currentMode));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Nav activeTab="main" />

      <main className="flex-1 w-full max-w-container mx-auto px-4 md:px-6 py-8 md:py-16 lg:py-20 flex flex-col gap-8 md:gap-16">
        <div className="flex flex-col gap-4 md:gap-6 items-center text-center">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-black text-gray-800">
            무엇을 찾고 있나요?
          </h1>
          <Searchbar className="w-full max-w-searchbar" onSearch={handleSearch} />
        </div>

        {selectedMovie && (
          <div className="bg-gray-50 rounded-4xl p-5 md:p-8 lg:p-12 flex flex-col md:flex-row gap-5 md:gap-8 items-center border border-gray-100">
            <img
              src={getImageUrl(selectedMovie.poster_path)}
              className="w-36 md:w-48 lg:w-64 rounded-card-xl shadow-xl shrink-0"
              alt={selectedMovie.title}
            />
            <div className="flex flex-col gap-4">
              <div className="flex gap-2">
                <span className={`px-4 py-1 rounded-full font-bold text-sm border ${
                  currentMode === 'junior' 
                  ? 'bg-blue-50 border-blue-200 text-blue-600' 
                  : 'bg-primary-50 border-primary-200 text-primary-600'
                }`}>
                  {currentMode === 'junior' ? '🎒 주니어 8~12세 안심 시청' : '🐥 키즈 4~7세 안심 시청'}
                </span>
              </div>

              <h2 className="text-xl md:text-3xl lg:text-5xl font-black">{selectedMovie.title}</h2>
              <p className="text-gray-600 text-sm md:text-base lg:text-lg leading-6 md:leading-8 max-w-2xl">
                {selectedMovie.overview || "상세 정보가 준비되지 않았습니다."}
              </p>
              
              <button 
                onClick={() => { setSelectedMovie(null); handleSearch(query); }} 
                className="w-fit px-8 py-3 bg-white border border-gray-200 rounded-full font-bold text-gray-500 hover:text-primary-600 cursor-pointer shadow-sm"
              >
                검색 결과로 돌아가기 ✕
              </button>
            </div>
          </div>
        )}

        <ContentRow title={selectedMovie ? "추천 연관 영상" : (query ? `'${query}' 검색 결과` : "인기 영상")}>
          {isLoading ? (
            <div className="w-full py-20 text-center font-bold text-gray-400 text-2xl">검색 중...</div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-10">
              {results.length > 0 ? (
                results.map(movie => (
                  <Card 
                    key={movie.id}
                    title={movie.title}
                    image={getImageUrl(movie.poster_path)}
                    onClick={() => handleCardClick(movie)}
                    className="cursor-pointer aspect-[3/4] rounded-4xl"
                  />
                ))
              ) : (
                query && <div className="col-span-full py-20 text-center text-gray-400 font-bold text-2xl">
                  연령대에 맞는 관련 영상이 없습니다
                </div>
              )}
            </div>
          )}
        </ContentRow>
      </main>

      <Footer />
    </div>
  );
}