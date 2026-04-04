import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { twMerge } from 'tailwind-merge';
import { useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse, faHeart, faCircleUser, faMagnifyingGlass,
  faBell, faLeaf, faChevronDown, faChevronUp, faUser,
  faArrowRightFromBracket, faTree, faPlus, faLock, faCamera, faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { useProfile, getZoneInfo } from '../context/ProfileContext';

const PIN_KEY = 'rookiz_parent_pin';
const getPin = () => localStorage.getItem(PIN_KEY) ?? '1234';

/* ── PIN 인증 모달 ── */
function PinModal({ onSuccess, onCancel }) {
  const [digits, setDigits] = useState(['', '', '', '']);
  const [error, setError]   = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => { inputRefs.current[0]?.focus(); }, []);

  function handleChange(idx, val) {
    const d = val.replace(/\D/g, '').slice(-1);
    const next = digits.map((v, i) => i === idx ? d : v);
    setDigits(next);
    setError(false);
    if (d && idx < 3) inputRefs.current[idx + 1]?.focus();
    if (next.every(v => v)) {
      const pin = next.join('');
      if (pin === getPin()) {
        onSuccess();
      } else {
        setError(true);
        setTimeout(() => {
          setDigits(['', '', '', '']);
          setError(false);
          inputRefs.current[0]?.focus();
        }, 700);
      }
    }
  }

  function handleKeyDown(idx, e) {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-3xl w-full max-w-xs px-8 py-10 flex flex-col gap-7 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-xl font-extrabold text-gray-800">부모님 인증</span>
          <button onClick={onCancel}>
            <FontAwesomeIcon icon={faXmark} className="text-xl text-gray-400 hover:text-gray-700" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-2">
          <div className="size-12 rounded-full bg-primary-100 flex items-center justify-center">
            <FontAwesomeIcon icon={faLock} className="text-primary-500 text-xl" />
          </div>
          <p className="text-sm font-semibold text-gray-500 text-center">
            연령이 높은 프로필로 전환하려면<br />부모님 PIN 번호가 필요해요
          </p>
        </div>

        {/* PIN 4자리 입력 */}
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
            PIN 번호가 올바르지 않아요
          </p>
        )}

        <p className="text-xs text-gray-300 text-center -mt-3">기본 PIN: 1234</p>
      </div>
    </div>,
    document.body
  );
}

