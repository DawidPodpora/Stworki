import React, { useState, useEffect } from 'react'

function FightScreen(){
    return(<div className="absolute bg-black1 bg-opacity-90 w-full h-screen items-center flex flex-col">
        <div className="relative w-[85vw] h-[65vh] mt-[10vw] items-center justify-center text-maincolor4 flex rounded-3xl">
            {/*Panel ze zdjęciami*/}
            <div className='absolute mt-[1vw] top-0 left-1/2 transform -translate-x-1/2 w-[83vw] h-[32vw]'>
                <div className='h-full aspect-square border-4 border-maincolor2 left-0 rounded-3xl'>
                    <img src="images/water1-1.png" className='rounded-2xl'></img>
                </div>
                <div className='absolute h-full aspect-square border-4 border-maincolor5 right-0 top-0 rounded-3xl'>
                    <img src="images/light2-1.png" className='rounded-2xl'></img>
                </div>
            </div>
            {/*Panel z informacjami */}
            <div className=' p-2 absolute left-1/2 transform -translate-x-1/2 top-0 mt-[1vw]  w-[16vw] h-[57vh] bg-gradient-to-r from-maincolor2 via-black to-maincolor5 rounded-3xl'>
                <div className='w-full h-full bg-black rounded-2xl'>

                </div>
            </div>
            <button className='absolute left-1/2 transform -translate-x-1/2 bottom-[0.1vw] w-[10vw] h-[4.5vh] bg-gradient-to-r from-maincolor3 to-maincolor5 mb-1 rounded-full border-4 border-black'>ACCEPT</button>
        </div>
    </div>)
}
export default FightScreen;