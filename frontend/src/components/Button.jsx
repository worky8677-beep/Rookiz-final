import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowRight, faLeaf, faTree } from "@fortawesome/free-solid-svg-icons";

/**
 * 통합 Button 컴포넌트
 *
 * variant:
 *   "primary"    — 전폭 CTA 버튼 (구 LoginBtn)
 *   "age-kids"   — 키즈 탭 버튼   (구 AgeButton variant="kids")
 *   "age-junior" — 주니어 탭 버튼  (구 AgeButton variant="junior")
 *   "action"     — 아이콘 + 라벨 세로 버튼 (구 ActionBtn)
 */
export function Button({
  variant = "primary",
  active = false,
  showArrow = false,
  icon,
  label,
  children,
  onClick,
  className,
}) {
  if (variant === "primary") {
    return (
      <button
        onClick={onClick}
        disabled={!active}
        className={twMerge(
          "w-full h-12 md:h-14 rounded-2xl text-sm md:text-base font-extrabold transition-colors cursor-pointer flex items-center justify-center gap-3",
          active
            ? "bg-primary-500 text-gray-950 hover:bg-primary-400"
            : "bg-gray-200 text-gray-400 cursor-not-allowed",
          className
        )}
      >
        {children}
        {showArrow && <FontAwesomeIcon icon={faCircleArrowRight} className="text-lg" />}
      </button>
    );
  }

  if (variant === "age-kids" || variant === "age-junior") {
    const isKids = variant === "age-kids";
    const activeStyle = isKids
      ? "bg-green-100 border-green-600 text-gray-700 font-bold"
      : "bg-blue-100 border-blue-500 text-gray-700 font-bold shadow-sm";

    return (
      <button
        onClick={onClick}
        className={twMerge(
          "flex items-center justify-center gap-1.5 md:gap-2 h-12 md:h-15 px-4 md:px-[22px] py-2.5 md:py-4 rounded-full border-2 transition-all duration-200 cursor-pointer shadow-sm font-sans shrink-0",
          active ? activeStyle : "bg-gray-50 border-gray-300 text-gray-300 hover:bg-white",
          className
        )}
      >
        <FontAwesomeIcon
          icon={isKids ? faLeaf : faTree}
          className="size-3.5 md:size-4.5"
        />
        <span className="text-sm md:text-xl whitespace-nowrap">{children}</span>
      </button>
    );
  }

  if (variant === "action") {
    return (
      <div className="flex flex-col items-center gap-1.5">
        <button
          onClick={onClick}
          className={twMerge(
            "size-11 bg-gray-100 rounded-2xl flex items-center justify-center hover:bg-gray-200 transition-colors text-gray-500",
            className
          )}
        >
          {icon && <FontAwesomeIcon icon={icon} className="text-lg" />}
        </button>
        {label && (
          <span className="text-xs text-gray-300 font-semibold font-sans">{label}</span>
        )}
      </div>
    );
  }
}
