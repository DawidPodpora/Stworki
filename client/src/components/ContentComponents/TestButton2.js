import React, { useEffect, useState } from "react";  // Importujemy React oraz useState do obsługi stanów.

function TestButton2({data}) {
  const [creatures, setCreatures] = useState(null);
  const [species, setSpecies] = useState(null);
  const [itemsFromUser, setItemsFromUser] = useState(null);
  const [visibleCreature, setVisibleCreature] = useState(0);
  const fetchUserData = async () => {
    const token = localStorage.getItem('token'); // Pobranie tokena z localStorage
    if (!token) {
        console.warn('Brak tokenu w localStorage');
        return;
    }

    try {
        const response = await fetch('http://localhost:8080/api/usersCreaturesAndItemsData ', {
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
        setCreatures(data.creatures);
        setSpecies(data.species);
        setItemsFromUser(data.items);
        
    } catch (error) {
        console.error('Błąd podczas pobierania danych użytkownika:', error);
    }

};
useEffect(() => {
      const loadCreaturesAndItemData = async () =>{
       await fetchUserData();
       console.log(creatures, "creatures");
       console.log(species, "species");
       console.log(itemsFromUser, " items");
       setVisibleCreature(`images/${species[0].photos[0]}.png`);
        // Wywołanie funkcji

      };
      loadCreaturesAndItemData();
  }, []);
  // Zbiór obrazów dla różnych stworzeń
  
  // Nazwy statystyk postaci
  const statsNames = ["POW", "VIT", "STR", "DEX", "INT"];
  
  // Strzałki do przesuwania panelu
  const arrows = ["◂", "▸"];
  
  // Puste tablice dla przedmiotów (15 przedmiotów w sklepie) oraz aktywnych przedmiotów (3 przedmioty aktywne)
  const items = Array(15).fill("");
  const itemsActive = Array(3).fill("");

  // Stan do zarządzania widocznością stworzenia
  

  // Funkcja zmieniająca widocznego stwora
  const newCreature = (buttonNumber) => {
    setVisibleCreature(buttonNumber);

  };

  // Stan do zarządzania widocznością panelu (przesuwany panel)
  const [panelVisible, setPanelVisible] = useState(false);

  // Funkcja zmieniająca stan widoczności panelu
  const makePanelVisible = () => {
    setPanelVisible(!panelVisible);
  };

  return (
    <div className="w-full h-full bg-black1 flex justify-center p-5 flex-col space-y-4 relative">
      {creatures ?(<>
      {/* Górny panel (stwór, aktywne przedmioty, statystyki) */}
      <div className="w-full h-1/2 bg-maincolor1 rounded-xl p-4 flex items-center z-0">
        {/* Obrazek stwora */}
        <div className="h-[45vh] aspect-square bg-maincolor4 rounded-xl border-2 border-maincolor5">
          <img
            src={`images/${species[visibleCreature].photos[0]}.png` || `images/${species[0].photos[0]}.png`} // Źródło obrazu widocznego stwora 
            alt="Displayed Creature" // Alt dla obrazka
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        {/* Panel aktywnych przedmiotów */}
        <div className="w-1/6 h-full">
          {itemsActive.map((_, index) => (
            <div key={index} className="w-full h-1/3 p-4 flex flex-wrap justify-center">
              <div className="h-[12vh] aspect-square bg-black1 bg-opacity-50 rounded-xl border-maincolor4 border-2"></div>
            </div>
          ))}
        </div>

        {/* Panel statystyk */}
        <div className="h-full flex-grow rounded-xl border-2 border-maincolor4 flex-col">
          <div className="h-2/3 w-full flex">
            {/* Nazwy statystyk */}
            <div className="w-1/5 h-full text-maincolor4 text-[3vh] flex flex-col items-center">
              {statsNames.map((stat, index) => (
                <div key={index} className="w-full h-1/5 text-center">
                  {stat}
                </div>
              ))}
            </div>

            {/* Wartości statystyk */}
            <div className="w-4/5 h-full text-[3vh] text-maincolor4 flex">
              <div className="w-1/5 h-full flex flex-col items-start">
                {statsNames.map((_, index) => (
                  <div key={index} className="w-full h-1/5 text-center">
                    {console.log(species[visibleCreature].baseStats[index])}
                    {creatures[visibleCreature].staty[index] + species[visibleCreature].baseStats[index] + ((creatures[visibleCreature].level -1) * species[visibleCreature].statsAfterLevel[index])} 
                  </div>
                ))}
              </div>

              <div className="w-4/5 h-full">
                <p className="w-full h-1/4 text-center">NAME</p>
                <div className="w-full h-3/4 text-center">{creatures[visibleCreature].name}</div>
              </div>
            </div>
          </div>

          {/* Panel pasywny */}
          <div className="w-full h-1/3 p-2">
            <p className="h-1/6 text-maincolor4 text-[2vh] flex items-center justify-center">PASIVE</p>
            <div className="border-2 border-maincolor5 bg-black1 bg-opacity-50 w-full h-5/6 rounded-xl text-maincolor4 p-2">
              MIEJSCE NA UMIEJĘTNOSĆ PASYWNĄ
            </div>
          </div>
        </div>
      </div>

      {/* Panel z potworami i przedmiotami */}
      <div className="w-full h-1/2 flex gap-4">
        {/* Obrazy potworów */}
        <div className="w-1/2 h-full bg-maincolor1 rounded-xl flex flex-wrap justify-center">
          {species.map((a, index) => (
            <div key={index} className="w-1/3 h-1/2 grid place-items-center">
              <div
                onClick={() => newCreature(index)} // Po kliknięciu zmienia stwora
                className="relative h-[20vh] aspect-square bg-black1 rounded-xl border-black1 border-2"
              >
                <img
                  src={`images/${a.photos[0]}.png`}
                  alt={`Monster ${index + 1}`}
                  className="absolute w-full h-full object-cover rounded-xl"
                />
                <div className="p-3 flex flex-col absolute bg-black1 text-maincolor4 w-full h-full text-opacity-0 bg-opacity-0 hover:bg-opacity-70 hover:text-opacity-100 rounded-xl">
                  {statsNames.map((a, index) =>(
                    <p>{a}  {creatures[visibleCreature].staty[index] + species[visibleCreature].baseStats[index] + ((creatures[visibleCreature].level -1) * species[visibleCreature].statsAfterLevel[index])}</p>
                  ))
                  }
                  
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Panel z przedmiotami */}
        <div className="w-1/2 h-full bg-maincolor1 rounded-xl flex flex-wrap justify-center gap-4 p-4 overflow-y-auto max-h-[60vh]">
          {items.map((_, index) => (
            <div
              key={index}
              className="w-[6vw] h-[6vw] min-h-[70px] min-w-[70px] bg-black1 bg-opacity-50 rounded-xl border-maincolor4 border-2"
            ></div>
          ))}
        </div>
      </div>

      {/* Przesuwany panel */}
      <div
        className={`fixed top-[-1vw] right-0 w-[79vw] h-1/2 bg-black1 text-maincolor4 transform transition-transform duration-500 rounded-xl 
          bg-opacity-90 border-maincolor5 border-2 ${panelVisible ? "translate-x-0" : "translate-x-full"}`}
      >
        <div
          className={`absolute h-[15vh] bg-maincolor1 top-[15.5vh] rounded flex justify-center -p-[5vh] border-maincolor5 border-2 ${
            panelVisible ? "left-[-1vw]" : "left-[-2vw]"
          }`}
        >
          <div className="w-full h-full relative flex justify-center text-[5vh] text-maincolor5">
            <button onClick={makePanelVisible}>
              {panelVisible ? arrows[1] : arrows[0]} {/* Przycisk do otwierania/zamykania panelu */}
            </button>
          </div>
        </div>
      </div>
      </>
): (
  <div>Loading...</div> // Wyświetlanie komunikatu ładowania
)}
    </div>
  );
}



export default TestButton2;  // Eksportujemy komponent
