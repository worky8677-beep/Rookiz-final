import { createContext, useContext, useState } from "react";
import { faLeaf, faTree } from "@fortawesome/free-solid-svg-icons";

export function getZoneInfo(age) {
  const n = Number(age);
  if (n >= 4 && n <= 7)  return { zone: '키즈 4~7세',   level: 1, icon: faLeaf, iconCls: 'text-green-500', zoneCls: 'text-green-600' };
  if (n >= 8 && n <= 12) return { zone: '주니어 8~12세', level: 2, icon: faTree, iconCls: 'text-blue-400',  zoneCls: 'text-blue-500'  };
  return                        { zone: `${age}세`,      level: 1, icon: faLeaf, iconCls: 'text-green-500', zoneCls: 'text-green-600' };
}

const INIT_PROFILES = [
  { id: 1, age: 5,  name: '최승아', photo: null, ...getZoneInfo(5)  },
  { id: 2, age: 10, name: '박서윤', photo: null, ...getZoneInfo(10) },
];

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const [profiles, setProfiles] = useState(INIT_PROFILES);
  const [activeId, setActiveId] = useState(INIT_PROFILES[0].id);

  const activeProfile = profiles.find(p => p.id === activeId) ?? profiles[0];

  return (
    <ProfileContext.Provider value={{ profiles, setProfiles, activeId, setActiveId, activeProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  return useContext(ProfileContext);
}
