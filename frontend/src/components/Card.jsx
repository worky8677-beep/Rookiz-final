import { useState } from 'react';
import { twMerge } from 'tailwind-merge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

function Skeleton({ className }) {
  return <div className={twMerge('absolute inset-0 bg-gray-200 animate-pulse', className)} />;
}

/**
 * Card — 범용 콘텐츠 카드
 *
 * variant:
 *   "default" (기본) — 가로형, size prop으로 비율 조정
 *   "poster"         — 세로형 3:4 포스터 (구 PosterCard), badge slot 지원
 *
 * variant="default" 전용: size — "lg" | "md" | "sm"
 * variant="poster"  전용: badge — <RatingBadge /> | <EngBadge /> | null
 */
export function Card({ variant = 'default', title, image, size = 'md', badge, className, children, onClick }) {
  const [posterLoaded, setPosterLoaded] = useState(false);
  const [defaultLoaded, setDefaultLoaded] = useState(false);

  if (variant === 'poster') {
    return (
      <div
        className="aspect-[3/4] md:h-[360px] rounded-2xl md:rounded-4xl overflow-hidden relative group cursor-pointer shadow-sm"
        onClick={onClick}
      >
        {!posterLoaded && <Skeleton />}
        <img
          src={image}
          alt={title}
          className={twMerge('w-full h-full object-cover group-hover:scale-105 transition-transform duration-700', !posterLoaded && 'opacity-0')}
          onLoad={() => setPosterLoaded(true)}
        />
        <div className="absolute inset-0 overlay-poster" />
        <div className="absolute bottom-4 left-4 right-3 md:bottom-6 md:left-6 md:right-4 text-white text-sm md:text-xl font-black leading-snug line-clamp-2">
          {title}
        </div>
        {badge}
      </div>
    );
  }

  const sizeStyles = {
    lg: 'w-full aspect-[2/1] rounded-4xl p-10',
    md: 'w-full aspect-[4/3] rounded-4xl p-6',
    sm: 'w-full aspect-square rounded-4xl p-4',
  };

  const titleStyles = {
    lg: 'text-2xl md:text-5xl font-black md:leading-10 font-sans',
    md: 'text-xl md:text-4xl font-extrabold md:leading-8 font-sans',
    sm: 'text-lg md:text-2xl font-bold md:leading-6 font-sans',
  };

  return (
    <div
      onClick={onClick}
      className={twMerge(
        'relative overflow-hidden bg-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow group',
        sizeStyles[size],
        className
      )}
    >
      {image && !defaultLoaded && <Skeleton />}
      {image && (
        <img
          src={image}
          alt={title}
          className={twMerge('absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700', !defaultLoaded && 'opacity-0')}
          onLoad={() => setDefaultLoaded(true)}
        />
      )}
      <div className="absolute inset-0 overlay-card" />
      <div className="relative h-full flex flex-col justify-end text-white">
        <h3 className={twMerge(titleStyles[size], 'truncate')}>{title}</h3>
        {children}
      </div>
    </div>
  );
}

export function RatingBadge({ score }) {
  return (
    <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-black/50 text-primary-500 text-xs md:text-sm font-bold px-2 py-0.5 md:py-1 rounded-full">
      <FontAwesomeIcon icon={faStar} /> {score}
    </div>
  );
}

export function EngBadge() {
  return (
    <div className="absolute top-2 right-2 md:top-4 md:right-4 bg-blue-500 text-white text-xs font-bold px-2 py-0.5 md:py-1 rounded-full">
      🇺🇸 ENG
    </div>
  );
}

export function Tag({ label }) {
  return (
    <span className="bg-gray-100 text-gray-500 px-3 py-1.5 rounded-full text-xs font-medium">
      {label}
    </span>
  );
}
