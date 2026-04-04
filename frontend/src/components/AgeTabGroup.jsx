import { useNavigate } from "react-router";
import { twMerge } from "tailwind-merge";
import { Button } from "./Button";
import { useProfile } from "../context/ProfileContext";

export function AgeTabGroup({ activeMode }) {
  const navigate = useNavigate();
  const { activeProfile } = useProfile();
  const isKids = (activeProfile?.level ?? 1) < 2; // 키즈 프로필이면 주니어 탭 잠금

  return (
    <div className="px-4 md:px-10 flex gap-2 md:gap-3.5 overflow-x-auto scrollbar-hide items-center">
      <Button
        variant="age-kids"
        active={activeMode === "kids"}
        onClick={activeMode !== "kids" ? () => navigate("/home") : undefined}
      >
        키즈 4~7세
      </Button>

      <Button
        variant="age-junior"
        active={activeMode === "junior"}
        onClick={!isKids && activeMode !== "junior" ? () => navigate("/junior") : undefined}
        className={isKids ? "opacity-40 cursor-no-drop" : ""}
      >
        주니어 8~12세
      </Button>
    </div>
  );
}
