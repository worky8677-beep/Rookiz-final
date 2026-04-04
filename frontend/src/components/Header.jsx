import { Link } from "react-router";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";

/**
 * Header — 섹션 타이틀 + 더보기 링크
 */
export function Header({ title, showViewAll = true, viewAllLink = "#" }) {
  return (
    <div className="flex items-center justify-between w-full max-w-content">
      <h2 className="text-2xl md:text-4xl font-black text-gray-800 tracking-tight md:leading-8">{title}</h2>
      {showViewAll && (
        <Link to={viewAllLink} className="flex items-center gap-1 text-sm md:text-lg font-bold text-gray-800 hover:opacity-70 transition-opacity font-poppins shrink-0">
          <span>더보기</span>
          <FontAwesomeIcon icon={faCaretRight} className="text-xxs md:text-xs" />
        </Link>
      )}
    </div>
  );
}
