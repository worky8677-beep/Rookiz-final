import { createContext, useContext, useState } from "react";

const Ctx = createContext(null);

export function MovieModalProvider({ children }) {
  const [movieId, setMovieId] = useState(null);
  const [mediaType, setMediaType] = useState("movie");
  return (
    <Ctx.Provider value={{
      movieId,
      mediaType,
      openMovie: (id, type = "movie") => { setMovieId(String(id)); setMediaType(type); },
      closeMovie: () => { setMovieId(null); setMediaType("movie"); },
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useMovieModal() {
  return useContext(Ctx);
}