/* ── 프로필 추가 모달 ── */
function AddProfileModal({ onAdd, onCancel }) {
  const [name, setName]   = useState('');
  const [age, setAge]     = useState('');
  const [photo, setPhoto] = useState(null);
  const fileRef = useRef(null);

  function handlePhoto(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(URL.createObjectURL(file));
  }

  function submit() {
    if (!name.trim() || !age) return;
    onAdd({ id: Date.now(), name: name.trim(), age: Number(age), photo, ...getZoneInfo(age) });
  }

  const valid = name.trim() && age;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 px-4">
      <div className="bg-white rounded-3xl w-full max-w-sm px-8 py-10 flex flex-col gap-6 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-2xl font-extrabold text-gray-800">프로필 추가</span>
          <button onClick={onCancel}>
            <FontAwesomeIcon icon={faXmark} className="text-xl text-gray-400 hover:text-gray-700" />
          </button>
        </div>

        {/* 사진 */}
        <div className="flex flex-col items-center gap-2">
          <button
            onClick={() => fileRef.current?.click()}
            className="relative size-25 rounded-[27px] bg-gray-100 flex items-center justify-center overflow-hidden group"
          >
            {photo
              ? <img src={photo} alt="프로필" className="size-full object-cover" />
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
            value={name}
            onChange={e => setName(e.target.value)}
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
            value={age}
            onChange={e => setAge(e.target.value)}
            className="border border-gray-200 rounded-2xl px-4 h-12 text-base text-gray-800 outline-none focus:border-primary-500 transition-colors"
            placeholder="나이를 입력하세요"
          />
          {age && (
            <span className="text-xs text-primary-500 font-semibold">{getZoneInfo(age).zone}</span>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 h-12 rounded-4xl border border-gray-200 text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors"
          >
            취소
          </button>
          <button
            onClick={submit}
            disabled={!valid}
            className="flex-1 h-12 rounded-4xl bg-primary-500 text-sm font-bold text-white hover:bg-primary-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            추가
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

/* ── 드롭다운 프로필 항목 ── */
function ProfileItem({ profile, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        'flex items-center gap-2 w-full h-11 px-2.5 rounded-full transition-colors text-left',
        active ? 'bg-gray-100' : 'hover:bg-gray-100'
      )}
    >
      <div className="size-6 bg-primary-200 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
        {profile.photo
          ? <img src={profile.photo} alt={profile.name} className="size-full object-cover" />
          : <FontAwesomeIcon icon={faUser} className="text-xs text-primary-700" />
        }
      </div>
      <div className="flex flex-col items-start leading-tight min-w-0">
        <div className="flex items-center gap-1">
          <span className="text-sm font-bold text-gray-700 whitespace-nowrap">{profile.name}</span>
          <FontAwesomeIcon icon={profile.icon} className={`text-xs ${profile.iconCls}`} />
        </div>
        <span className={`text-xs font-bold whitespace-nowrap ${profile.zoneCls}`}>{profile.zone}</span>
      </div>
      {active && (
        <FontAwesomeIcon icon={faChevronUp} className="text-xs text-gray-400 ml-auto shrink-0" />
      )}
    </button>
  );
}

/* ── NavButton / IconBtn ── */
function NavButton({ icon, label, active = false, onClick }) {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        'flex flex-col items-center justify-center size-18 md:size-20 rounded-2xl md:rounded-3xl transition-all duration-200 cursor-pointer gap-1',
        active ? 'bg-primary-500' : 'bg-gray-50 hover:bg-gray-100'
      )}
    >
      <FontAwesomeIcon
        icon={icon}
        className={twMerge('text-2xl md:text-3xl', active ? 'text-primary-950' : 'text-gray-300')}
      />
      <span className={twMerge('text-xs font-semibold leading-tight', active ? 'text-primary-950' : 'text-gray-300')}>
        {label}
      </span>
    </button>
  );
}

function IconBtn({ icon, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="size-9.5 bg-gray-50 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors relative"
    >
      <FontAwesomeIcon icon={icon} className="text-lg text-gray-400" />
      {children}
    </button>
  );
}

