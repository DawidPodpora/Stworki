import React, { useEffect, useState } from "react";

function Misions({ data }) {


  const initialTimes = [10, 50, 70, 90, 300];
  const [timeLeftTable, setTimeLeftTable] = useState(initialTimes);
  const [spiecesPhotos, setSpeciesPhoto] = useState(null);
  const [creaturesData, setCreaturesData] = useState(null);
  const [activeCreature, setActiveCreature] = useState(0);
  const [missionChoose, setMissionChoose] = useState(null);
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


  useEffect(()=>{
    const loadData = async()=>{
      await fetchData();
      console.log(creaturesData);
      console.log(spiecesPhotos);
    };
    loadData();
  },[]);
  const fetchData = async()=>{
    const token = localStorage.getItem('token'); // Pobranie tokena z localStorage
    if (!token) {
        console.warn('Brak tokenu w localStorage');
        return;
    }
    try {
      const response = await fetch('http://localhost:8080/api/missionsInfo ', {
          method: 'GET',
          headers: {
              'Authorization': `Bearer ${token}`, // Wysłanie tokena w nagłówku
          },
      });

      if (!response.ok) {
          console.error('Błąd pobierania danych użytkownika:', response.statusText);
          return;
      }
      
      const data = await response.json();
      console.log(data);
      setSpeciesPhoto(data.speciesPhotos)
      setCreaturesData(data.creatures);
  } catch (error) {
      console.error('Błąd podczas pobierania danych użytkownika:', error);
  }
  }




  // Formatowanie czasu w minutach i sekundach
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };
  const sendCreatureOnMission = async(creature, mission)=>
  {
    const token = localStorage.getItem('token');
      if (!token) {
          console.warn('Brak tokenu w localStorage');
          return;
      }
      try {
        if(!creature)
        {
          console.warn('Creature not choosed');
          return;
        }
        if(!mission)
          {
            console.warn('Mission not choosed');
            return;
          }
        const creatureId = creature._id;
        const missionId = mission._id; 
        const response = await fetch(`http://localhost:8080/api/SendOnMission?missionId${missionId}&creatureId=${creatureId} `, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error('Błąd pobierania danych urzytkownika:', response.statusText);
            return;
        }
        const data = await response.json();
        
    } catch (error) {
        console.error('Błąd podczas pobierania danych użytkownika:', error);
    }
  }
  const changeCreature = (number)=>{
    setActiveCreature(number);
    setMissionChoose(null);
  }
  const changedMission = (number)=>{
    setMissionChoose(number);
  }
  const acceptMissionClick = async(creature) =>{
    const mission = creature.misions[missionChoose];
    console.log(mission,"AAAAAAAAAAAAAAAAAAAAAAAA");
    await sendCreatureOnMission(creature, mission);
    await fetchData();
  }
  const placeForMissions = Array(6).fill("");
  const missions = Array(3).fill("");
  return (
    <div className="absolute w-full bg-black1 h-screen text-maincolor4">
    {creaturesData && spiecesPhotos?(
      <>
      {placeForMissions.map((_, index) => (
        <div
          key={index} // Dodanie klucza
          className="w-[55vw] bg-gradient-to-r from-black to-maincolor1 h-[15vh] m-[1.5vh] rounded-3xl p-[1vh] border-2 border-maincolor2"
        >
          {initialTimes[index] ?(

          
          <div className="w-full h-full bg-gradient-to-r from-maincolor1 to-black border border-maincolor1 rounded-3xl border-1 flex items-center justify-between px-4">
            
            <div className="ml-[1vh] mr-[3vh] w-[10vh] h-[10vh] rounded-full">
              <img src="images/water1-3.png" className="rounded-full" alt="Mission" />
            </div>
            <div className="bg-gradient-to-r from-black to-maincolor5 w-4/5 h-2/5  rounded border-maincolor4 border-4 relative">
              <div
                className={`h-full bg-maincolor1 absolute right-0  border-maincolor4 `}
                style={{ width: `${(timeLeftTable[index] / initialTimes[index]) * 100 }%` }}
              ></div>
            </div>
            <div className="text-white ml-auto text-[1.5vw] w-[6vh] ml-[3vh]">{formatTime(timeLeftTable[index])}</div>
          </div>
):(<div></div>)}
        </div>
      ))}
      <div className="w-[22vw] h-[50vh] bg-maincolor1 absolute right-0 top-0 m-[1vw] rounded-3xl p-[1vw]">
        <div className="w-full h-full flex grid grid-cols-2 grid-rows-3 gap-[1vw]">
          {placeForMissions.map((_,index) => (
          <div className=" grid place-items-center  ">
            <div className="relative h-[14vh] aspect-square bg-maincolor1 rounded-2xl outline outline-4 outline-maincolor4">
              {creaturesData[index]?(
              <div onClick={()=>changeCreature(index)}><img src={`images/${spiecesPhotos[index][0]}.png`}
                                                                   className={`rounded-2xl ${activeCreature === index? "border-4 border-maincolor5":""}`}></img></div>):(<div></div>)
              }
            </div>
          </div>
          )
          )
          }
        </div>
      </div>
        <div className="w-[22vw] h-[45vh] bg-maincolor1 absolute right-0 bottom-0 m-[1vw] rounded-3xl ">
            {missions.map((_,index)=>(
              <div className={`w-[22] h-[11vh] m-[1.5vh] p-2 rounded-3xl ${missionChoose === index?"bg-gradient-to-r from-maincolor4 to-maincolor5":"bg-gradient-to-r from-black to-maincolor5"}`} onClick={()=>changedMission(index)}>
                <div className="w-full h-full bg-maincolor1 rounded-2xl p-[0.5vw] relative">
                  <div className="absolute right-0 bottom-1"><img src="images/money.png" className="w-[2vw]"></img>{creaturesData[activeCreature].misions[index].goldForMission}</div>
                  <div className="absolute left-1 bottom-1"><img src="images/experience.png" className="w-[2vw]"></img>{creaturesData[activeCreature].misions[index].expForMission}</div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xl font-extrabold"><p>{creaturesData[activeCreature].misions[index].timeOfMission} MINUTES</p></div>
                </div>
              </div>
            ))}
          <div className="w-full h-[4vh] flex justify-center items-center">
            <button onClick={()=>acceptMissionClick(creaturesData[activeCreature])} className="w-[6vw] h-[4vh] bg-gradient-to-r from-maincolor2 to-maincolor5 text-black text-2xl font-extrabold rounded-3xl border-2 border-maincolor4 hover:text-maincolor4">ACCEPT</button>
          </div>
          </div>
          </>):(<div>LOADING</div>)}
    </div>
  );
}

export default Misions;