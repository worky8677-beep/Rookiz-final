import { twMerge } from "tailwind-merge";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";

const STEPS = ["계정 생성", "연령 선택", "AI 인사"];

export function StepIndicator({ current = 1, className }) {
  return (
    <div className={twMerge("flex items-center justify-center gap-2", className)}>
      {STEPS.map((label, i) => {
        const step = i + 1;
        const isActive = step === current;
        const isDone = step < current;

        return (
          <div key={step} className="flex items-center gap-2">
            {i > 0 && <div className={twMerge("w-10 h-0.5", isDone || isActive ? "bg-primary-500" : "bg-gray-100")} />}

            <div className="flex flex-col items-center gap-1.5">
              <div className={twMerge("size-8 rounded-full flex items-center justify-center text-xs font-bold", isActive ? "bg-primary-500 text-gray-950 shadow-[0px_4px_8px_0px_var(--color-primary-300)]" : isDone ? "bg-primary-500 text-white" : "bg-gray-100 text-gray-500/50")}>{isDone ? <FontAwesomeIcon icon={faCheck} className="text-xs" /> : step}</div>
              <span className={twMerge("text-xs text-center whitespace-nowrap", isActive ? "font-bold text-primary-500" : isDone ? "font-bold text-gray-500" : "font-medium text-gray-500")}>{label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