/* ── NavProfile (드롭다운 + 모달 포함) ── */
function NavProfile() {
  const { profiles, setProfiles, activeId, setActiveId, activeProfile } = useProfile();
  const [open, setOpen]               = useState(false);
  const [pinTargetId, setPinTargetId] = useState(null);
  const [addOpen, setAddOpen]         = useState(false);
  const dropRef = useRef(null);

  const pinTarget = pinTargetId != null ? (profiles.find(p => p.id === pinTargetId) ?? null) : null;

  /* 외부 클릭 시 드롭다운 닫기 */
  useEffect(() => {
    if (!open) return;
    function onOutside(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [open]);

  function handleSelectProfile(target) {
    if (target.id === activeId) { setOpen(false); return; }
    /* 연령 제한이 높은 프로필 → PIN 필요 */
    if (target.level > (activeProfile?.level ?? 0)) {
      setOpen(false);
      setPinTargetId(target.id);
    } else {
      setActiveId(target.id);
      setOpen(false);
    }
  }

  function handlePinSuccess() {
    if (pinTargetId != null) setActiveId(pinTargetId);
    setPinTargetId(null);
  }

  function handleAddProfile(newProfile) {
    setProfiles(prev => [...prev, newProfile]);
    setAddOpen(false);
  }

  return (
    <>
      {/* PIN 모달 */}
      {pinTarget != null && (
        <PinModal
          onSuccess={handlePinSuccess}
          onCancel={() => setPinTargetId(null)}
        />
      )}

      {/* 프로필 추가 모달 */}
      {addOpen && (
        <AddProfileModal
          onAdd={handleAddProfile}
          onCancel={() => setAddOpen(false)}
        />
      )}

      <div ref={dropRef} className="relative ml-1">
        {/* 트리거 버튼 */}
        <button
          onClick={() => setOpen(v => !v)}
          className="flex items-center h-11 w-fit md:w-37.5 bg-gray-50 rounded-full px-2.5 gap-2 hover:bg-gray-100 transition-colors cursor-pointer border-none outline-none"
        >
          <div className="size-6 bg-primary-200 rounded-full flex items-center justify-center shrink-0 overflow-hidden">
            {activeProfile.photo
              ? <img src={activeProfile.photo} alt={activeProfile.name} className="size-full object-cover" />
              : <FontAwesomeIcon icon={faUser} className="text-sm text-primary-700" />
            }
          </div>
          <div className="hidden md:flex flex-col items-start leading-tight overflow-hidden text-left">
            <div className="flex items-center gap-1">
              <span className="text-sm font-bold text-gray-700 whitespace-nowrap">{activeProfile.name}</span>
              <FontAwesomeIcon icon={activeProfile.icon} className={`text-sm ${activeProfile.iconCls}`} />
            </div>
            <span className={`text-xs font-bold whitespace-nowrap ${activeProfile.zoneCls}`}>{activeProfile.zone}</span>
          </div>
          <div className="ml-auto hidden md:block">
            <FontAwesomeIcon
              icon={open ? faChevronUp : faChevronDown}
              className="text-xs text-gray-400 transition-transform duration-200"
            />
          </div>
        </button>

        {/* 드롭다운 */}
        {open && (
          <div className="absolute right-0 top-[calc(100%+8px)] bg-white rounded-3xl shadow-lg border border-gray-100 py-2 px-2 w-44 flex flex-col gap-0.5 z-50">

            {/* 프로필 목록 */}
            {profiles.map(p => (
              <ProfileItem
                key={p.id}
                profile={p}
                active={p.id === activeId}
                onClick={() => handleSelectProfile(p)}
              />
            ))}

            {/* 프로필 추가 */}
            <button
              onClick={() => { setOpen(false); setAddOpen(true); }}
              className="flex items-center gap-2 w-full h-11 px-2.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <div className="size-6 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                <FontAwesomeIcon icon={faPlus} className="text-xs text-gray-400" />
              </div>
              <span className="text-sm font-bold text-gray-400">프로필 추가</span>
            </button>

            {/* 구분선 */}
            <div className="mx-2 my-1 h-px bg-gray-100" />

            {/* 로그아웃 */}
            <button className="flex items-center justify-center gap-2 h-11 px-2.5 rounded-full hover:bg-gray-50 transition-colors w-full">
              <span className="text-sm font-bold text-gray-700">로그아웃</span>
              <FontAwesomeIcon icon={faArrowRightFromBracket} className="text-base text-gray-500" />
            </button>
          </div>
        )}
      </div>
    </>
  );
}

/* ── Nav ── */
export function Nav({ activeTab = "main" }) {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 w-full h-20 md:h-30 bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-center px-4 md:px-10">
      <div className="w-full max-w-content grid grid-cols-3 items-center">

        <div className="flex items-center select-none cursor-pointer" onClick={() => navigate('/home')}>
          <img src="/LOGO.svg" alt="ROOKIZ" className="h-8 md:h-16 w-auto" />
        </div>

        <div className="flex items-center justify-center gap-2 md:gap-4">
          <NavButton icon={faHouse}       label="메인"       active={activeTab === "main"}   onClick={() => navigate('/home')}   />
          <NavButton icon={faHeart}       label="내 친구 루" active={activeTab === "airon"}  onClick={() => navigate('/airon')}  />
          <NavButton icon={faCircleUser}  label="마이 페이지" active={activeTab === "mypage"} onClick={() => navigate('/mypage')} />
        </div>

        <div className="flex items-center justify-end gap-1">
          <IconBtn icon={faMagnifyingGlass} onClick={() => navigate('/search')} />
          <IconBtn icon={faBell}>
            <div className="absolute top-[9px] right-[9px] size-2 bg-secondary-400 rounded-full" />
          </IconBtn>
          <NavProfile />
        </div>

      </div>
    </nav>
  );
}
