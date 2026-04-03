import { useState } from 'react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faAward, faLeaf, faBan, faCheck, faCalendarDays, faPencil,
  faArrowTrendUp, faClock, faUserShield, faCircleCheck, faCircleMinus,
  faCirclePlus, faUserCheck, faCircleExclamation, faShieldHeart,
} from '@fortawesome/free-solid-svg-icons';

const LIMIT_MIN = 15;
const LIMIT_MAX = 180;
const LIMIT_STEP = 15;
const CHART_MAX_HEIGHT = 140;

function StatItem({ icon, value, label, color = "text-gray-700" }) {
  return (
    <div className="flex flex-col items-center gap-1 w-[140px]">
      <FontAwesomeIcon icon={icon} className={`${color} text-xl`} />
      <span className={`text-2xl font-extrabold ${color}`}>{value}</span>
      <span className="text-sm text-gray-500">{label}</span>
    </div>
  );
}

/* ── AlertRow: variant="blue" | "secondary" ── */
const ALERT_STYLE = {
  blue:      { wrap: "bg-blue-100 border-blue-500",           icon: "text-blue-900",      text: "text-blue-900" },
  secondary: { wrap: "bg-secondary-100 border-secondary-500", icon: "text-secondary-500", text: "text-secondary-500" },
};

function AlertRow({ variant, icon, children }) {
  const cls = ALERT_STYLE[variant];
  return (
    <div className={`${cls.wrap} border rounded-3xl h-[62px] flex items-center px-3 gap-2.5`}>
      <FontAwesomeIcon icon={icon} className={`${cls.icon} text-xl shrink-0`} />
      <p className={`text-sm font-semibold leading-5 ${cls.text}`}>{children}</p>
    </div>
  );
}

/* ── 마이루 통계 ── */
const profileStats = [
  { icon: faCalendarDays, iconCls: 'text-blue-600',      label: '함께 한 시간', value: '+ 265일' },
  { icon: faBan,          iconCls: 'text-secondary-500', label: '접근 제한 영상',     value: '10개' },
  { icon: faClock,        iconCls: 'text-primary-500',   label: '오늘 시청시간',      value: '1시간 46분' },
];

/* ── 케어루 — 주간 시청 데이터 ── */
const watchData = [
  { day: '월', min: 45 },
  { day: '화', min: 35 },
  { day: '수', min: 60 },
  { day: '목', min: 20 },
  { day: '금', min: 55 },
  { day: '토', min: 95 },
  { day: '일', min: 75 },
];

/* ── 케어루 — 루와의 미션 초기값 ── */
const INIT_MISSIONS = [
  { id: 1, text: '보고 싶은 영상이 생기면 부모님께 먼저 물어보기', done: true },
  { id: 2, text: '거북이처럼 목 빼지 않고, 허리 펴고 보기', done: true },
  { id: 3, text: '오빠랑 30분씩 돌아가면서 보기', done: true },
  { id: 4, text: '영어 학습지 2장 풀고 보기', done: false },
  { id: 5, text: '놀이터 갔다 와서 손 깨끗하게 씻기', done: false },
];

/* ── 케어루 — 장르 목록 ── */
const ALL_GENRES = ['폭력', '공포', '애니', '국내', '해외', '예능'];

