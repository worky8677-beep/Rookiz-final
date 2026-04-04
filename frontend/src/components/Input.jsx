import { twMerge } from "tailwind-merge";

/**
 * 공통 Input 컴포넌트
 *
 * variant:
 *   "default" — 일반 폼 입력 (LoginInput 등)
 *   "chat"    — 채팅 입력 (rounded-full, 작은 패딩)
 */
export function Input({ variant = "default", className, ...props }) {
  const base =
    "w-full bg-gray-50 text-sm outline-none placeholder:text-gray-400 transition-colors";
  const variants = {
    default:
      "border border-gray-400 rounded-2xl px-4 py-3.5 text-gray-950 focus:border-primary-500",
    chat: "border border-gray-200 rounded-full py-2 px-4 text-gray-900 focus:border-primary-400",
  };
  return (
    <input
      className={twMerge(base, variants[variant] ?? variants.default, className)}
      {...props}
    />
  );
}
