import React, { useEffect, useState } from "react";

function Misions({ data }) {
  const initialTimes = [10, 50, 70, 90, 110];
  const [timeLeftTable, setTimeLeftTable] = useState(initialTimes);

  useEffect(() => {
    const timers = timeLeftTable.map((time, index) => {
      if (time > 0) {
        return setInterval(() => {
          setTimeLeftTable((prev) => {
            const newTimeLeft = [...prev];
            newTimeLeft[index] = Math.max(newTimeLeft[index] - 1, 0); // Uniknięcie ujemnych wartości
            return newTimeLeft;
          });
        }, 1000);
      }
      return null;
    });

    // Wyczyść timery po odmontowaniu komponentu
    return () => timers.forEach((timer) => timer && clearInterval(timer));
  }, []); // Efekt uruchamia się tylko raz przy montowaniu

  // Formatowanie czasu w minutach i sekundach
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const placeForMissions = Array(6).fill("");
  return (
    <div className="absolute w-full bg-black1 h-screen text-maincolor4">
      {placeForMissions.map((_, index) => (
        <div
          key={index} // Dodanie klucza
          className="w-[65vw] bg-black h-[15vh] m-[1.5vh] rounded-3xl border-2 border-maincolor1 border-[1vh]"
        >
          {initialTimes[index] &&(

          
          <div className="w-full h-full bg-maincolor1 border border-black rounded-3xl border-[1vh] flex items-center justify-between px-4">
            
            <div className="ml-[1vh] mr-[3vh] w-[10vh] h-[10vh] rounded-full">
              <img src="images/water1-3.png" className="rounded-full" alt="Mission" />
            </div>
            <div className="bg-gradient-to-r from-maincolor2 to-maincolor5 w-4/5 h-2/5 rounded-full relative">
              <div
                className="h-full bg-maincolor1 absolute right-0"
                style={{ width: `${(timeLeftTable[index] / initialTimes[index]) * 100}%` }}
              ></div>
            </div>
            <div className="text-white ml-auto text-3xl ml-[3vh]">{formatTime(timeLeftTable[index])}</div>
          </div>
)}
        </div>
      ))}
    </div>
  );
}

export default Misions;