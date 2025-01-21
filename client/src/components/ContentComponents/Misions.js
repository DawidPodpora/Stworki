import React, { useEffect, useState } from "react";

function Misions({ data, creatureFightActiveButton }) {


  const initialTimes = [10, 50, 70, 90, 300];
  const [timeLeftTable, setTimeLeftTable] = useState(initialTimes);
  const [remainingTimes, setRemainingTimes] = useState([]);
  const [spiecesPhotos, setSpeciesPhoto] = useState(null);
  const [creaturesData, setCreaturesData] = useState(null);
  const [activeCreature, setActiveCreature] = useState(0);
  const [missionChoose, setMissionChoose] = useState(null);
  const [creaturesOnMission, setCreaturesOnMission] = useState([]);
  const [creaturesOnMissionPhotos, setCreaturesOnMissionPhotos] = useState([]);
  const [missionsFullTime, setMissionsFullTime] = useState([]);
  const [fightData, setFightData] = useState(null);
 

useEffect(() => {
  if (remainingTimes.length === 0) return; // Jeśli brak danych, nie uruchamiaj timera

  const timer = setInterval(() => {
    setRemainingTimes((prevTimes) =>
      prevTimes.map((time) => Math.max(time - 1, 0)) // Zmniejsz czas o 1 sekundę, ale nie poniżej 0
    );
  }, 1000);

  return () => clearInterval(timer); // Wyczyść timer przy odmontowaniu
}, [remainingTimes]);


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
      const response = await fetch('http://localhost:8080/api/missionsInfo', {
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
      const creaturesOnMission = data.creatures.filter(
        (creature) => creature.timeOfEndOfMission !== null
      );
      setCreaturesOnMission(creaturesOnMission);
      const photosOnMission = data.creatures.reduce((result, creature, index) => {
        if (creature.timeOfEndOfMission !== null) {
          result.push(data.speciesPhotos[index]); // Dodaj zdjęcie odpowiadające indeksowi stworka
        }
        return result;
      }, []);
      console.log(creaturesOnMission);
      setCreaturesOnMissionPhotos(photosOnMission);
      const times = creaturesOnMission.map((creature) => {
        const endTime = new Date(creature.timeOfEndOfMission);
        const currentTime = new Date();
        const diffInSeconds = Math.max(Math.floor((endTime - currentTime) / 1000), 0); // Pozostały czas w sekundach
        return diffInSeconds;
      });
      console.log(times,"times");
      setRemainingTimes(times);
      const activeMissionTimes = creaturesOnMission.flatMap((creature) =>
        creature.misions
          .filter((mission) => mission.isThisMissionActive) // Filtruj tylko aktywne misje
          .map((mission) => mission.timeOfMission)         // Pobierz timeOfMission
      );
      
      console.log(activeMissionTimes, "Czasy aktywnych misji");
      setMissionsFullTime(activeMissionTimes);
    

  } catch (error) {
      console.error('Błąd podczas pobierania danych użytkownika:', error);
  }
  }

  const ClaimMission = async (creatureId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn('Brak tokenu w localStorage');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/ClaimMission?creatureId=${creatureId}`, {
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
        console.log(data);
        if (response.bonusMessage) {
          alert(response.bonusMessage);
      }
        return data;
        
    } catch (error) {
        console.error('Błąd podczas pobierania danych użytkownika:', error);
    }
  };


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
        console.log(missionId,"DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD");
        const response = await fetch(`http://localhost:8080/api/SendOnMission?missionId=${missionId}&creatureId=${creatureId} `, {
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

  const claimMissionClick = async(creature) =>{
    const creatureId = creature._id;
    
    await ClaimMission(creatureId).then((response)=>{
      creatureFightActiveButton(response);
    })
    await fetchData();

  }
  const placeForMissions = Array(6).fill("");
  const missions = Array(3).fill("");
  return (
    <div className="absolute w-full bg-black1 h-screen text-maincolor4">
    {creaturesData && spiecesPhotos?(
      <div>
      {placeForMissions.map((_, index) => (
        <div
          key={index} // Dodanie klucza
          className="w-[55vw] bg-gradient-to-r from-black to-maincolor1 h-[15vh] m-[1.5vh] rounded-3xl p-[1vh] border-2 border-maincolor2"
        >
          {creaturesOnMission[index] ?(

          
          <div className="w-full h-full bg-gradient-to-r from-maincolor1 to-black border border-maincolor1 rounded-3xl border-1 flex items-center justify-between px-4">
            
            <div className="ml-[1vh] mr-[3vh] w-[10vh] h-[10vh] rounded-full">
              <img src={`images/${creaturesOnMissionPhotos[index][0]}.png`} className="rounded-full" alt="Mission" />
            </div>
            <div className="bg-gradient-to-r from-black to-maincolor5 w-4/5 h-2/5  rounded border-maincolor4 border-4 relative">
              <div
                className={`h-full bg-maincolor1 absolute right-0  border-maincolor4 `}
                style={{ width: `${(remainingTimes[index] / (missionsFullTime[index]*60)) * 100 }%` }}
              ></div>
            </div>
            {remainingTimes[index] / (missionsFullTime[index]*60) > 0 ?
            (<div className="text-white ml-auto text-[1.5vw] w-[6vh] ml-[3vh]">{formatTime(remainingTimes[index])}</div>):(
            <div className=" w-[6vh] h-[3vh] ml-[3vh]"><button onClick={()=>claimMissionClick(creaturesOnMission[index])} className="bg-gradient-to-r from-maincolor3 to-maincolor5 w-full h-[4vh] rounded-2xl text-black font-extrabold border-2">CLAIM</button></div>) 
            }
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
              <div onClick={()=>changeCreature(index)}>
                {!creaturesData[index].timeOfEndOfMission ?(
                <img src={`images/${spiecesPhotos[index][0]}.png`}className={`rounded-2xl ${activeCreature === index? "border-8 border-maincolor5":""}`}></img>
                ):(<img src={`images/${spiecesPhotos[index][0]}.png`} className={`rounded-2xl grayscale ${activeCreature === index? "border-8 border-black":""}`}></img>)}
                </div>):(<div></div>)
              }
            </div>
          </div>
          )
          )
          }
        </div>
      </div>
        <div className="w-[22vw] h-[45vh] bg-maincolor1 absolute right-0 bottom-0 m-[1vw] rounded-3xl ">
          <div className="h-[5vh] m-[1.5vh] rounded-lg border-4 border-black flex items-center justify-center bg-gradient-to-r from-maincolor5 via-black to-maincolor2 relative"><span className="z-10">{creaturesData[activeCreature].energy}</span><div className="h-full bg-maincolor1 rounded-sm absolute top-0 right-0 z-0" style={{ width: `${100 - creaturesData[activeCreature].energy}%` }}></div></div>
            {!creaturesData[activeCreature].timeOfEndOfMission ? (<div>
            {missions.map((_,index)=>(
              <div className={`h-[9vh] m-[1.5vh] p-2 rounded-3xl ${missionChoose === index?"bg-gradient-to-r from-maincolor4 to-maincolor5":"bg-gradient-to-r from-black to-maincolor5"}`} onClick={()=>changedMission(index)}>
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
          </div>):(<div className="ml-[2vh] mt-[12vh] w-[35vh] h-[6vh] bg-maincolor5 flex items-center justify-center text-black font-extrabold text-[3vh] rounded-xl">IS ON MISSION</div>)}
          </div>
          </div>):(<div>LOADING</div>)}
    </div>
  );
}

export default Misions;