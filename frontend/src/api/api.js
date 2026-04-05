import axios from "axios";

// ── Axios 인스턴스 ────────────────────────────────────────────

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3/",
  params: {
    api_key: import.meta.env.VITE_TMDB_API_KEY,
    language: "ko-KR",
    region: "KR",
  },
});

// ── 이미지 URL ────────────────────────────────────────────────

export const getImageUrl = (path, size = "w500") =>
  path ? `https://image.tmdb.org/t/p/${size}${path}` : "";

// ── 공통 헬퍼 ─────────────────────────────────────────────────

const MIN_RESULTS = 8;

/**
 * API 호출 후 poster_path 필터 + 영어 폴백
 * 한국어 결과가 MIN_RESULTS 미만이면 영어(en-US)로 재요청하여 보충
 */
async function fetchWithFallback(endpoint, params = {}) {
  try {
    const response = await api.get(endpoint, { params });
    let results = response.data.results.filter((item) => item.poster_path);

    if (results.length < MIN_RESULTS) {
      const enResponse = await api.get(endpoint, {
        params: { ...params, language: "en-US" },
      });
      const enResults = enResponse.data.results.filter((item) => item.poster_path);
      const ids = new Set(results.map((r) => r.id));
      results = [...results, ...enResults.filter((item) => !ids.has(item.id))];
    }

    return results;
  } catch (error) {
    console.error(`${endpoint} 로드 실패:`, error);
    return [];
  }
}

const KIDS_PARAMS = {
  with_genres: "16,10751",
  certification_country: "US",
  "certification.lte": "G",
};

const JUNIOR_PARAMS = {
  with_genres: "12,16,10751",
  certification_country: "US",
  "certification.gte": "PG",
  "certification.lte": "PG",
};

function discoverMovies(baseParams, extra = {}) {
  return fetchWithFallback("discover/movie", { ...baseParams, ...extra });
}

// ── 키즈 (4~7세) ──────────────────────────────────────────────

export const fetchKidsMovies = () =>
  discoverMovies(KIDS_PARAMS, { sort_by: "popularity.desc" });

const todayDate = () => new Date().toISOString().split("T")[0];

export const fetchLatestKidsMovies = () =>
  discoverMovies(KIDS_PARAMS, {
    sort_by: "release_date.desc",
    "primary_release_date.lte": todayDate(),
  });

export const fetchKidsMoviesByPage = (page = 1) =>
  discoverMovies(KIDS_PARAMS, { sort_by: "popularity.desc", page });

export const fetchLatestKidsMoviesByPage = (page = 1) =>
  discoverMovies(KIDS_PARAMS, {
    sort_by: "release_date.desc",
    "primary_release_date.lte": todayDate(),
    page,
  });

// ── 주니어 (8~12세) ───────────────────────────────────────────

export const fetchJuniorMovies = () =>
  discoverMovies(JUNIOR_PARAMS, { sort_by: "popularity.desc" });

export const fetchLatestJuniorMovies = () =>
  discoverMovies(JUNIOR_PARAMS, {
    sort_by: "release_date.desc",
    "primary_release_date.lte": todayDate(),
  });

export const fetchJuniorDrama = () =>
  discoverMovies(
    { ...JUNIOR_PARAMS, with_genres: "18,10751" },
    { sort_by: "vote_average.desc", "vote_count.gte": 100 },
  );

export const fetchJuniorMoviesByPage = (page = 1) =>
  discoverMovies(JUNIOR_PARAMS, { sort_by: "popularity.desc", page });

export const fetchLatestJuniorMoviesByPage = (page = 1) =>
  discoverMovies(JUNIOR_PARAMS, {
    sort_by: "release_date.desc",
    "primary_release_date.lte": todayDate(),
    page,
  });

export const fetchJuniorDramaByPage = (page = 1) =>
  discoverMovies(
    { ...JUNIOR_PARAMS, with_genres: "18,10751" },
    { sort_by: "vote_average.desc", "vote_count.gte": 100, page },
  );

// ── 트렌딩 ────────────────────────────────────────────────────

export const fetchTrending = () =>
  fetchWithFallback("trending/movie/week");

