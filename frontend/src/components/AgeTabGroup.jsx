import { useNavigate } from "react-router";
import { Button } from "./Button";

export function AgeTabGroup({ activeMode }) {
  const navigate = useNavigate();

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
        onClick={activeMode !== "junior" ? () => navigate("/junior") : undefined}
      >
        주니어 8~12세
      </Button>
    </div>
  );
}
