import { createContext, useContext, useState } from "react";

const Ctx = createContext(null);

export function MovieModalProvider({ children }) {
  const [movieId, setMovieId] = useState(null);
  const [mediaType, setMediaType] = useState("movie");
  const [ageGroup, setAgeGroup] = useState(null);   // "kids" | "junior"
  const [section, setSection] = useState(null);     // "new" | "popular" | "recommend"
  return (
    <Ctx.Provider value={{
      movieId,
      mediaType,
      ageGroup,
      section,
      openMovie: (id, type = "movie", age = null, sec = null) => {
        setMovieId(String(id));
        setMediaType(type);
        setAgeGroup(age);
        setSection(sec);
      },
      closeMovie: () => {
        setMovieId(null);
        setMediaType("movie");
        setAgeGroup(null);
        setSection(null);
      },
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useMovieModal() {
  return useContext(Ctx);
}
