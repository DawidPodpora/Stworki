import React from 'react';
import { useTranslation } from 'react-i18next'; 
function Menu({toogleOptions, onButtonClick}) {
  const {t} = useTranslation();
  
  const buttonLabels =[
    t('optionA'),
    t('optionB'),
    t('optionC'),
    t('optionD'),
    t('optionE'),
    t('optionF'),
    t('optionG')
  ]
  
    return (
      

        <div className=' relative flex flex-col items-center bg-maincolor1 text-maincolor4 space-y-4 w-1/5 h-screen rounded-xl '> 
        {buttonLabels.map((label,index)=>(
          <button
          key = {index}
          onClick={() => onButtonClick(index+1)}
            className='border-maincolor2 rounded-xl border py-2 px-4 w-4/5  hover:border-maincolor5 hover:shadow-maincolor5 hover:bg-maincolor4  shadow-buttonshadow transition duration-300 hover:text-black1 hover:bg-opacity-75'>
            {label}
            </button>
        ))}
        <div className="flex justify-between absolute bottom-10 w-3/5">
          <button onClick={toogleOptions} className="w-1/3 border-maincolor5 border rounded-full ">{t('options')} </button>
        <button className=" w-1/3 border-maincolor5 border rounded-full">{t('logout')} </button>
        </div>
      </div>
      
    );
  }
  
  export default Menu;
