export function PremiumBanner() {
  return (
    <div className="mx-4 md:mx-10 min-h-[120px] md:h-[160px] bg-blue-900 rounded-2xl md:rounded-4xl flex flex-col md:flex-row items-start md:items-center justify-between p-6 md:px-8 relative overflow-hidden shadow-lg gap-4">
      <div className="absolute -right-10 -bottom-10 size-32 md:size-48 bg-primary-500/20 blur-xl md:blur-[32px] rounded-full" />
      <div className="flex flex-col gap-2 md:gap-5 relative z-10 text-gray-50">
        <h2 className="text-xl md:text-4xl font-black">
          프리미엄으로 구독하세요!
        </h2>
        <p className="text-sm md:text-xl font-normal opacity-90">
          더 많은 혜택이 팡팡! 프리미엄으로 더 많은 프로필을 등록하세요!
        </p>
      </div>
      <button className="bg-primary-500 text-primary-950 px-6 py-2.5 md:px-8 md:py-4 rounded-full md:rounded-[48px] font-black text-sm md:text-2xl shadow-lg relative z-10 hover:bg-primary-400 transition-all shrink-0">
        보러가기
      </button>
    </div>
  );
}
