import { twMerge } from "tailwind-merge";
import { Heading, Text } from "./Typography";

const imgRoo = "/roo-character.png";

export function LoginCharacter({
  title = "Rookiz에 오신 걸 환영해요!",
  subtitle = "계정을 만들고 즐거운 여정을 시작하세요",
  className,
}) {
  return (
    <div className={twMerge("relative flex flex-col items-center w-full max-w-[346px]", className)}>
      <img
        src={imgRoo}
        alt="루 캐릭터"
        className="w-24 md:w-[150px] h-auto object-contain relative z-10"
      />

      <div className="w-full backdrop-blur-sm bg-white/38 rounded-3xl shadow-md px-6 py-3 -mt-6 text-center">
        <Heading as="h2" size="2xl" className="text-primary-950 font-extrabold">
          {title}
        </Heading>
        {subtitle && (
          <Text size="sm" className="text-gray-500 mt-1">
            {subtitle}
          </Text>
        )}
      </div>
    </div>
  );
}
