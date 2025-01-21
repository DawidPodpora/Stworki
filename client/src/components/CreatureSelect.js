import React, { useEffect, useState } from "react";

function CreatureSelect({enemyName, enemyCreatureToFightId}){
    const [speciesPhotosUser, setSpeciesPhotosUser] = useState(null);
    const [creaturesId, setCreaturesId] = useState([]);
    const [selectedCreture, setSelectedCreture] = useState(null);
    const FightStart = async (enemyName, enemyCreatureToFightId, UserCreatureId) =>{
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn('Brak tokenu w localStorage');
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:8080/api/CreaturesFightVsPlayer?enemyName=${enemyName}&enemyCreatureToFightId=${enemyCreatureToFightId}& UserCreatureId=${UserCreatureId}`, {
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
            console.log(data)
            setSpeciesPhotosUser(data.speciesPhotos);
            setCreaturesId(data.idOfCreatures);
            if (response.bonusMessage) {
              alert(response.bonusMessage);
          }
            return data;
            
        } catch (error) {
            console.error('Błąd podczas pobierania danych użytkownika:', error);
        }
    }

    const dataToUse = async ()=> {
        
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn('Brak tokenu w localStorage');
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:8080/api/CreaturesToFight`, {
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
            console.log(data)
            setSpeciesPhotosUser(data.speciesPhotos);
            setCreaturesId(data.idOfCreatures);
            if (response.bonusMessage) {
              alert(response.bonusMessage);
          }
            return data;
            
        } catch (error) {
            console.error('Błąd podczas pobierania danych użytkownika:', error);
        }
      };
      useEffect(()=>{
        const fetchDataEfect = async()=>{
            await dataToUse();
        };
        fetchDataEfect();
      },[]);
      const changeCreatureClick=(index)=>
      {
        setSelectedCreture(index);
      }
      const placeForCreatue = Array(6).fill("");
      const FightClick = async(enemyName, enemyCreatureToFightId, UserCreatureId)=>{
        await FightStart(enemyName, enemyCreatureToFightId, UserCreatureId);
      }
    return(<div className="absolute bg-black1 bg-opacity-90 w-full h-full items-center flex flex-col justify-center" >
        {speciesPhotosUser?(
        <div className="grid grid-cols-3 grid-rows-2 gap-[1vw] w-[50vw] h-[60vh]  pl-[2vw]">
            <>
            {placeForCreatue.map((_,index)=>(
                <div key={index} className="h-full aspect-square border-8 border-maincolor4 rounded-2xl">
                {speciesPhotosUser[index]?
                    (<>{selectedCreture === index?(<img className="border-4 rounded-md border-maincolor5" src={`images/${speciesPhotosUser[index][0]}.png`}></img>
                    ):(<img onClick={()=>changeCreatureClick(index)} src={`images/${speciesPhotosUser[index][0]}.png`}></img>)}</>
                ):(<></>)}
                </div>
            ))

            }
            </>
            <button className="ml-[100%] mr-[120%] w-full h-[5vh] bg-gradient-to-r from-maincolor3 to-maincolor5 rounded-full text-center flex flex-col justify-center items-center" onClick={()=>FightClick(enemyName, enemyCreatureToFightId,creaturesId[selectedCreture])}>FIGHT</button>
        </div>
        ):(<div>Loading</div>)}
    </div>);
}
export default CreatureSelect;