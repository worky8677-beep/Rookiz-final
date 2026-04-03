/**
 * CharacterCard — 캐릭터 이미지 + 이름
 */
export function CharacterCard({ name, image, onClick }) {
  return (
    <div
      className="flex flex-col items-center gap-2 md:gap-3 shrink-0 cursor-pointer group"
      onClick={onClick}
    >
      <div className="w-32 h-32 md:w-[208px] md:h-[188px] rounded-2xl md:rounded-4xl bg-white overflow-hidden shadow-sm group-hover:shadow-md transition-shadow">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <span className="text-sm md:text-2xl font-semibold text-gray-700">
        {name}
      </span>
    </div>
  );
}
