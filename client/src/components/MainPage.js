import Menu from './Menu.js'; // Import komponentu Menu
import Options from './Options.js'; // Import komponentu Options
import Content from './Content.js'; // Import komponentu Content
import FirstOrb from './FirstOrb.js';
import FightScreen from './FightScreen.js';
import React, { useState, useEffect } from 'react'; // Import React i hooka useState do zarządzania stanem
import NewCreatureWindow from './NewCreatureWindow.js';
import CreatureSelect from './CreatureSelect.js';

// Główny komponent strony
function MainPage() {
  const [username, setUsername] = useState(null);
  const [firstChoice, setFirstChoice] = useState(false);
  const [newCreature, setNewCreature] = useState(false);
  const [creatureData, setNewCreatureData] = useState();
  const [userFullData, setUserFullData] = useState(null);
  const [creatrureFight, setCreatureFight] = useState(false);
  const [creatureFightData, setCreatureFightData] = useState(null);
  const [CreatureSelectVisible, setCreatureSelectVisible] = useState(false);
  const [enemyNameToFight, setEnemyDataToFight] = useState(null);
  const [enemyCreatureIdToFight, setEnemyCreatureIdToFight] = useState(null);
    useEffect(() => {
      const fetchUserData = async () => {
          const token = localStorage.getItem('token'); // Pobranie tokena z localStorage
          if (!token) {
              console.warn('Brak tokenu w localStorage');
              return;
          }
  
          try {
              const response = await fetch('http://localhost:8080/api/userData', {
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
              setUserFullData(data);
              setUsername(data.username); // Aktualizacja stanu z nazwą użytkownika
              if(data.isFirstLog === true)
              {
                setFirstChoice(true);
                
              }
          } catch (error) {
              console.error('Błąd podczas pobierania danych użytkownika:', error);
          }

      };
  
      fetchUserData(); // Wywołanie funkcji
  }, []);
  // Stan dla widoczności panelu opcji
  const [isOptionsVisible, setOptionsVisible] = useState(false);
  
  // Stan dla aktualnie wybranego przycisku w menu
  const [selectedButton, setSelectedButton] = useState(1);

  // Funkcja do przełączania widoczności opcji
  const toggleOptionVisibility = () => {
    setOptionsVisible((prevState) => !prevState); // Odwrócenie obecnego stanu (true <-> false)
  };

  const creatureFightActiveButton = (fightData) =>{
    setCreatureFightData(fightData);
    setCreatureFight(true);
  }
  // Funkcja do obsługi kliknięcia przycisku w menu
  const handleButtonClick = (buttonNumber) => {
    setSelectedButton(buttonNumber); // Ustawienie wybranego numeru przycisku
  };
  const firsOrbActiveButton = () =>{
    console.log("zmiana na co innego");
    setFirstChoice((firstChoice) => !firstChoice);
  }
  const nameForCreatureSwitch = () =>{
    setNewCreature((newCreature) => !newCreature);
  }
  const NewCreatureActiveButton = (creatureData) =>{
    console.log("zmiana na co innego");
    setNewCreatureData(creatureData);
    nameForCreatureSwitch();
  }
  const creatureFightCloseButton =()=>{
    setCreatureFight(false);
  }
  const ClickEnemyDatasToFight =(creatureId, enemyName)=>{
    setEnemyCreatureIdToFight(creatureId);
    setEnemyDataToFight(enemyName);
    setCreatureSelectVisible(true);
  }
  const ClickSelectNonVisible=()=>{
    setCreatureSelectVisible(false);
  }
  // Wygląd strony
  return (
    <div className="bg-maincolor1 absolute h-screen w-screen flex">
      {/* Komponent menu */}
      <Menu 
        toogleOptions={toggleOptionVisibility} // Przekazanie funkcji przełączania opcji
        onButtonClick={handleButtonClick} // Przekazanie funkcji obsługi kliknięcia przycisku
        username={username}
      />

      {/* Komponent treści, wyświetlający zawartość na podstawie wybranego przycisku */}
      {userFullData!=null && (<Content selectedButton={selectedButton} data={userFullData} NewCreatureActiveButton={NewCreatureActiveButton} creatureFightActiveButton={creatureFightActiveButton} ClickEnemyDatasToFight={ClickEnemyDatasToFight} />)}

      {/* Warunkowe wyświetlanie panelu opcji */}
      {isOptionsVisible && (
        <Options toogleOptions={toggleOptionVisibility}/> // Przekazanie funkcji zamykania opcji
      )}
      {firstChoice && (
      <FirstOrb firsOrbActiveButton={firsOrbActiveButton} NewCreatureActiveButton={NewCreatureActiveButton}/>
      )}
      {newCreature &&(
        <NewCreatureWindow newCreatureData={creatureData} windowSwicher={nameForCreatureSwitch}/>
      )}
      {creatrureFight &&(
        <FightScreen creatureFightData={creatureFightData} creatureFightCloseButton={creatureFightCloseButton}/>
        )}
        {CreatureSelectVisible &&(
      <CreatureSelect enemyName={enemyNameToFight} enemyCreatureToFightId={enemyCreatureIdToFight} creatureFightActiveButton={creatureFightActiveButton} ClickSelectNonVisible={ClickSelectNonVisible}></CreatureSelect>
    )}
    </div>
    
  );
}

export default MainPage; // Eksport głównego komponentu
