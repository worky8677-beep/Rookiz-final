import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';
import { useMission } from '../context/MissionContext';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser, faAward, faLeaf, faBan, faCheck, faCalendarDays, faPencil,
  faArrowTrendUp, faClock, faUserShield, faCircleCheck, faCircleMinus,
  faCirclePlus, faUserCheck, faCircleExclamation, faShieldHeart,
  faCamera, faXmark, faLock, faCircleCheck as faCircleCheckSolid,
} from '@fortawesome/free-solid-svg-icons';

const PIN_KEY = 'rookiz_parent_pin';
const getPin = () => localStorage.getItem(PIN_KEY) ?? '1234';

/* ── PIN 변경 모달 ── */
const STEPS = ['current', 'new', 'confirm'];
const STEP_LABEL = {
  current: '현재 PIN을 입력해주세요',
  new:     '새 PIN을 입력해주세요',
  confirm: '새 PIN을 한 번 더 입력해주세요',
};

function ChangePinModal({ onClose }) {
  const [step, setStep]     = useState('current');
  const [newPin, setNewPin] = useState('');
  const [digits, setDigits] = useState(['', '', '', '']);
  const [error, setError]   = useState(false);
  const [done, setDone]     = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, [step]);

  function handleChange(idx, val) {
    const d = val.replace(/\D/g, '').slice(-1);
    const next = digits.map((v, i) => i === idx ? d : v);
    setDigits(next);
    setError(false);
    if (d && idx < 3) inputRefs.current[idx + 1]?.focus();
    if (next.every(v => v)) complete(next.join(''));
  }

  function handleKeyDown(idx, e) {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  }

  function fail() {
    setError(true);
    setTimeout(() => {
      setDigits(['', '', '', '']);
      setError(false);
      inputRefs.current[0]?.focus();
    }, 700);
  }

  function complete(pin) {
    if (step === 'current') {
      if (pin !== getPin()) { fail(); return; }
      setStep('new');
      setDigits(['', '', '', '']);
    } else if (step === 'new') {
      setNewPin(pin);
      setStep('confirm');
      setDigits(['', '', '', '']);
    } else {
      if (pin !== newPin) { fail(); return; }
      localStorage.setItem(PIN_KEY, pin);
      setDone(true);
      setTimeout(() => onClose(), 1500);
    }
  }

  const stepIdx = STEPS.indexOf(step);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-3xl w-full max-w-xs px-8 py-10 flex flex-col gap-7 shadow-xl">

        <div className="flex items-center justify-between">
          <span className="text-xl font-extrabold text-gray-800">부모님 PIN 변경</span>
          <button onClick={() => onClose()}>
            <FontAwesomeIcon icon={faXmark} className="text-xl text-gray-400 hover:text-gray-700" />
          </button>
        </div>

        {/* 단계 인디케이터 */}
        <div className="flex justify-center gap-2">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i <= stepIdx ? 'bg-primary-500 w-8' : 'bg-gray-200 w-5'
              }`}
            />
          ))}
        </div>

        {done ? (
          /* 완료 상태 */
          <div className="flex flex-col items-center gap-3 py-4">
            <div className="size-14 rounded-full bg-green-100 flex items-center justify-center">
              <FontAwesomeIcon icon={faCircleCheckSolid} className="text-green-500 text-3xl" />
            </div>
            <p className="text-base font-bold text-gray-700">PIN이 변경됐어요!</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col items-center gap-2">
              <div className="size-12 rounded-full bg-primary-100 flex items-center justify-center">
                <FontAwesomeIcon icon={faLock} className="text-primary-500 text-xl" />
              </div>
              <p className="text-sm font-semibold text-gray-500 text-center">{STEP_LABEL[step]}</p>
            </div>

            {/* PIN 입력 */}
            <div className="flex justify-center gap-3">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={el => inputRefs.current[i] = el}
                  type="password"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  className={twMerge(
                    'size-14 rounded-2xl text-center text-2xl font-bold border-2 outline-none transition-all duration-200',
                    error
                      ? 'border-red-400 bg-red-50 text-red-500'
                      : d
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 bg-gray-50'
                  )}
                />
              ))}
            </div>

            {error && (
              <p className="text-sm text-red-500 font-semibold text-center -mt-3">
                {step === 'confirm' ? 'PIN이 일치하지 않아요' : 'PIN 번호가 올바르지 않아요'}
              </p>
            )}
          </>
        )}
      </div>
    </div>,
    document.body
  );
}

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

/* 미션 수 → 오늘 스티커 스타일 */
function getTodayStyle(count) {
  if (count === 0) return { btn: 'bg-white border-gray-300',                                      icon: 'text-gray-300' };
  if (count === 1) return { btn: 'bg-white border-primary-300',                                   icon: 'text-gray-300' };
  if (count <= 3)  return { btn: 'bg-linear-[180deg] from-white from-50% to-primary-100 to-50% border-primary-300', icon: 'text-primary-300' };
  return               { btn: 'bg-primary-100 border-primary-300 animate-spark',                 icon: 'text-primary-500' };
}

/* 나이 → 뱃지 텍스트 */
function getAgeBadge(age) {
  const n = Number(age);
  if (n >= 4 && n <= 7) return '키즈 4~7세';
  if (n >= 8 && n <= 12) return '주니어 8~12세';
  return `${age}세`;
}

export default function MyPage() {
  const { history, savedToday } = useMission();

  /* 프로필 */
  const [profile, setProfile] = useState({ name: '최승아', age: '5', photo: null });
  const [editOpen, setEditOpen] = useState(false);
  const [draft, setDraft] = useState(profile);
  const fileRef = useRef(null);

  function openEdit() {
    setDraft(profile);
    setEditOpen(true);
  }

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setDraft(p => ({ ...p, photo: url }));
  }

  function saveProfile() {
    setProfile(draft);
    setEditOpen(false);
  }

  /* 케어루 */
  const [isEditing, setIsEditing]     = useState(false);
  const [pinChangeOpen, setPinChangeOpen] = useState(false);
  const [blocked, setBlocked] = useState(['폭력', '애니']);
  const [limit, setLimit] = useState(60);
  const [missions, setMissions] = useState(INIT_MISSIONS);

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

      {/* ── 프로필 수정 모달 ── */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-3xl w-full max-w-sm px-8 py-10 flex flex-col gap-7 shadow-xl">

            <div className="flex items-center justify-between">
              <span className="text-2xl font-extrabold text-gray-800">프로필 수정</span>
              <button onClick={() => setEditOpen(false)}>
                <FontAwesomeIcon icon={faXmark} className="text-xl text-gray-400 hover:text-gray-700" />
              </button>
            </div>

            {/* 사진 */}
            <div className="flex flex-col items-center gap-3">
              <button
                onClick={() => fileRef.current?.click()}
                className="relative size-25 rounded-[27px] bg-gray-100 flex items-center justify-center overflow-hidden group"
              >
                {draft.photo
                  ? <img src={draft.photo} alt="프로필" className="size-full object-cover" />
                  : <FontAwesomeIcon icon={faUser} className="text-primary-300 text-5xl" />
                }
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-[27px]">
                  <FontAwesomeIcon icon={faCamera} className="text-white text-2xl" />
                </div>
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
              <span className="text-xs text-gray-400">사진을 눌러 변경하세요</span>
            </div>

            {/* 이름 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-700">이름</label>
              <input
                value={draft.name}
                onChange={e => setDraft(p => ({ ...p, name: e.target.value }))}
                className="border border-gray-200 rounded-2xl px-4 h-12 text-base text-gray-800 outline-none focus:border-primary-500 transition-colors"
                placeholder="이름을 입력하세요"
              />
            </div>

            {/* 나이 */}
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-bold text-gray-700">나이</label>
              <input
                type="number"
                min="1"
                max="12"
                value={draft.age}
                onChange={e => setDraft(p => ({ ...p, age: e.target.value }))}
                className="border border-gray-200 rounded-2xl px-4 h-12 text-base text-gray-800 outline-none focus:border-primary-500 transition-colors"
                placeholder="나이를 입력하세요"
              />
              {draft.age && (
                <span className="text-xs text-primary-500 font-semibold">{getAgeBadge(draft.age)}</span>
              )}
            </div>

            {/* 버튼 */}
            <div className="flex gap-3">
              <button
                onClick={() => setEditOpen(false)}
                className="flex-1 h-12 rounded-4xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={saveProfile}
                className="flex-1 h-12 rounded-4xl bg-primary-500 text-sm font-bold text-white hover:bg-primary-400 transition-colors"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}

      <main className="flex-1 w-full max-w-container mx-auto px-4 py-10 md:px-10 md:py-20 flex flex-col gap-12 md:gap-20">

        {/* ── 마이루 섹션 ── */}
        <section className="flex flex-col gap-5 md:gap-7">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">마이루</h2>
          <div className="bg-white border border-primary-500 rounded-3xl px-5 py-7 md:px-8 md:py-10 flex flex-col lg:flex-row lg:items-center gap-6 shadow-sm">
            {/* 프로필 */}
            <div className="flex gap-5 items-center shrink-0">
              <div className="size-25 md:size-30.75 bg-white rounded-[27px] shadow-sm flex items-center justify-center shrink-0 overflow-hidden">
                {profile.photo
                  ? <img src={profile.photo} alt="프로필" className="size-full object-cover" />
                  : <FontAwesomeIcon icon={faUser} className="text-primary-500 text-4xl md:text-5xl" />
                }
              </div>
              <div className="flex flex-col gap-3">
                <span className="text-2xl md:text-3xl font-extrabold text-gray-700">{profile.name}</span>
                <div className="flex items-center gap-2 bg-green-200 px-3 py-1.5 md:px-4 md:py-2 rounded-full w-fit">
                  <FontAwesomeIcon icon={faLeaf} className="text-green-600 text-base" />
                  <span className="text-green-600 font-bold text-sm md:text-base whitespace-nowrap">{getAgeBadge(profile.age)}</span>
                </div>
              </div>
            </div>

            {/* 통계 — 가운데 */}
            <div className="flex flex-wrap gap-3 lg:gap-5 items-center flex-1 justify-center">
              {profileStats.map((s, idx) => (
                <div key={idx} className="bg-gray-50 rounded-3xl px-4 py-3 flex gap-2 items-center min-w-35 lg:w-45 h-18 overflow-hidden">
                  <FontAwesomeIcon icon={s.icon} className={`text-3xl lg:text-4xl shrink-0 ${s.iconCls}`} />
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs lg:text-sm font-bold text-gray-700 truncate">{s.label}</span>
                    <span className="text-base lg:text-xl font-bold text-gray-700 truncate">{s.value}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* 프로필 수정 버튼 */}
            <div className="flex justify-end lg:justify-start shrink-0">
              <button
                onClick={openEdit}
                className="flex items-center gap-1 border border-primary-500 rounded-4xl h-11 px-5 text-sm font-bold text-primary-800 bg-white hover:bg-primary-500 hover:text-white transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faPencil} className="text-base" />
                프로필 수정하기
              </button>
            </div>
          </div>
        </section>

        {/* ── 칭찬 하루 섹션 ── */}
        <section className="flex flex-col gap-5 md:gap-7">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-800">칭찬 하루</h2>
          <div className="flex flex-wrap gap-x-5 gap-y-3 md:gap-x-8 lg:gap-x-12.5">
            {Array(10).fill(null).map((_, i) => {
              const style = i < history.length
                ? getTodayStyle(history[i])
                : { btn: 'bg-white border-gray-300', icon: 'text-gray-300' };
              return (
                <div
                  key={i}
                  className={`h-25 w-sticker rounded-full flex items-center justify-center transition-all duration-300 border-[3px] ${style.btn}`}
                >
                  <FontAwesomeIcon
                    icon={faAward}
                    className={`text-4.5xl transition-colors duration-300 ${style.icon}`}
                  />
                </div>
              );
            })}
          </div>
        </section>

        {/* ── 케어루 섹션 ── */}
        <section className="flex flex-col gap-5 md:gap-7 bg-primary-100 rounded-3xl px-4 py-6 md:px-6 md:py-8 lg:px-10 lg:py-10">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-gray-800">케어루</h2>

          {/* 2-column 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-7">

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
              <div className="flex flex-col sm:flex-row gap-1.5 items-stretch">
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
                <div className="bg-green-100 border border-green-600 rounded-3xl px-3.5 py-6 flex flex-col justify-center shadow-sm w-full sm:w-56 sm:shrink-0">
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
              <div className="bg-white rounded-3xl px-5 py-6 md:px-8 md:py-10 shadow-sm flex flex-col gap-5 md:gap-8">
                <span className="text-base md:text-xl font-bold text-gray-700">루와의 미션</span>
                <ul className="flex flex-col gap-3 md:gap-4">
                  {missions.map(m => (
                    <li key={m.id} className="flex items-center gap-2.75">
                      <FontAwesomeIcon
                        icon={faCircleCheck}
                        onClick={() => toggleMission(m.id)}
                        className={`text-lg md:text-xl shrink-0 cursor-pointer ${m.done ? 'text-gray-500' : 'text-secondary-500'}`}
                      />
                      {isEditing ? (
                        <input
                          value={m.text}
                          onChange={e => setMissions(prev => prev.map(x => x.id === m.id ? { ...x, text: e.target.value } : x))}
                          className="flex-1 text-sm md:text-xl leading-6 md:leading-7 text-gray-800 bg-gray-50 border border-gray-300 rounded-xl px-3 py-1 outline-none focus:border-primary-500 transition-colors"
                        />
                      ) : (
                        <span className={`text-sm md:text-xl leading-6 md:leading-7 ${m.done ? 'text-gray-500' : 'line-through text-gray-800'}`}>
                          {m.text}
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>

              {/* 장르 차단 */}
              <div className="bg-white rounded-3xl px-5 py-6 md:px-10 md:py-10 shadow-sm flex flex-col gap-5 md:gap-6">
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
                        onClick={isEditing ? () => toggleGenre(g) : undefined}
                        disabled={!isEditing}
                        className={`flex items-center gap-1 px-4 py-2.5 rounded-full text-sm font-bold border transition-all duration-200
                          ${isBlocked
                            ? 'bg-secondary-100 border-secondary-500 text-secondary-500'
                            : 'bg-gray-50 border-gray-100 text-gray-500'
                          } ${!isEditing ? 'cursor-default' : ''}`}
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
                <button
                  onClick={() => setLimit(v => Math.max(LIMIT_MIN, v - LIMIT_STEP))}
                  disabled={!isEditing}
                  className={!isEditing ? 'cursor-default' : ''}
                >
                  <FontAwesomeIcon icon={faCircleMinus} className="text-xl text-gray-300" />
                </button>
                <div className="w-16 text-center">
                  <span className="text-2xl font-extrabold text-primary-500">{limit}</span>
                  <span className="text-xs font-semibold text-gray-300">분</span>
                </div>
                <button
                  onClick={() => setLimit(v => Math.min(LIMIT_MAX, v + LIMIT_STEP))}
                  disabled={!isEditing}
                  className={!isEditing ? 'cursor-default' : ''}
                >
                  <FontAwesomeIcon icon={faCirclePlus} className="text-xl text-primary-500" />
                </button>
              </div>
            </div>

            {/* 진행 바 */}
            <div className="flex flex-col gap-1.5">
              <div className="relative h-1.75 bg-gray-100 rounded-full overflow-hidden">
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

          {/* 케어루 수정하기 / 저장 버튼 */}
          <div className="flex items-center justify-between">
            {/* PIN 변경 버튼 */}
            <button
              onClick={() => setPinChangeOpen(true)}
              className="flex items-center gap-1.5 h-11 px-5 rounded-4xl border border-gray-200 text-sm font-bold text-gray-500 bg-white hover:bg-gray-50 transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faLock} className="text-sm" />
              부모님 PIN 변경
            </button>

            <button
              onClick={() => setIsEditing(v => !v)}
              className={`flex items-center justify-center gap-1 border rounded-4xl h-11 w-38.25 text-sm font-bold transition-colors duration-200
                ${isEditing
                  ? 'bg-primary-500 border-primary-500 text-white hover:bg-primary-400'
                  : 'bg-white border-primary-500 text-primary-800 hover:bg-primary-500 hover:text-white'
                }`}
            >
              <FontAwesomeIcon icon={faPencil} className="text-base" />
              {isEditing ? '저장 완료' : '케어루 수정하기'}
            </button>
          </div>

          {/* PIN 변경 모달 */}
          {pinChangeOpen && (
            <ChangePinModal onClose={() => setPinChangeOpen(false)} />
          )}
        </section>

      </main>

      <Footer />
    </div>
  );
}
