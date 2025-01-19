import React, { useState, useEffect,useRef } from 'react'
import create from 'zustand';

function FightScreen({creatureFightData, creatureFightCloseButton}){
    const [visibleItems, setVisibleItems] = useState(0);
    const fullFightLenght = creatureFightData.fight.fightData.creature1.info.length + creatureFightData.fight.fightData.creature2.info.length;
    const [creature1ActualHp ,setCreature1ActualHp] = useState(creatureFightData.fight.fullhpcreature1);
    const [creature2ActualHp ,setCreature2ActualHp] = useState(creatureFightData.fight.fullhpcreature2);
    const [infoSpeed, setInfoSpeed] = useState(1000);
    const scrollRef = useRef(null);
    useEffect(() => {
        if (visibleItems < fullFightLenght) {
            const timer = setTimeout(() => {
                setVisibleItems((prev) => prev + 1);
                if(visibleItems%2 === 0)
                {
                    changeCreature2Life(creatureFightData.fight.fightData.creature1.dmg[visibleItems/2])
                }
                else
                {
                    changeCreature1Life(creatureFightData.fight.fightData.creature2.dmg[Math.floor(visibleItems/2)])
                }
            }, infoSpeed); // Zwiększa licznik co sekundę
            
            return () => clearTimeout(timer);
        }
    }, [visibleItems, creatureFightData.fight.fightData.creature1.info.length]);
    useEffect(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
      }, [visibleItems]);
    const SkipClick=()=>{
        setInfoSpeed(10);
    }
    const changeCreature1Life =(life)=>
    {
        if(creature1ActualHp - life >=0){
        setCreature1ActualHp(creature1ActualHp - life);
        }else(setCreature1ActualHp(0))
    }
    const changeCreature2Life =(life)=>
    {
        if(creature2ActualHp - life >=0){
            setCreature2ActualHp(creature2ActualHp - life);
            }else(setCreature2ActualHp(0));
    }
    return(<div className="absolute bg-black1 bg-opacity-90 w-full h-screen items-center flex flex-col">
        <div className="relative w-[85vw] h-[65vh] mt-[10vw] items-center justify-center text-maincolor4 flex rounded-3xl z-10 ">
            {/*Panel ze zdjęciami*/}
            
            <div className='absolute mt-[1vw] top-0 left-1/2 transform -translate-x-1/2 w-[83vw] h-[32vw] '>
                <div className='h-full aspect-square border-4 border-maincolor2 left-0 rounded-3xl '>
                    <img src={`images/${creatureFightData.speciesPhotos[0][0]}.png`} className='rounded-2xl'></img>
                </div>
                <div className='absolute h-full aspect-square border-4 border-maincolor5 right-0 top-0 rounded-3xl'>
                    <img src={`images/${creatureFightData.speciesPhotos[1][0]}.png`} className='rounded-2xl'></img>
                </div>
            </div>
            {/*Panel z informacjami */}
            <div className=' p-2 absolute left-1/2 transform -translate-x-1/2 top-0 mt-[1vw]  w-[16vw] h-[57vh] bg-gradient-to-r from-maincolor2 via-black to-maincolor5 rounded-3xl '>
                <div   ref={scrollRef} className='w-full h-full bg-black rounded-2xl overflow-y-auto scrollbar-thin scrollbar-thumb-maincolor5 scrollbar-track-black'>
                {Array.from({ length: visibleItems }).map((_, index)=>(
                    <div key={index}>
                        {index%2===0 ?(
                            <>
                            {creatureFightData.fight.fightData.creature1.info[index/2] === "Dodge"?(
                        <div className='relative w-full h-[2hw]  p-1 flex justify-between'>
                            <div  className='text-maincolor3'>Atak for 0</div>
                            <div className='text-maincolor5  '>{creatureFightData.fight.fightData.creature1.info[index/2]}</div>
                        </div>
                    ):(<div className='relative w-full h-[2hw]  p-1'><div className='text-maincolor3'>{creatureFightData.fight.fightData.creature1.info[index/2]}  {creatureFightData.fight.fightData.creature1.dmg[index/2]}</div></div>)
                    }
                            </>
                ):(
                    <>
                    {creatureFightData.fight.fightData.creature2.info[Math.floor(index/2)] === "Dodge"?(
                        <div className='relative w-full h-[2hw]  p-1 flex justify-between'>
                            <div className='text-maincolor3  '>{creatureFightData.fight.fightData.creature2.info[Math.floor(index/2)]}</div>
                            <div  className='text-maincolor5 '>Atak for 0</div>
                        </div>
                    ):(<div className='relative w-full h-[2hw] p-1'><div className='flex items-center justify-end text-maincolor5'>{creatureFightData.fight.fightData.creature2.info[Math.floor(index/2)]}  {creatureFightData.fight.fightData.creature2.dmg[Math.floor(index/2)]}</div></div>)
                    
                    }
                    </>)}
                    </div>
                ))}
                    {visibleItems === fullFightLenght &&(
                        <div className='w-full h-[2hw] relative'>{creatureFightData.fight.whoWon === "c1"?(
                            <>
                            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 '>You Win</div>
                            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 mt-[2vh] flex items-center'><img className='w-[2vw] h-full' src="images/money.png"></img><p>{creatureFightData.gold}</p></div>
                            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 mt-[5vh] flex items-center'><img className='w-[2vw] h-full' src="images/experience.png"></img><p>{creatureFightData.exp}</p></div>
                                </>
                        ):(<>
                        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 '>You Lose</div>
                            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 mt-[2vh] flex items-center'><img className='w-[2vw] h-full' src="images/money.png"></img><p>{creatureFightData.gold}</p></div>
                            <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 mt-[5vh] flex items-center'><img className='w-[2vw] h-full' src="images/experience.png"></img><p>{creatureFightData.exp}</p></div>
                            </>)}</div>
                    )
                    }
                   
                    {console.log(fullFightLenght)}
                </div>
            </div>
            {visibleItems !== fullFightLenght ? (
                <button onClick={()=>SkipClick()}className='absolute left-1/2 transform -translate-x-1/2 bottom-[0.1vw] w-[10vw] h-[4.5vh] bg-gradient-to-r from-maincolor3 to-maincolor5 mb-1 rounded-full border-4 border-black'>SKIP</button>
            ):(
                <button onClick={()=>creatureFightCloseButton()}className='absolute left-1/2 transform -translate-x-1/2 bottom-[0.1vw] w-[10vw] h-[4.5vh] bg-gradient-to-r from-maincolor3 to-maincolor5 mb-1 rounded-full border-4 border-black'>ACCEPT</button> 
            )
            }
            <div className='absolute left-[2vw] bottom-[0.8vh]  w-[30vw] h-[4.5vh] border-4 border-maincolor4 rounded-2xl'>
                <div className='w-full h-full bg-maincolor3 rounded-lg relative'>
                    <div className='h-full bg-maincolor4 rounded-lg' style={{width:`${(creatureFightData.fight.fullhpcreature1-creature1ActualHp)/creatureFightData.fight.fullhpcreature1 * 100}%`}}></div>
                </div>
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-black'>{creature1ActualHp}/{creatureFightData.fight.fullhpcreature1}</div>
            </div>
           
                     
            <div className='absolute right-[2vw] bottom-[0.8vh]  w-[30vw] h-[4.5vh] border-4 border-maincolor4 rounded-2xl'>
                <div className='w-full h-full bg-maincolor5 rounded-lg relative '>
                    <div className=' absolute h-full bg-maincolor4 rounded-lg right-0' 
                    style={{width:`${(creatureFightData.fight.fullhpcreature2-creature2ActualHp)/creatureFightData.fight.fullhpcreature2 *100}%`}}></div>
                    <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 text-black'>{creature2ActualHp}/{creatureFightData.fight.fullhpcreature2}</div>
                </div>
            </div>
            
        </div>
    </div>)
}
export default FightScreen;