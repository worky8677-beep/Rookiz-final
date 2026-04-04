import { useEffect, Suspense, lazy } from "react";
import { Outlet, useLocation } from "react-router";
import { createPortal } from "react-dom";
import { EyeGuardWidget } from "./components/EyeGuardWidget";
import { MissionProvider } from "./context/MissionContext";
import { ProfileProvider } from "./context/ProfileContext";
import { MovieModalProvider, useMovieModal } from "./context/MovieModalContext";

const DetailPage = lazy(() => import("./pages/DetailPage"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function MovieModal() {
  const { movieId, closeMovie } = useMovieModal();
  if (!movieId) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 md:p-8"
      onClick={closeMovie}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-[560px] max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Suspense fallback={
          <div className="flex items-center justify-center h-64 flex-col gap-4">
            <div className="size-16 bg-primary-300 rounded-full flex items-center justify-center animate-bounce overflow-hidden border-4 border-white">
              <img src="/Airoo-circle.png" className="w-full h-full object-cover" alt="루" />
            </div>
            <p className="text-base font-black text-primary-600 animate-pulse font-sans">로딩중...</p>
          </div>
        }>
          <DetailPage movieId={movieId} onClose={closeMovie} />
        </Suspense>
      </div>
    </div>,
    document.body
  );
}

/**
 * App — 전역 레이아웃 브릿지
 * 공용 상태, 전역 컨텍스트, 공통 레이아웃을 여기서 제공하고
 * 각 페이지는 <Outlet />으로 렌더링된다.
 */
export default function App() {
  return (
    <ProfileProvider>
      <MissionProvider>
        <MovieModalProvider>
          <div className="relative min-h-screen">
            <ScrollToTop />
            <Outlet />
            <EyeGuardWidget />
            <MovieModal />
          </div>
        </MovieModalProvider>
      </MissionProvider>
    </ProfileProvider>
  );
}
