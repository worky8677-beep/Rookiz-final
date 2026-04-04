import { createContext, useContext, useState } from "react";

const Ctx = createContext(null);

export function MovieModalProvider({ children }) {
  const [movieId, setMovieId] = useState(null);
  return (
    <Ctx.Provider value={{
      movieId,
      openMovie: (id) => setMovieId(String(id)),
      closeMovie: () => setMovieId(null),
    }}>
      {children}
    </Ctx.Provider>
  );
}

export function useMovieModal() {
  return useContext(Ctx);
}
