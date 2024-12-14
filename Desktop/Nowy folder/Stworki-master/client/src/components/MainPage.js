import Menu from './Menu.js'; // Import komponentu Menu
import Options from './Options.js'; // Import komponentu Options
import Content from './Content.js'; // Import komponentu Content
import React, { useState } from 'react'; // Import React i hooka useState do zarządzania stanem

// Główny komponent strony
function MainPage() {
  // Stan dla widoczności panelu opcji
  const [isOptionsVisible, setOptionsVisible] = useState(false);
  
  // Stan dla aktualnie wybranego przycisku w menu
  const [selectedButton, setSelectedButton] = useState(1);

  // Funkcja do przełączania widoczności opcji
  const toggleOptionVisibility = () => {
    setOptionsVisible((prevState) => !prevState); // Odwrócenie obecnego stanu (true <-> false)
  };

  // Funkcja do obsługi kliknięcia przycisku w menu
  const handleButtonClick = (buttonNumber) => {
    setSelectedButton(buttonNumber); // Ustawienie wybranego numeru przycisku
  };

  // Wygląd strony
  return (
    <div className="bg-maincolor1 absolute h-screen w-screen flex">
      {/* Komponent menu */}
      <Menu 
        toogleOptions={toggleOptionVisibility} // Przekazanie funkcji przełączania opcji
        onButtonClick={handleButtonClick} // Przekazanie funkcji obsługi kliknięcia przycisku
      />

      {/* Komponent treści, wyświetlający zawartość na podstawie wybranego przycisku */}
      <Content selectedButton={selectedButton} />

      {/* Warunkowe wyświetlanie panelu opcji */}
      {isOptionsVisible && (
        <Options toogleOptions={toggleOptionVisibility} /> // Przekazanie funkcji zamykania opcji
      )}
    </div>
  );
}

export default MainPage; // Eksport głównego komponentu
