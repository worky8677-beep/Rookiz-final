import { twMerge } from 'tailwind-merge';
import { Link, useNavigate } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHouse, faHeart, faCircleUser, faMagnifyingGlass,
  faBell, faLeaf, faChevronDown, faUser
} from '@fortawesome/free-solid-svg-icons';

const DEFAULT_NAME = "최승아";
const DEFAULT_ZONE = "키즈존 4~7세";

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
        className={twMerge(
          'text-2xl md:text-3xl',
          active ? 'text-primary-950' : 'text-gray-300'
        )}
      />
      <span className={twMerge(
        'text-xs md:text-xs font-semibold leading-tight',
        active ? 'text-primary-950' : 'text-gray-300'
      )}>
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

function NavProfile({ name = DEFAULT_NAME, zone = DEFAULT_ZONE }) {
  return (
    <button className="flex items-center h-11 w-fit md:w-[150px] bg-gray-50 rounded-full px-2.5 gap-2 hover:bg-gray-100 transition-colors cursor-pointer border-none outline-none">
      <div className="size-6 bg-primary-200 rounded-full flex items-center justify-center shrink-0">
        <FontAwesomeIcon icon={faUser} className="text-sm text-primary-700" />
      </div>
      <div className="hidden md:flex flex-col items-start leading-tight overflow-hidden text-left">
        <div className="flex items-center gap-1">
          <span className="text-sm font-bold text-gray-700 whitespace-nowrap">{name}</span>
          <FontAwesomeIcon icon={faLeaf} className="text-sm text-green-500" />
        </div>
        <span className="text-xs font-bold text-green-600 whitespace-nowrap">{zone}</span>
      </div>
      <div className="ml-auto hidden md:block">
        <FontAwesomeIcon icon={faChevronDown} className="text-sm text-gray-400" />
      </div>
    </button>
  );
}

export function Nav({ activeTab = "main" }) {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 w-full h-20 md:h-30 bg-white/80 backdrop-blur-md shadow-sm flex items-center justify-center px-4 md:px-10">
      <div className="w-full max-w-content grid grid-cols-3 items-center">

        {/* 좌측: 로고 */}
        <Link to="/home" className="flex items-center select-none">
          <img src="/LOGO.svg" alt="ROOKIZ" className="h-8 md:h-16 w-auto" />
        </Link>

        {/* 중앙: 네비게이션 */}
        <div className="flex items-center justify-center gap-2 md:gap-4">
          <NavButton
            icon={faHouse}
            label="메인"
            active={activeTab === "main"}
            onClick={() => navigate('/home')}
          />
          <NavButton
            icon={faHeart}
            label="내 친구 루"
            active={activeTab === "airon"}
            onClick={() => navigate('/airon')}
          />
          <NavButton
            icon={faCircleUser}
            label="마이 페이지"
            active={activeTab === "mypage"}
            onClick={() => navigate('/mypage')}
          />
        </div>

        {/* 우측: 액션 */}
        <div className="flex items-center justify-end gap-1">
          <IconBtn icon={faMagnifyingGlass} onClick={() => navigate('/search')} />
          <IconBtn icon={faBell}>
            <div className="absolute top-[9px] right-[9px] size-2 bg-secondary-400 rounded-full" />
          </IconBtn>
          <div className="ml-1">
            <NavProfile />
          </div>
        </div>

      </div>
    </nav>
  );
}
