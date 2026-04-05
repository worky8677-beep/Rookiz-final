import { useEffect, useState, Suspense, lazy } from "react";
import { Outlet, useLocation } from "react-router";
import { createPortal } from "react-dom";

import { MissionProvider } from "./context/MissionContext";
import { ProfileProvider } from "./context/ProfileContext";
import { MovieModalProvider, useMovieModal } from "./context/MovieModalContext";
import { EyeGuardProvider, useEyeGuardContext } from "./context/EyeGuardContext";

const DetailPage = lazy(() => import("./pages/DetailPage"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// 루 경고 UI — VideoPlayer 안(풀스크린)과 포털(일반) 모두 사용
export function RooWarningUI({ className = "" }) {
  return (
    <div className={`flex flex-col items-center gap-2 animate-[slideUp_0.4s_ease-out] ${className}`}>
      <div className="relative bg-white rounded-2xl shadow-xl px-5 py-3 border-2 border-primary-400">
        <p className="text-sm md:text-base font-extrabold text-gray-700 whitespace-nowrap">
          우리 조금만 뒤로 가서 볼까? 👀
        </p>
        <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-4 h-3 overflow-hidden">
          <div className="w-4 h-4 bg-white border-r-2 border-b-2 border-primary-400 rotate-45 -translate-y-2" />
        </div>
      </div>
      <img
        src="/roo-character.png"
        alt="루"
        className="w-24 md:w-32 h-auto drop-shadow-xl animate-[bounce_1s_ease-in-out_infinite]"
      />
    </div>
  );
}

// 풀스크린이 아닐 때만 포털로 표시
function RooDistanceWarning() {
  const { status, running } = useEyeGuardContext();
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    function onFsChange() { setIsFullscreen(!!document.fullscreenElement); }
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, []);

  if (!running || status !== "danger" || isFullscreen) return null;

  return createPortal(
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200]">
      <RooWarningUI />
    </div>,
    document.body
  );
}

function MovieModal() {
  const { movieId, mediaType, closeMovie } = useMovieModal();
  if (!movieId) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] bg-black/60 flex items-center justify-center p-4 md:p-8"
      onClick={closeMovie}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-[640px] lg:max-w-[800px] max-h-[90vh] overflow-y-auto shadow-2xl"
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
          <DetailPage movieId={movieId} mediaType={mediaType} onClose={closeMovie} />
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
    <EyeGuardProvider>
      <ProfileProvider>
        <MissionProvider>
          <MovieModalProvider>
            <div className="relative min-h-screen">
              <ScrollToTop />
              <Outlet />
              <MovieModal />
              <RooDistanceWarning />
            </div>
          </MovieModalProvider>
        </MissionProvider>
      </ProfileProvider>
    </EyeGuardProvider>
  );
}
