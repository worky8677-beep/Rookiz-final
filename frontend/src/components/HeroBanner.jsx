import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faPlay, faCircleInfo } from "@fortawesome/free-solid-svg-icons";

export function HeroBanner({ image, title, desc, subDesc, onPlay, onDetail }) {
  return (
    <section className="w-full max-w-[1280px] px-4 md:px-10 pt-4 md:pt-6 pb-6 md:pb-10">
      <div className="relative w-full aspect-[16/9] md:aspect-[2/1] rounded-2xl md:rounded-3xl overflow-hidden shadow-sm mx-auto">
        <img
          src={image}
          className="absolute inset-0 w-full h-full object-cover"
          alt={title}
        />
        <div className="absolute inset-0 overlay-banner" />

        <div className="absolute bottom-6 left-6 md:bottom-12 md:left-12 max-w-[90%] md:max-w-[672px] flex flex-col gap-2 md:gap-4 text-white">
          <div className="bg-primary-400 w-fit px-2 py-1 md:px-3 md:py-1.5 rounded-full flex items-center gap-1.5 md:gap-2">
            <FontAwesomeIcon icon={faStar} className="text-primary-700 size-3 md:size-5" />
            <span className="text-xs md:text-sm font-bold text-primary-700 font-poppins">신규</span>
          </div>
          <h1 className="text-2xl md:text-4xl lg:text-6xl font-black md:leading-10 font-poppins">
            {title}
          </h1>
          <div className="text-sm md:text-lg font-medium text-white/80 leading-snug md:leading-7">
            <p>{desc}</p>
            {subDesc && <p className="hidden md:block">{subDesc}</p>}
          </div>
          <div className="flex gap-2 md:gap-4 mt-1 md:mt-2">
            <button
              onClick={onPlay}
              className="bg-primary-500 text-gray-700 px-4 py-2 md:px-8 md:py-4 rounded-4xl flex items-center gap-1.5 md:gap-2 shadow-lg hover:bg-primary-400 transition-all font-bold text-sm md:text-2xl"
            >
              <FontAwesomeIcon icon={faPlay} className="size-3 md:size-6" />
              <span>보러가기</span>
            </button>
            <button
              onClick={onDetail}
              className="bg-white/20 backdrop-blur-sm border border-gray-50 text-gray-50 px-4 py-2 md:px-8 md:py-4 rounded-4xl flex items-center gap-1.5 md:gap-2 shadow-lg hover:bg-white/30 transition-all font-bold text-sm md:text-2xl"
            >
              <FontAwesomeIcon icon={faCircleInfo} className="size-3 md:size-6" />
              <span>더보기</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
