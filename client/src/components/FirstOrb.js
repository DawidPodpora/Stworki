import React, { useState } from 'react'; // Import biblioteki React
import { useTranslation } from 'react-i18next'; // Import hooka `useTranslation` z biblioteki do obsługi tłumaczeń

// Komponent `Options`, który obsługuje wybór języka i posiada przycisk zamykający okno opcji
function FirstOrb({firsOrbActiveButton,  NewCreatureActiveButton}) {
  const { i18n } = useTranslation(); // Inicjalizacja tłumaczeń z `react-i18next`
  const [choice, setChoice] = useState(null);
  const [responseMessage, setResponseMessage] = useState('');
    const elements=[
        "water",
        "fire",
        "nature",
        "light",
        "dark",
    ]
  // Funkcja obsługująca zmianę języka
  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value); // Zmiana języka na wybrany w select
  };
  const orbChecked =(element)=>{
    setChoice(element);
  }
  const sendFirstOrb = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn('Brak tokenu w localStorage');
        return;
    }
    console.log("cos");
    try{
        console.log("cos1");
        const response = await fetch('http://localhost:8080/api/OrbDraw',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({orb: choice}),
        });
        console.log("cos2");
        if (!response.ok) {
            throw new Error(`Błąd ${response.status}: ${response.statusText}`);
          }
        const data = await response.json();
        return data;
    }catch(error){
        console.error('Błąd podczas wysyłania danych:', error);
        setResponseMessage('Wystąpił błąd podczas wysyłania danych.');
    }
    
  };
  const doubleFunctionClick = () =>
  {
    if(choice)
    {
        console.log("działa");
       
        firsOrbActiveButton();
        sendFirstOrb().then((response)=>{
          NewCreatureActiveButton(response.NewCreature);
        })
    }
  }
  // Wygląd i logika komponentu
  return (
    <div className="absolute bg-black1 bg-opacity-90 w-full h-screen items-center flex flex-col justify-center">
      <div className="relative bg-maincolor1 w-3/4 h-[25vw] mt-[10vh] text-maincolor4  rounded-3xl border-2 p-4 flex flex-col justify-between text-2xl items-center">
      <div className="flex justify-between w-full h-2/3 items-center bg-black px-8  rounded-3xl bg-opacity-70">
        {elements.map((element, index) =>
        <button onClick ={()=> orbChecked(element)}className={`w-1/6 h-[11.5vw] rounded-full hover:shadow-custom-main hover:bg-maincolor4 ${choice === element?
            "shadow-custom-main bg-maincolor4":""
        }`}>
    
            <img src={`images/${element}orb.png`} alt={element}/>
        </button>
        )}
        </div>
        <div className="mb-4">
          <button onClick={doubleFunctionClick} className="px-9 py-2 bg-maincolor5 text-black1 rounded-lg hover:bg-maincolor4 transition">
            OK
          </button>
        </div>
        
      </div>
    </div>
  );
}

export default FirstOrb; // Eksport komponentu