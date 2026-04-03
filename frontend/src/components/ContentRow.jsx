import { twMerge } from 'tailwind-merge';
import { Header } from './Header';
import { Card, RatingBadge, EngBadge } from './Card';
import { getImageUrl } from '../api/api';

/**
 * ContentRow — 섹션 타이틀 + 콘텐츠 리스트
 *
 * layout:
 *   "scroll" (기본) — 수평 스크롤 + Card
 *   "grid"          — 4열 그리드 + Card variant="poster"
 *
 * layout="grid" 전용 props:
 *   badge       — "rating" | "eng" | undefined
 *   filter      — (item) => boolean
 *   onItemClick — (item) => void
 *
 * items 없이 children만 넣어도 동작 (커스텀 레이아웃)
 */
export function ContentRow({
  title,
  items,
  layout = 'scroll',
  badge,
  filter,
  onItemClick,
  showViewAll = true,
  viewAllLink = '#',
  className,
  children,
}) {
  const GRID_MAX = 4;

  function renderGrid() {
    const list = (filter ? items.filter(filter) : items).slice(0, GRID_MAX);

    function getBadge(item) {
      if (badge === 'rating') return <RatingBadge score={item.vote_average?.toFixed(1)} />;
      if (badge === 'eng') return <EngBadge />;
      return null;
    }

    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-10">
        {list.map((item) => (
          <Card
            key={item.id}
            variant="poster"
            image={getImageUrl(item.poster_path)}
            title={item.name || item.title}
            badge={getBadge(item)}
            onClick={() => onItemClick?.(item)}
          />
        ))}
      </div>
    );
  }

  function renderScroll() {
    return (
      <div className="flex gap-4 md:gap-6 overflow-x-auto overflow-y-hidden pb-2 w-full max-w-[1200px] scrollbar-hide">
        {items.map((item) => (
          <Card
            key={item.id}
            image={item.image}
            title={item.title}
            size={item.size || 'sm'}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={twMerge('w-full flex flex-col gap-7', className)}>
      <Header title={title} showViewAll={showViewAll} viewAllLink={viewAllLink} />

      {children ? (
        <div className="w-full">{children}</div>
      ) : layout === 'grid' ? (
        renderGrid()
      ) : (
        renderScroll()
      )}
    </div>
  );
}
