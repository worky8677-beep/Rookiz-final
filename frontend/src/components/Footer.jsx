import { twMerge } from 'tailwind-merge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShield, faMedal, faGlobe, faHeadset } from '@fortawesome/free-solid-svg-icons';

const LINKS = ["이용약관", "개인정보처리방침", "자녀 보호 설정", "고객센터"];
const SOCIAL_ICONS = [faGlobe, faHeadset];

export function Footer({ className }) {
  return (
    <footer className={twMerge("w-full bg-gray-50", className)}>
      <div className="max-w-container mx-auto px-6 md:px-10 py-6 md:py-0 md:h-43 flex flex-col md:flex-row md:items-center gap-6 md:gap-0 md:justify-between">
        {/* 로고 & 저작권 */}
        <div className="flex flex-col gap-2 shrink-0">
          <div className="py-0 md:py-7">
            <img src="/LOGO.svg" alt="ROOKIZ" className="h-8 md:h-12 w-auto" />
          </div>
          <p className="text-xs text-gray-400">© 2026 Rookiz AI. The Guided Playground.</p>
        </div>

        {/* 인증 칩 & 설명 */}
        <div className="flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="bg-blue-100 border border-blue-600 px-3 py-1.5 rounded-full text-blue-600 text-sm font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faShield} className="text-base" />
              안전 인증
            </div>
            <div className="bg-secondary-100 border border-secondary-500 px-3 py-1.5 rounded-full text-secondary-500 text-sm font-bold flex items-center gap-2">
              <FontAwesomeIcon icon={faMedal} className="text-base" />
              우수 콘텐츠
            </div>
          </div>
          <div className="text-sm text-gray-400 leading-5 font-medium">
            <p>만 3-12세 어린이를 위한</p>
            <p>안전하고 즐거운 콘텐츠 플랫폼입니다.</p>
          </div>
        </div>

        {/* 링크 */}
        <div className="flex flex-wrap gap-x-8 gap-y-2 md:gap-12">
          {LINKS.map((label) => (
            <a key={label} href="#" className="text-sm text-gray-400 font-medium hover:text-gray-600">
              {label}
            </a>
          ))}
        </div>

        {/* 소셜 아이콘 */}
        <div className="flex gap-4 shrink-0">
          {SOCIAL_ICONS.map((icon, i) => (
            <button key={i} className="size-9.5 bg-white rounded-full flex items-center justify-center text-gray-400 shadow-sm hover:text-gray-600 transition-colors">
              <FontAwesomeIcon icon={icon} className="text-lg" />
            </button>
          ))}
        </div>
      </div>
    </footer>
  );
}
