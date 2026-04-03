import { twMerge } from 'tailwind-merge';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faMicrophone } from '@fortawesome/free-solid-svg-icons';

/** 검색바 컴포넌트 */
export function Searchbar({ placeholder = "제목, 장르, 캐릭터 검색...", onSearch, className }) {
  return (
    <div 
      className={twMerge(
        'w-full h-14 md:h-20 bg-white border-2 md:border-4 border-primary-500 rounded-2xl md:rounded-3xl flex items-center px-4 md:px-8 gap-3 md:gap-4 shadow-sm',
        className
      )}
    >
      <FontAwesomeIcon icon={faMagnifyingGlass} className="text-lg md:text-2xl text-gray-700" />
      <input 
        type="text" 
        placeholder={placeholder}
        className="flex-1 text-base md:text-xl font-medium text-gray-700 outline-none placeholder:text-gray-300 bg-transparent"
        onChange={(e) => onSearch?.(e.target.value)}
      />
      <button className="p-2 text-gray-700 hover:text-primary-500 transition-colors cursor-pointer">
        <FontAwesomeIcon icon={faMicrophone} className="text-lg md:text-2xl" />
      </button>
    </div>
  );
}
