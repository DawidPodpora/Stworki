import React, { useEffect, useState } from "react";  // Importujemy React oraz useState do obsługi stanów.
import { useTranslation } from "react-i18next";

function TestButton2({data, NewCreatureActiveButton}) {
  const [creatures, setCreatures] = useState(null);
  const [species, setSpecies] = useState(null);
  const [itemsFromUser, setItemsFromUser] = useState(null);
  const [visibleCreature, setVisibleCreature] = useState(0);
  const [itemActionVisible, setItemActionVisible] = useState(false);
  const [actualItem, setActualItem] = useState([]);
  const [playerLevel, setPlayerLevel] = useState(0);
  // DODANE (1) – Stany związane z tooltipem:
  const maxHeight = window.innerHeight;
  const maxWidth = window.innerWidth;
  const [tooltipVisible, setTooltipVisible] = useState(false);          // Czy tooltip jest widoczny
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 }); // Pozycja tooltipa
  const [tooltipContent, setTooltipContent] = useState(null);           // Zawartość (item) tooltipa
  const [whatItemPanel, setWhatItemPanel] = useState(null);
  const [exp, setExp] = useState(0);
  const [gold, setGold] = useState(0);
  const [name, setName] = useState(null);
  const [expToNextLevel, setExpToNextLevel] = useState(0);
  const { t } = useTranslation();

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
        setExp(data.exp);
        setGold(data.gold);
        setName(data.username);
        setExpToNextLevel(data.expToNextLevel);
        setPlayerLevel(data.level);
        
    } catch (error) {
        console.error(t('fetchUserDataError'), error);
    }
  };

  const equipeItem = async (itemId, creatureId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn(t('noTokenWarning'));
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/equipeItem?itemId=${itemId}&creatureId=${creatureId} `, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error(t('fetchUserDataError'), response.statusText);
            return;
        }
        
        const data = await response.json();
        console.log(data);
        
    } catch (error) {
        console.error(t('fetchUserDataError'), error);
    }
  };

  const ItemUse = async (itemId, creatureId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn(t('noTokenWarning'));
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/useItem?itemId=${itemId}&creatureId=${creatureId} `, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error(t('fetchUserDataError'), response.statusText);
            return;
        }
        
        const data = await response.json();
        console.log(data);
        
    } catch (error) {
        console.error(t('fetchUserDataError'), error);
    }
  };

  const unequipeItem = async (itemId, creatureId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn(t('noTokenWarning'));
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/unequipeItem?itemId=${itemId}&creatureId=${creatureId} `, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error(t('fetchUserDataError'), response.statusText);
            return;
        }
        
        const data = await response.json();
        
    } catch (error) {
        console.error(t('fetchUserDataError'), error);
    }
  };

  const OrbUse = async (itemId) => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn(t('noTokenWarning'));
        return;
    }

    try {
        const response = await fetch(`http://localhost:8080/api/useOrb?itemId=${itemId} `, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error(t('fetchUserDataError'), response.statusText);
            return;
        }
        
        const data = await response.json();
        return data;
        
    } catch (error) {
        console.error(t('fetchUserDataError'), error);
    }
  };

  

  useEffect(() => {
    const loadCreaturesAndItemData = async () =>{
      await fetchUserData();
    };
    loadCreaturesAndItemData();
  }, []);

  // Nazwy statystyk postaci
  const statsNames = [t("power"), t("vitality"), t("strength"), t("dexterity"), t("intelligence")];
  
  // Strzałki do przesuwania panelu
  const arrows = ["◂", "▸"];
  
  // Puste tablice dla przedmiotów (15 przedmiotów w sklepie) oraz aktywnych przedmiotów (3 przedmioty aktywne)
  const items = Array(15).fill("");
  const itemsActive = Array(3).fill("");

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

  const makeItemPanelVisible =(itemData)=>{
    setItemActionVisible(!itemActionVisible);
    setActualItem(itemData);
  };

  // Zakładanie i zdejmowanie przedmiotu
  const equiqeItemClick = async (itemId, creatureId)=>{
    await equipeItem(itemId, creatureId);
    setItemActionVisible(false);
    await fetchUserData(); 
  };

  const unequiqeItemClick = async (itemId, creatureId)=>{
    await unequipeItem(itemId, creatureId);
    await fetchUserData(); 
  };

  const handleItemClick = async (itemId, creatureId)=>{
    await ItemUse(itemId, creatureId);
    setItemActionVisible(false);
    await fetchUserData(); 
  };
  const handleOrbClick = async(itemId)=>{
    await OrbUse(itemId).then((response)=>{
      NewCreatureActiveButton(response.NewCreature);
    });
    setItemActionVisible(false);
    await fetchUserData(); 
  }
  // DODANE (2) – Funkcje do obsługi zdarzeń myszy (hover) dla tooltipa
  const handleMouseEnter = (event, item, type) => {
    // Ustaw pozycję tooltipa
    setTooltipPosition({ x: event.pageX, y: event.pageY });
    // Przekazujemy cały obiekt item, by wyświetlić jego dane w tooltipie
    setTooltipContent(item);
    setTooltipVisible(true);
    setWhatItemPanel(type);
  };

  const handleMouseMove = (event) => {
    setTooltipPosition({ x: event.pageX, y: event.pageY });
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
  };

  return (
    <div className="w-full h-full bg-black1 flex justify-center p-5 flex-col space-y-4 relative">
      {console.log(itemsFromUser, "items")}
      {creatures ? (
        <>
          {/* Górny panel (stwór, aktywne przedmioty, statystyki) */}
          <div className="w-full h-1/2 bg-gradient-to-r from-maincolor1 via-black to-maincolor1 rounded-xl p-4 flex items-center z-0 border-2 border-maincolor1">
            {/* Obrazek stwora */}
            <div className="h-[45vh] aspect-square bg-maincolor4 rounded-xl border-2 border-maincolor5">
              <img
                src={`images/${species[visibleCreature].photos[0]}.png` || `images/${species[0].photos[0]}.png`}
                alt="Displayed Creature"
                className="w-full h-full object-cover rounded-xl"
              />
            </div>
            
            {/* Panel aktywnych przedmiotów */}
            <div className="w-1/6 h-full">
              {itemsActive.map((_, index) => (
                <div key={index} className="w-full h-1/3 p-4 flex flex-wrap justify-center">
                  <div className="h-[12vh] aspect-square bg-black1 bg-opacity-50 rounded-xl border-maincolor4 border-2">
                    {creatures[visibleCreature].items[index] && (
                      <button
                        onClick={() => unequiqeItemClick(creatures[visibleCreature].items[index]._id, creatures[visibleCreature]._id)}
                        // DODANE (3) – Obsługa eventów dla tooltipa:
                        onMouseEnter={(event) => handleMouseEnter(event, creatures[visibleCreature].items[index], false)}
                        onMouseLeave={handleMouseLeave}
                        onMouseMove={handleMouseMove}
                      >
                        <img src={`images/${creatures[visibleCreature].items[index].photo}.png`} alt="" />
                      </button>
                    )}
                  </div>
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
                        {creatures[visibleCreature].staty[index]
                          + species[visibleCreature].baseStats[index]
                          + ((creatures[visibleCreature].level - 1) * species[visibleCreature].statsAfterLevel[index])
                        }
                      </div>
                    ))}
                  </div>

                  <div className="w-4/5 h-full">
                    <div className="w-full h-3/4 text-center">{creatures[visibleCreature].name}
                      <div className=" mt-[3vh] ml-[3vw] w-4/5 h-1/4 bg-gradient-to-r from-maincolor2 via-black to-maincolor5 border-4 relative" ><div className="bg-maincolor1 h-full absolute right-0" style={{width:`${(creatures[visibleCreature].expToNextLevel -creatures[visibleCreature].exp)/creatures[visibleCreature].expToNextLevel * 100}%`}}></div></div>
                      <div className="mt-[2vh]">{creatures[visibleCreature].exp}/{creatures[visibleCreature].expToNextLevel}</div>
                      <div className="mt-[2vh]">{t('level')} {creatures[visibleCreature].level}</div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Panel z potworami i przedmiotami */}
          <div className="w-full h-1/2 flex gap-4">
            {/* Obrazy potworów */}
            <div className="w-1/2 h-full bg-gradient-to-r from-maincolor1 to-black border-2 border-maincolor1 rounded-xl flex flex-wrap justify-center">
              {species.map((a, index) => (
                <div key={index} className="w-1/3 h-1/2 grid place-items-center">
                  <div
                    onClick={() => newCreature(index)}
                    className="relative h-[20vh] aspect-square bg-black1 rounded-xl border-black1 border-2"
                  >
                    <img
                      src={`images/${a.photos[0]}.png`}
                      alt={`Monster ${index + 1}`}
                      className="absolute w-full h-full object-cover rounded-xl"
                    />
                    <div className="p-3 flex flex-col absolute bg-black1 text-maincolor4 w-full h-full text-opacity-0 bg-opacity-0 hover:bg-opacity-70 hover:text-opacity-100 rounded-xl">
                      {statsNames.map((statName, ind) => (
                        <p key={ind}>
                          {statName}{" "}
                          {creatures[index].staty[ind]
                            + species[index].baseStats[ind]
                            + ((creatures[index].level -1) * species[index].statsAfterLevel[ind])}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Panel z przedmiotami */}
            <div className="relative w-1/2 h-full bg-gradient-to-r from-black to-maincolor1 border-2 border-maincolor1 rounded-xl flex flex-wrap justify-center gap-4 p-4 overflow-y-auto max-h-[60vh]">
              {items.map((_, index) => (
                <div
                  key={index}
                  className="w-[6vw] h-[6vw] min-h-[70px] min-w-[70px] bg-black1 bg-opacity-50 rounded-xl border-maincolor4 border-2"
                >
                  {itemsFromUser && itemsFromUser[index] && (
                    <button
                      onClick={() => makeItemPanelVisible(itemsFromUser[index])}
                      // DODANE (4) – Obsługa eventów dla tooltipa także na itemy w panelu
                      onMouseEnter={(event) => handleMouseEnter(event, itemsFromUser[index], true)}
                      onMouseLeave={handleMouseLeave}
                      onMouseMove={handleMouseMove}
                    >
                      <img src={`images/${itemsFromUser[index].photo}.png`} alt="" />
                    </button>
                  )}
                </div>
              ))}

              {itemActionVisible && (
                <div className="absolute top-0 left-0 w-full h-full bg-black1 bg-opacity-90 z-10 flex justify-center items-center">
                  <div className="w-[80%] h-[80%] bg-maincolor1 text-maincolor4 p-4 rounded-xl border border-maincolor5 shadow-lg flex justify-center items-center relative">
                    <p>{actualItem.name}</p>
                    <img className="w-1/2" src={`images/${actualItem.photo}.png`} alt="" />
                    {
                      console.log(actualItem.type)
                    }
                    {actualItem.type === "orb" &&(
                      <button onClick={() => handleOrbClick(actualItem._id)}>Use</button>)
                    }
                    {actualItem.type === "equipable" &&
                       (<button onClick={() => equiqeItemClick(actualItem._id, creatures[visibleCreature]._id)}>Equipe</button>)
                    }
                    {actualItem.type === "usable" &&
                       (<button onClick={() => handleItemClick(actualItem._id, creatures[visibleCreature]._id)}>Use</button>)
                    }
                    <button
                      className="absolute top-4 right-4 text-maincolor4 font-bold"
                      onClick={() => setItemActionVisible(false)}
                    >
                      X
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Przesuwany panel */}
          <div
            className={`fixed top-[-1vw] right-0 w-[79vw] h-1/2 bg-black1 text-maincolor4 transform transition-transform duration-500 rounded-xl 
            bg-opacity-90 border-maincolor5 border-2 ${
              panelVisible ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="text-[3vw] w-full flex items justify-center h-1/5">{name} {t('level')} {playerLevel}</div>
            <div className="text-[1.5vw] flex justify-between m-[3vw] h-1/3 "><div className="w-1/6 flex justify-between relative"><img src="images/money.png" className="h-full"></img><div className="absolute top-1/2 left-[7vw]">{gold} </div></div>
              <div className="relative w-1/2"><div className="absolute top-1/2">{exp}/{expToNextLevel}</div><div className="w-3/4 h-1/4 border-2 top-1/2 absolute ml-[8vw]"><div className = "bg-maincolor2 h-full" style={{width:`${exp/expToNextLevel*100}%`}}></div></div></div>
            </div>
            <div
              className={`absolute h-[15vh] bg-maincolor1 top-[15.5vh] rounded flex justify-center -p-[5vh] border-maincolor5 border-2 ${
                panelVisible ? "left-[-1vw]" : "left-[-2vw]"
              }`}
            >
              <div className="w-full h-full relative flex justify-center text-[5vh] text-maincolor5">
                <button onClick={makePanelVisible}>
                  {panelVisible ? arrows[1] : arrows[0]}
                </button>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div>{t('loading')}</div> // Wyświetlanie komunikatu ładowania
      )}

      {/* DODANE (5) – Render samego tooltipa */}
      {tooltipVisible && tooltipContent && (
        <div
          style={
            whatItemPanel ?
            {
            position: "fixed",
            bottom: maxHeight-tooltipPosition.y - 10,
            right: maxWidth-tooltipPosition.x + 10,
            zIndex: 9999,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "8px",
            borderRadius: "20px",
            }:{
              position: "fixed",
            top: tooltipPosition.y + 10,
            left: tooltipPosition.x + 10,
            zIndex: 9999,
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            color: "white",
            padding: "8px",
            borderRadius: "20px",
            }
          }
          className={`border-4 ${
            tooltipContent.element === "fire"
              ? "border-red-500"
              : tooltipContent.element === "water"
              ? "border-cyan-500"
              : tooltipContent.element === "nature"
              ? "border-green-400"
              : tooltipContent.element === "light"
              ? "border-yellow-500"
              : tooltipContent.element === "dark"
              ? "border-purple-900"
              : "border-white"
          }`}
        >
          <h4 className="text-2xl font-bold">{tooltipContent.name}</h4>
          <img
            className="w-20 h-20"
            src={`images/${tooltipContent.photo}.png`}
            alt=""
          />
          <p className="text-lg font-bold">{t('type')} {tooltipContent.type}</p>
          {tooltipContent.power !== 0 && <p>{t('power')}: +{tooltipContent.power}</p>}
          {tooltipContent.vitality !== 0 && (
            <p>{t('vitality')}: +{tooltipContent.vitality}</p>
          )}
          {tooltipContent.strength !== 0 && (
            <p>{t('strength')}: +{tooltipContent.strength}</p>
          )}
          {tooltipContent.dexterity !== 0 && (
            <p>{t('dexterity')}: +{tooltipContent.dexterity}</p>
          )}
          {tooltipContent.intelligence !== 0 && (
            <p>{t('intelligence')}: +{tooltipContent.intelligence}</p>
          )}
          {tooltipContent.armor !== 0 && <p>{t('armor')}: +{tooltipContent.armor}</p>}
          <p>
            <span>{t('element')}: </span>{" "}
            <span
              className={`${
                tooltipContent.element === "fire"
                  ? "text-red-500"
                  : tooltipContent.element === "water"
                  ? "text-cyan-500"
                  : tooltipContent.element === "nature"
                  ? "text-green-400"
                  : tooltipContent.element === "light"
                  ? "text-yellow-500"
                  : tooltipContent.element === "dark"
                  ? "text-purple-900"
                  : "text-white"
              } font-bold`}
            >
              {tooltipContent.element}
            </span>
          </p>
        </div>
      )}
      {/* KONIEC tooltipa */}
    </div>
  );
}

export default TestButton2;  // Eksportujemy komponent