export default function MyPage() {
  /* 칭찬 하루 */
  const [stickers, setStickers] = useState(
    Array(10).fill(false).map((_, i) => i < 4)
  );

  /* 케어루 */
  const [blocked, setBlocked] = useState(['폭력', '애니']);
  const [limit, setLimit] = useState(60);
  const [missions, setMissions] = useState(INIT_MISSIONS);

  function toggleSticker(idx) {
    setStickers(prev => prev.map((v, i) => (i === idx ? !v : v)));
  }

  function toggleGenre(g) {
    setBlocked(prev =>
      prev.includes(g) ? prev.filter(x => x !== g) : [...prev, g]
    );
  }

  function toggleMission(id) {
    setMissions(prev => prev.map(m => m.id === id ? { ...m, done: !m.done } : m));
  }

  const maxMin = Math.max(...watchData.map(d => d.min));
  const limitPct = ((limit - LIMIT_MIN) / (LIMIT_MAX - LIMIT_MIN)) * 100;

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Nav activeTab="mypage" />

      <main className="flex-1 w-full max-w-container mx-auto px-4 py-10 md:px-10 md:py-20 flex flex-col gap-12 md:gap-20">

        {/* ── 마이루 섹션 ── */}
        <section className="flex flex-col gap-5 md:gap-7">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">마이루</h2>
          <div className="bg-white border border-primary-500 rounded-3xl px-5 py-7 md:px-8 md:py-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 shadow-sm">
            <div className="flex gap-5 items-center">
              <div className="size-25 md:size-[123px] bg-white rounded-[27px] shadow-sm flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faUser} className="text-primary-500 text-4xl md:text-5xl" />
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-2xl md:text-3xl font-extrabold text-gray-700">최승아</span>
                <div className="flex items-center gap-2 bg-green-200 px-3 py-1.5 md:px-4 md:py-2 rounded-full w-fit">
                  <FontAwesomeIcon icon={faLeaf} className="text-green-600 text-base" />
                  <span className="text-green-600 font-bold text-sm md:text-base whitespace-nowrap">키즈 4~7세</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 lg:gap-9 items-center">
              {profileStats.map((s, idx) => (
                <div key={idx} className="bg-gray-50 rounded-3xl px-4 py-3 flex gap-2 items-center flex-1 min-w-[140px] lg:w-[180px] lg:flex-none h-[72px] overflow-hidden">
                  <FontAwesomeIcon icon={s.icon} className={`text-3xl lg:text-4xl shrink-0 ${s.iconCls}`} />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs lg:text-sm font-bold text-gray-700 truncate">{s.label}</span>
                    <span className="text-base lg:text-xl font-bold text-gray-700 truncate">{s.value}</span>
                  </div>
                </div>
              ))}
              <button className="flex items-center gap-2 text-gray-500 font-bold hover:text-gray-800 transition-colors shrink-0">
                <FontAwesomeIcon icon={faPencil} className="text-sm" />
                <span className="text-sm md:text-base">프로필 수정</span>
              </button>
            </div>
          </div>
        </section>

        {/* ── 칭찬 하루 섹션 ── */}
        <section className="flex flex-col gap-5 md:gap-7">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">칭찬 하루</h2>
          <div className="flex flex-wrap gap-x-12.5 gap-y-3">
            {stickers.map((active, i) => (
              <button
                key={i}
                onClick={() => toggleSticker(i)}
                className={`h-25 w-sticker rounded-full flex items-center justify-center cursor-pointer transition-all duration-300
                  ${active
                    ? 'bg-primary-100 border-[3px] border-primary-300'
                    : 'bg-white border-[3px] border-gray-300'
                  }`}
              >
                <FontAwesomeIcon
                  icon={faAward}
                  className={`text-4_5xl transition-colors duration-300 ${active ? 'text-primary-500' : 'text-gray-300'}`}
                />
              </button>
            ))}
          </div>
        </section>

        {/* ── 케어루 섹션 ── */}
        <section className="flex flex-col gap-7 bg-primary-100 rounded-3xl px-10 py-10">
          <h2 className="text-4xl font-extrabold text-gray-800">케어루</h2>

          {/* 2-column 그리드 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">

            {/* ── 좌측 ── */}
            <div className="flex flex-col gap-1.5">

              {/* 이번 주 시청 시간 차트 */}
              <div className="bg-white rounded-3xl px-6 py-10 shadow-sm flex flex-col gap-6">
                <span className="text-xl font-bold text-gray-700">이번 주 시청 시간 (분)</span>

                {/* 바 차트 */}
                <div className="flex items-end gap-2 h-40">
                  {watchData.map((d, i) => (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t-lg bg-primary-400 transition-all duration-500"
                        style={{ height: `${(d.min / maxMin) * CHART_MAX_HEIGHT}px` }}
                      />
                      <span className="text-sm font-bold text-gray-400">{d.day}</span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-around">
                  <StatItem icon={faArrowTrendUp} value="370" label="안전 콘텐츠" />
                  <StatItem icon={faClock} value="35" label="일 평균(분)" />
                  <StatItem icon={faUserShield} value="100%" label="안전 콘텐츠" color="text-green-600" />
                </div>
              </div>

              {/* 알림 2개 + AI 안전점수 */}
              <div className="flex gap-1.5 items-stretch">
                {/* 알림 2개 */}
                <div className="flex flex-col gap-3 flex-1">
                  <AlertRow variant="blue" icon={faUserCheck}>
                    이번 주 시청한 모든 콘텐츠가 연령 기준에 적합해요
                  </AlertRow>
                  <AlertRow variant="secondary" icon={faCircleExclamation}>
                    일일 시청 시간이 권장 시간을 초과한 날이 있어요
                  </AlertRow>
                </div>

                {/* AI 안전점수 */}
                <div className="bg-green-100 border border-green-600 rounded-3xl px-3.5 py-6 flex flex-col justify-center shadow-sm w-[224px] shrink-0">
                  <div className="flex items-center gap-4">
                    <div className="size-16 rounded-full bg-green-600 shadow-green-glow flex items-center justify-center shrink-0">
                      <span className="text-2xl font-extrabold text-white">98</span>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <div className="flex items-center gap-3">
                        <FontAwesomeIcon icon={faShieldHeart} className="text-green-900 text-xl" />
                        <span className="text-sm font-semibold text-green-900">AI 안전 점수</span>
                      </div>
                      <span className="text-lg font-extrabold text-gray-950">매우 안전해요!</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 우측 ── */}
            <div className="flex flex-col gap-7">

              {/* 루와의 미션 */}
              <div className="bg-white rounded-3xl px-8 py-10 shadow-sm flex flex-col gap-8">
                <span className="text-xl font-bold text-gray-700">루와의 미션</span>
                <ul className="flex flex-col gap-4">
                  {missions.map(m => (
                    <li
                      key={m.id}
                      className="flex items-center gap-[11px] cursor-pointer"
                      onClick={() => toggleMission(m.id)}
                    >
                      <FontAwesomeIcon
                        icon={faCircleCheck}
                        className={`text-xl shrink-0 ${m.done ? 'text-gray-500' : 'text-secondary-500'}`}
                      />
                      <span className={`text-xl leading-7 ${m.done ? 'text-gray-500' : 'line-through text-gray-800'}`}>
                        {m.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* 장르 차단 */}
              <div className="bg-white rounded-3xl px-10 py-10 shadow-sm flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-gray-700 shrink-0">장르 차단</span>
                  <span className="text-sm text-gray-400">해당 장르 콘텐츠는 검색 및 추천에서 제외돼요</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {ALL_GENRES.map(g => {
                    const isBlocked = blocked.includes(g);
                    return (
                      <button
                        key={g}
                        onClick={() => toggleGenre(g)}
                        className={`flex items-center gap-1 px-4 py-2.5 rounded-full text-sm font-bold border transition-all duration-200
                          ${isBlocked
                            ? 'bg-secondary-100 border-secondary-500 text-secondary-500'
                            : 'bg-gray-50 border-gray-100 text-gray-500'
                          }`}
                      >
                        <FontAwesomeIcon
                          icon={isBlocked ? faBan : faCheck}
                          className={`text-xs ${isBlocked ? 'text-secondary-500' : 'text-gray-300'}`}
                        />
                        {g}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ── 일일 시청 제한 ── */}
          <div className="bg-white rounded-3xl px-5 py-5 shadow-sm flex flex-col gap-3.5">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-1.5">
                <span className="text-xl font-bold text-gray-700">일일 시청 제한</span>
                <span className="text-sm text-gray-400">하루 최대 시청 시간을 설정해요</span>
              </div>
              <div className="flex items-center gap-0.5">
                <button onClick={() => setLimit(v => Math.max(LIMIT_MIN, v - LIMIT_STEP))}>
                  <FontAwesomeIcon icon={faCircleMinus} className="text-xl text-gray-300" />
                </button>
                <div className="w-16 text-center">
                  <span className="text-2xl font-extrabold text-primary-500">{limit}</span>
                  <span className="text-xs font-semibold text-gray-300">분</span>
                </div>
                <button onClick={() => setLimit(v => Math.min(LIMIT_MAX, v + LIMIT_STEP))}>
                  <FontAwesomeIcon icon={faCirclePlus} className="text-xl text-primary-500" />
                </button>
              </div>
            </div>

            {/* 진행 바 */}
            <div className="flex flex-col gap-1.5">
              <div className="relative h-[7px] bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="absolute left-0 top-0 h-full rounded-full bg-linear-[90deg] from-primary-200 to-primary-500 transition-all duration-300"
                  style={{ width: `${limitPct}%` }}
                />
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-300">{LIMIT_MIN}분</span>
                <span className="text-sm text-gray-300">{Math.floor(LIMIT_MAX / 60)}시간</span>
              </div>
            </div>
          </div>

          {/* 케어루 수정하기 버튼 */}
          <div className="flex justify-end">
            <button className="flex items-center justify-center gap-1 bg-white border border-primary-500 rounded-4xl h-[44px] w-[153px] text-sm font-bold text-primary-800 hover:bg-primary-500 hover:text-white transition-colors duration-200">
              <FontAwesomeIcon icon={faPencil} className="text-base" />
              케어루 수정하기
            </button>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
