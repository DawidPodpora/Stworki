import Menu from './Menu.js';
import Options from './Options.js';
import Content from './Content.js';
import React, { useState } from 'react';


function MainPage() {
  const[isOptionsVisible, setOptionsVisible] = useState(false);
  const[selectedButton, setSelectedButton] = useState(1);
  
  const toggleOptionVisibility =()=>{
    setOptionsVisible((prevState)=> !prevState);
  }
  const handleButtonClick = (buttonNumber) =>
  {
    setSelectedButton(buttonNumber);
  }
  return (
    <div className='bg-maincolor1 absolute h-screen w-screen flex'>
      <Menu toogleOptions = {toggleOptionVisibility} onButtonClick={handleButtonClick}/>
      <Content selectedButton={selectedButton}/>
        { isOptionsVisible && <Options toogleOptions = {toggleOptionVisibility}/>} 
    </div>
    
  );
}

export default MainPage;