// ── 영어 글로벌 키즈 ──────────────────────────────────────────

const ENGLISH_BASE_PARAMS = {
  with_genres: "16,10762",
  with_original_language: "en",
  language: "en-US",
  sort_by: "popularity.desc",
  certification_country: "US",
};

const ENGLISH_KIDS_PARAMS = { ...ENGLISH_BASE_PARAMS, "certification.lte": "G" };
const ENGLISH_JUNIOR_PARAMS = { ...ENGLISH_BASE_PARAMS, "certification.gte": "PG", "certification.lte": "PG" };

function fetchEnglishContent(params) {
  return api.get("discover/tv", { params })
    .then((res) => res.data.results.filter((item) => item.original_language === "en" && item.poster_path))
    .catch(() => []);
}

export const fetchEnglishKidsContent = () => fetchEnglishContent(ENGLISH_KIDS_PARAMS);
export const fetchEnglishJuniorContent = () => fetchEnglishContent(ENGLISH_JUNIOR_PARAMS);
export const fetchEnglishKidsContentByPage = (page = 1) => fetchEnglishContent({ ...ENGLISH_KIDS_PARAMS, page });
export const fetchEnglishJuniorContentByPage = (page = 1) => fetchEnglishContent({ ...ENGLISH_JUNIOR_PARAMS, page });

// ── 개별 콘텐츠 API (movie / tv 공용) ────────────────────────

export const fetchContentDetail = async (id, mediaType = "movie") => {
  try {
    const response = await api.get(`${mediaType}/${id}`);
    return response.data;
  } catch (error) {
    console.error("콘텐츠 상세 로드 실패:", error);
    return null;
  }
};

export const fetchContentVideos = async (id, mediaType = "movie") => {
  try {
    const res = await api.get(`${mediaType}/${id}/videos`);
    let results = res.data.results;
    // ko-KR 결과에 YouTube 트레일러가 없으면 en-US로 재시도
    const hasYoutube = results.some((v) => v.site === "YouTube");
    if (!hasYoutube) {
      const enRes = await api.get(`${mediaType}/${id}/videos`, { params: { language: "en-US" } });
      results = enRes.data.results;
    }
    return results;
  } catch (error) {
    console.error("콘텐츠 비디오 로드 실패:", error);
    return [];
  }
};

export const fetchSimilarContent = async (id, mediaType = "movie") => {
  const recs = await fetchWithFallback(`${mediaType}/${id}/recommendations`);
  if (recs.length > 0) return recs;
  return fetchWithFallback(`${mediaType}/${id}/similar`);
};

// TV 시즌 에피소드 목록
export const fetchSeasonEpisodes = async (tvId, seasonNumber) => {
  try {
    const res = await api.get(`tv/${tvId}/season/${seasonNumber}`);
    return res.data.episodes ?? [];
  } catch {
    return [];
  }
};

export const fetchMovieDetail = (movieId) => fetchContentDetail(movieId, "movie");
export const fetchMovieVideos = (movieId) => fetchContentVideos(movieId, "movie");
export const fetchSimilarMovies = (movieId) => fetchSimilarContent(movieId, "movie");

export const searchMovies = (query) =>
  fetchWithFallback("search/movie", { query, include_adult: false });

// ── 개별 TV API ──────────────────────────────────────────────

export const fetchTvDetail = async (tvId, lang) => {
  try {
    const params = lang ? { language: lang } : {};
    const response = await api.get(`tv/${tvId}`, { params });
    return response.data;
  } catch (error) {
    console.error("TV 상세 로드 실패:", error);
    return null;
  }
};

export const fetchTvVideos = async (tvId, lang) => {
  try {
    const params = lang ? { language: lang } : {};
    const response = await api.get(`tv/${tvId}/videos`, { params });
    return response.data.results;
  } catch (error) {
    console.error("TV 비디오 로드 실패:", error);
    return [];
  }
};

export const fetchSimilarTv = (tvId, lang) => {
  const params = lang ? { language: lang } : {};
  return fetchWithFallback(`tv/${tvId}/similar`, params);
};
