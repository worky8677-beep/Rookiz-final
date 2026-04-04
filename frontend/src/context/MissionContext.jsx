import { createContext, useContext, useState } from "react";

const MissionContext = createContext(null);

const TODAY      = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
const LS_DATE    = "mission_saved_date";
const LS_HISTORY = "mission_history"; // 날별 완료 미션 수 배열 ex) [4,4,3,4]

function loadHistory() {
  try { return JSON.parse(localStorage.getItem(LS_HISTORY) ?? "[4,4,4,4]"); }
  catch { return [4, 4, 4, 4]; }
}

export function MissionProvider({ children }) {
  const [history, setHistory]     = useState(loadHistory);
  const [savedToday, setSavedToday] = useState(
    () => localStorage.getItem(LS_DATE) === TODAY
  );

  function saveMissions(set) {
    const next = [...loadHistory(), set.size];
    localStorage.setItem(LS_DATE, TODAY);
    localStorage.setItem(LS_HISTORY, JSON.stringify(next));
    setHistory(next);
    setSavedToday(true);
  }

  return (
    <MissionContext.Provider value={{ history, saveMissions, savedToday }}>
      {children}
    </MissionContext.Provider>
  );
}

export function useMission() {
  return useContext(MissionContext);
}
