import React, { useState } from "react";
import Crafting from "./ColectionComponents/Crafting";

function TestButton2() {
    const divs = [
      "/public/testobrazka.png",
      "/testobrzka2.png",
      "/testobrazka3.png",
      "/testobrazka4.png",
      "/testobrazka5.png",
      "public/testobrazka6.png"
      
    ]
    const statsNames=
    [
      "POW",
      "VIT",
      "STR",
      "DEX",
      "INT"
    ]

    const arrows=[
      "◂",
      "▸"
    ]
    const items = Array(15).fill("");
    const itemsActive = Array(3).fill("");

    const[visibleCreature, setVisibleCreature] = useState(divs[0]);

    const newCreature =(buttonNumber)=>{
      setVisibleCreature(divs[buttonNumber]);
      
      
    }

    const[panelVisible, setPanelVisible] = useState(false);
    const makePanelVisible = () =>{
      setPanelVisible(!panelVisible);
    }
  
    return (
      
      <div className="w-full h-full bg-black1 flex justify-center p-5 flex-col space-y-4 relative">
        
        <div className="w-full h-1/2 bg-maincolor1 rounded-xl p-4 flex items-center z-0">
          <div className="h-[45vh] aspect-square bg-maincolor4 rounded-xl border-2 border-maincolor5">
            <img src={visibleCreature} className="w-full h-full object-cover rounded-xl"/>
            
          </div>
          <div className="w-1/6 h-full  ">
          {
            
              itemsActive.map((_,index) => (
                <div className="w-full h-1/3  p-4 flex flex-wrap justify-center">
                  <div className=" h-[12vh] aspect-square bg-black1 bg-opacity-50 rounded-xl border-maincolor4 border-2">
                   
                    </div>
                </div>
              ))
            
          }
          </div>
          <div name="StatsPanel" className="h-full flex-grow  rounded-xl border-2 border-maincolor4 flex-col">
            <div className="h-2/3 w-full flex">
            <div className="w-1/5 h-full  text-maincolor4 text-[3vh]  flex flex-col  items-center">
              

              {
                statsNames.map((stat,index) =>(
                  <div className="w-full h-1/5 text-center">
                    {stat}
                  </div>
                ))
              }


            </div>
            <div className="w-4/5 h-full text-[3vh]   text-maincolor4 flex">

            <div className="w-1/5 h-full  flex flex-col  items-start">
            {
                statsNames.map((stat,index) =>(
                  <div className="w-full h-1/5 text-center">
                    20
                  </div>
                ))
              }
              </div>
              <div className="w-4/5 h-full ">
              <p className="w-full h-1/4 text-center">NAME</p>
              <div className="w-full h-3/4  text-center">

              </div>
              </div>





            </div>
            </div>
            <div name="PasivePanel" className="w-full h-1/3  p-2">
              <p className="h-1/6 text-maincolor4 text-[2vh] flex items-center justify-center">PASIVE</p>
              <div className="border-2 border-maincolor5 bg-black1 bg-opacity-50 w-full h-5/6 rounded-xl text-maincolor4 p-2">
                asdasdasdasdasdasda<br/>
                dasdasdasd
              </div>
            </div>
          </div>
        </div>




        <div name="MonstersPanel" className="w-full h-1/2 flex  gap-4 "> 
          <div className="w-1/2 h-full bg-maincolor1 rounded-xl flex flex-wrap   justify-center ">
          {divs.map((a,index) => (
            <div className="w-1/3 h-1/2 grid place-items-center">
            <div onClick={()=>newCreature(index)} 
                  
                  className=" relative h-[20vh] aspect-square bg-black1  rounded-xl border-black1 border-2 " >
            <img src={a} className=" absolute w-full h-full object-cover rounded-xl"/>
            
            <div  className=" p-3 flex flex-col absolute bg-black1 text-maincolor4 w-full h-full text-opacity-0 bg-opacity-0 hover:bg-opacity-70 hover:text-opacity-100 rounded-xl">
              <p>POW</p>
              <p>VIT</p>
              <p>STR</p>
              <p>DEX</p>
              <p>INT</p>
            </div>
            
            
            </div>
            </div>
          ))}
          </div>





          <div name="" className="w-1/2 h-full bg-maincolor1 rounded-xl flex flex-wrap justify-center ">
          {
            items.map((_,index) => (
              <div className="w-1/5 h-1/3  p-4 flex flex-wrap justify-center">
                <div className=" h-[12vh] aspect-square bg-black1 bg-opacity-50 rounded-xl border-maincolor4 border-2">
                  
                  </div>
              </div>
            ))
          }
          </div>
        </div>
        <div
        className={`fixed top-[-1vw] right-0 w-[79vw] h-1/2 bg-black1 text-maincolor4 transform transition-transform duration-500 rounded-xl 
          bg-opacity-90 border-maincolor5 border-2 ${
          panelVisible ? 'translate-x-0' : 'translate-x-full'
        }`}>
        <div className={`absolute  h-[15vh] bg-maincolor1  top-[15.5vh] rounded flex justify-center  -p-[5vh] border-maincolor5 border-2 ${
          panelVisible ? 'left-[-1vw]' : 'left-[-2vw]' 
        }`}>
          <div className="w-full h-full relative flex justify-center  text-[5vh] text-maincolor5">
            <button onClick={makePanelVisible}>{panelVisible ? arrows[1] : arrows[0]}</button>
          </div>
         
        
      </div>
        </div>
      </div>
      
      
    );
  }
  
  export default TestButton2;