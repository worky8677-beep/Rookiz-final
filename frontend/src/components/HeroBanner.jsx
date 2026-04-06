import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faPlay, faCircleInfo } from "@fortawesome/free-solid-svg-icons";

export function HeroBanner({ items = [], onPlay, onDetail, getImageUrl }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (items.length <= 1) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [items.length]);

  if (!items || items.length === 0) return null;

  const currentItem = items[currentIndex];
  const image = getImageUrl(currentItem?.backdrop_path || currentItem?.poster_path, "original");
  const title = currentItem?.title || currentItem?.name || "";
  const desc = currentItem?.overview || "";

  return (
    <section className="w-full max-w-container px-4 md:px-10 pt-4 md:pt-6 pb-6 md:pb-10 relative group">
      <div className="relative w-full aspect-[16/9] md:aspect-[2/1] rounded-2xl md:rounded-3xl overflow-hidden shadow-sm mx-auto">
        {/* 슬라이드 이미지 (부드러운 전환 효과) */}
        <div className="absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out">
          <img
            src={image}
            key={currentIndex}
            className="absolute inset-0 w-full h-full object-cover animate-fade-in"
            alt={title}
          />
        </div>
        
        <div className="absolute inset-0 overlay-banner" />

        <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 max-w-[90%] md:max-w-[672px] flex flex-col gap-2 md:gap-4 text-white z-10">
          <div className="bg-primary-400 w-fit px-2 py-1 md:px-3 md:py-1.5 rounded-full flex items-center gap-1.5 md:gap-2">
            <FontAwesomeIcon icon={faStar} className="text-primary-700 size-3 md:size-5" />
            <span className="text-xs md:text-sm font-bold text-primary-700 font-poppins">신규</span>
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-6xl font-black md:leading-10 font-poppins break-keep transition-all">
            {title}
          </h1>
          <div className="text-sm md:text-lg font-medium text-white/80 leading-snug md:leading-7 break-keep line-clamp-2 md:line-clamp-3">
            <p>{desc}</p>
          </div>
          <div className="flex gap-2 md:gap-4 mt-1 md:mt-2">
            <button
              onClick={() => onPlay?.(currentItem)}
              className="bg-primary-500 text-gray-700 px-4 py-2 md:px-8 md:py-4 rounded-4xl flex items-center gap-1.5 md:gap-2 shadow-lg hover:bg-primary-400 transition-all font-bold text-sm md:text-2xl"
            >
              <FontAwesomeIcon icon={faPlay} className="size-3 md:size-6" />
              <span>보러가기</span>
            </button>
            <button
              onClick={() => onDetail?.(currentItem)}
              className="bg-white/20 backdrop-blur-sm border border-gray-50 text-gray-50 px-4 py-2 md:px-8 md:py-4 rounded-4xl flex items-center gap-1.5 md:gap-2 shadow-lg hover:bg-white/30 transition-all font-bold text-sm md:text-2xl"
            >
              <FontAwesomeIcon icon={faCircleInfo} className="size-3 md:size-6" />
              <span>더보기</span>
            </button>
          </div>
        </div>

        {/* 페이지네이션 인디케이터 */}
        <div className="absolute bottom-6 right-6 md:bottom-12 md:right-12 flex gap-2 z-10">
          {items.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 md:h-2 rounded-full transition-all duration-300 ${
                i === currentIndex ? "bg-primary-500 w-6 md:w-10" : "bg-white/30 w-1.5 md:w-2"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
