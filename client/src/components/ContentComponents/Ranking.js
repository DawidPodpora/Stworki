import React, { useState, useEffect } from 'react';

function Ranking(){
    const playersplace = Array(13).fill("");
    return(
    <><div className='text-maincolor4 w-1/2 h-[96%] m-[1vw] bg-gradient-to-r from-maincolor1 via-black to-maincolor1 border-2 border-maincolor1 rounded-2xl'>
        {playersplace.map((_,index)=>(
            <div className='w-[97%] h-[6.2%] m-[0.5vw] border-2 border-black bg-gradient-to-r from-maincolor1 to-black rounded-xl'>
                
                </div>
        ))

        }
        <div className='w-full  h-[4%] flex justify-between text-maincolor5'>
            <button className='ml-[2vw] text-5xl'>◂</button>
            <button className='mr-[2vw] text-5xl'>▸</button>
            </div>
    </div></>);
}
export default Ranking
//const arrows = ["◂", "▸"];