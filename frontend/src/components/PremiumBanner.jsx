export function PremiumBanner() {
  return (
    <div className="mx-4 md:mx-10 min-h-24 md:min-h-30 lg:h-40 bg-blue-900 rounded-2xl md:rounded-3xl lg:rounded-4xl flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-6 lg:px-8 relative overflow-hidden shadow-lg gap-3 md:gap-4">
      <div className="absolute -right-10 -bottom-10 size-24 md:size-36 lg:size-48 bg-primary-500/20 blur-lg md:blur-xl lg:blur-[32px] rounded-full" />
      <div className="flex flex-col gap-1.5 md:gap-3 lg:gap-5 relative z-10 text-gray-50">
        <h2 className="text-lg md:text-2xl lg:text-4xl font-black">
          프리미엄으로 구독하세요!
        </h2>
        <p className="text-xs md:text-sm lg:text-xl font-normal opacity-90">
          더 많은 혜택이 팡팡! 프리미엄으로 더 많은 프로필을 등록하세요!
        </p>
      </div>
      <button className="bg-primary-500 text-primary-950 px-4 py-2 md:px-6 md:py-3 lg:px-8 lg:py-4 rounded-full md:rounded-3xl lg:rounded-4xl font-black text-xs md:text-base lg:text-2xl shadow-lg relative z-10 hover:bg-primary-400 transition-all shrink-0">
        보러가기
      </button>
    </div>
  );
}
