import React from 'react';
import { useTranslation } from 'react-i18next';
function Options({toogleOptions})
  {
    const { i18n } = useTranslation();

    const handleLanguageChange = (e) => {
      i18n.changeLanguage(e.target.value);
    };

    return(
        <div className='absolute bg-black1  bg-opacity-50 w-full h-screen items-center flex flex-col' >
            <div className=" relative bg-maincolor1 w-1/2 h-1/2 mt-[10vh] text-maincolor4 flex flex-col items-center rounded-3xl border-2 border- text-2xl space-y-4">
              <select 
              onChange={handleLanguageChange}
              className="bg-maincolor1 border-maincolor5 border-2 border w-1/3 absolute top-10 rounded-xl shadow-buttonshadow"
              defaultValue={i18n.language}>
                <option value="en">English</option>
                <option value="pl">Polski</option>
                <option value="ua">Yкраїнська</option>
                <option value="ru">Pусский</option>
              </select>
              <button onClick={toogleOptions} className="absolute bottom-10 border-2 rounded-3xl w-1/6 border-maincolor5 hover:shadow-maincolor5  shadow-buttonshadow transition duration-300 hover:text-maincolor5">OK</button>
            </div>
        </div>
    );
  }
  export default Options;