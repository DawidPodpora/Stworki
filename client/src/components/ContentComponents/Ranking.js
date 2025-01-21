import React, { useState, useEffect } from 'react';


function Ranking(){
    const [rankingTable, setRankingTable] = useState(null);
    const [positon, setPosition] = useState(null);
    const [nametoSend, setNameToSend] = useState(null);
    const [numberToSend, setNumberToSend] = useState(1);
    

    const [creatureSpeciesData, setCreatureSpeciesData] = useState([]);
    const [creatures, setCreatures] = useState(null);
    const [statsForCreature, setStatsForCreature] = useState(null);
    const [username, setUsername] = useState(null);
    const table =["POW","VIT","STR","DEX","INT"];

    const [activeCreature, setActiveCreature] = useState(0);
    const fetchById = async () =>{
        
        const token = localStorage.getItem('token'); // Pobranie tokena z localStorage
        if (!token) {
            console.warn('Brak tokenu w localStorage');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:8080/api/RankingForUserById ', {
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
            setPosition(data.userRank);
            setRankingTable(data.ranking);
        } catch (error) {
            console.error('Błąd podczas pobierania danych użytkownika:', error);
        } 
    }
    //////////////////////////////////////////////////////////////////////////////
    const fetchByName = async (name) =>{
        const token = localStorage.getItem('token'); // Pobranie tokena z localStorage
        if (!token) {
            console.warn('Brak tokenu w localStorage');
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080/api/RankingForUserByName?UserName=${name}`, {
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
            setPosition(data.userRank);
            setRankingTable(data.ranking);
        } catch (error) {
            console.error('Błąd podczas pobierania danych użytkownika:', error);
        } 
    }
    //////////////////////////////////////////////////////////////////////////////
    const fetchByNumber = async (number) =>{
        
        const token = localStorage.getItem('token'); // Pobranie tokena z localStorage
        if (!token) {
            console.warn('Brak tokenu w localStorage');
            return;
        }
    
        try {
            const response = await fetch(`http://localhost:8080/api/RankingForUserByNumber?userIndex=${number} `, {
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
            
            setRankingTable(data.ranking);
        } catch (error) {
            console.error('Błąd podczas pobierania danych użytkownika:', error);
        } 
    }
    const fetchUserFromRanking = async(name)=>{
        const token = localStorage.getItem('token');
        if (!token) {
            console.warn('Brak tokenu w localStorage');
            return;
        }
        try {
            const response = await fetch(`http://localhost:8080/api/UserDataForRanking?name=${name} `, {
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
            setCreatureSpeciesData(data.creatureSpeciesData);
            setCreatures(data.creatures);
            setStatsForCreature(data.statsForCreature);
            setUsername(data.username);
        } catch (error) {
            console.error('Błąd podczas pobierania danych użytkownika:', error);
        }
    }
    useEffect(()=>{
        const loadData = async ()=>{
            await fetchById();
        };
        loadData();
    },[])
    const checkRankingNumberClick = async (number) =>
    {
        await fetchByNumber(number);
    }
    const checkRankingNameClick = async (name) =>
    {
        await fetchByName(name);
    }
    const fetchUserDataClick = async (name) =>
    {
        await fetchUserFromRanking(name);
    }
    const changeActiveCreature =(index)=>
    {
        setActiveCreature(index); 
    }
    const playersplace = Array(13).fill("");
    const creatureplace = Array(6).fill("");
    const itemsplace = Array(3).fill("");
    return(<div className='w-full h-full relative p-[1vw]'>
        {rankingTable ?(<>
    <div className='text-maincolor4 w-1/2 h-full  bg-gradient-to-r from-maincolor1 via-black to-maincolor1 border-2 border-maincolor1 rounded-2xl'>
        {playersplace.map((_,index)=>(
            <div onClick={()=>fetchUserDataClick(rankingTable[index].username)} className='w-[97%] h-[6.2%] m-[0.5vw] border-2 border-black bg-gradient-to-r from-maincolor1 to-black rounded-xl relative'>
                {rankingTable[index].position === positon ?(<>
                    <div className='absolute top-1/2 transform -translate-y-1/2 left-[5%] text-maincolor5'>{rankingTable[index].position}</div>
                    <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-maincolor5'>{rankingTable[index].username}</div>
                    <div className='absolute top-1/2 transform -translate-y-1/2 right-[5%] text-maincolor5'>Points: {rankingTable[index].rankingPoints} </div>
                </>):(<div>
                    <div className='absolute top-1/2 transform -translate-y-1/2 left-[5%] '>{rankingTable[index].position}</div>
                    <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 '>{rankingTable[index].username}</div>
                    <div className='absolute top-1/2 transform -translate-y-1/2 right-[5%]'>Points: {rankingTable[index].rankingPoints}</div>
                </div>)   
                }   
                </div>
        ))
        }
        <div className='w-full  h-[4%] flex justify-between text-maincolor5'>
            <button className='ml-[2vw] text-5xl' onClick={()=>checkRankingNumberClick(positon - 13)}>◂</button>
            <button className='mr-[2vw] text-5xl ' onClick={()=>checkRankingNumberClick(positon + 13)}>▸</button>
            </div>
    </div>
    <div className='w-[48%] h-[6vw] absolute top-[1vw] right-[1vw] bg-gradient-to-r from-maincolor1 to-black border-2 border-maincolor1 rounded-2xl'>
        <div className='w-full h-full relative'>
        <input type="text" value={nametoSend} onChange={(e) => setNameToSend(e.target.value)} className='absolute top-[10%] left-[10%] w-[40%] border-2 border-maincolor5 bg-black text-maincolor4 rounded-xl'></input>
        <input type="number" value={numberToSend} onChange={(e) => setNumberToSend(e.target.value)} className='absolute top-[10%] left-[70%] w-[10%] border-2 border-maincolor5 bg-black text-maincolor4 rounded-xl'></input>
        <button onClick={()=>checkRankingNameClick(nametoSend)} className='absolute top-[50%] left-[23%] bg-gradient-to-r from-maincolor3 to-maincolor5 p-1 rounded-2xl'>Check By name</button>
        <button onClick={()=>checkRankingNumberClick(numberToSend)} className='absolute top-[50%] left-[67%] bg-gradient-to-r from-maincolor3 to-maincolor5 p-1 rounded-2xl'>Check by rank</button>
        </div>
    </div>
    {creatures ?(
    <div className=' absolute w-[48%] h-[80vh] bottom-[1vw] right-[1vw] bg-gradient-to-l from-maincolor1 to-black border-2 border-maincolor1 rounded-2xl'>
        <div className='w-full h-full relative p-[0.5vw]'>
            <div className='w-full h-1/2  grid grid-cols-3 grid-rows-2 gap-[1vw] p-[1vw]'>
            {creatureplace.map((_,index)=>(
                <div className='w-[9vw] aspect-square border-2 rounded-2xl'>
                    {/*miejsce na creatury w bloczkach*/}
                    {creatureSpeciesData[index] ?(
                        <div onClick={()=>changeActiveCreature(index)}>
                            {activeCreature === index ?(<img  className='rounded-xl border-4 border-maincolor5' src={`images/${creatureSpeciesData[index].photos[0]}.png`}></img>):(
                                <img className='rounded-2xl' src={`images/${creatureSpeciesData[index].photos[0]}.png`}></img>
                            )}
                            </div>
                        ):(<></>)} 
                </div>
            ))

            }
            </div>
            <div className='w-[18vw] aspect-square border-2 mt-[1vw] rounded-2xl'>
                <img className='rounded-2xl' src={`images/${creatureSpeciesData[activeCreature].photos[0]}.png`} ></img>
            </div>
            <div className='absolute  bottom-[5vh] w-[7vw] h-[35vh] right-[10vw] p-2 '>
                {itemsplace.map((_,index)=>(
                    <div className='w-full aspect-square border-2 mb-2 rounded-2xl'>
                        {creatures[activeCreature]?.items[index]?.photo?(
                        <img src={`images/${creatures[activeCreature].items[index].photo}.png`}></img>
                        ):(<></>)}
                    </div>
                ))}
            </div>
            <div className='absolute  bottom-[5vh] w-[10vw] h-[35vh] right-0 text-maincolor4 p-[1vw]'>
                {table.map((item, index)=>(
                    <div className='mb-[1vw] text-[1.5vw]'>{item}: {creatures[activeCreature].staty[index] + creatureSpeciesData[activeCreature].baseStats[index] + creatureSpeciesData[activeCreature].statsAfterLevel[index] * (creatures[activeCreature].level-1) }</div>
                ))}
            </div>
            <button className='w-[9vw] h-[4vh] bg-gradient-to-r from-maincolor3 to-maincolor5 absolute right-2 bottom-[1vh] rounded-full flex items-center justify-center font-bold'>FIGHT</button>
        </div>
       
    </div>):(<></>)
    }
    </>):(<div className='text-white'>Loading...</div>)}
    </div>);
}
export default Ranking
//const arrows = ["◂", "▸"];