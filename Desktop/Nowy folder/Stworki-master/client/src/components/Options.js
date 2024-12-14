import React from 'react'; // Import biblioteki React
import { useTranslation } from 'react-i18next'; // Import hooka `useTranslation` z biblioteki do obsługi tłumaczeń

// Komponent `Options`, który obsługuje wybór języka i posiada przycisk zamykający okno opcji
function Options({ toogleOptions }) {
  const { i18n } = useTranslation(); // Inicjalizacja tłumaczeń z `react-i18next`

  // Funkcja obsługująca zmianę języka
  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value); // Zmiana języka na wybrany w select
  };

  // Wygląd i logika komponentu
  return (
    <div className="absolute bg-black1 bg-opacity-90 w-full h-screen items-center flex flex-col">
      {/* Główne okno opcji */}
      <div className="relative bg-maincolor1 w-1/2 h-1/2 mt-[10vh] text-maincolor4 flex flex-col items-center rounded-3xl border-2 text-2xl space-y-4">
        
        {/* Wybór języka */}
        <select
          onChange={handleLanguageChange} // Obsługa zmiany języka
          className="bg-maincolor1 border-maincolor5 border-2 w-1/3 absolute top-10 rounded-xl shadow-buttonshadow"
          defaultValue={i18n.language} // Domyślnie ustawiony język
        >
          <option value="en">English</option> {/* Opcja dla języka angielskiego */}
          <option value="pl">Polski</option> {/* Opcja dla języka polskiego */}
          <option value="ua">Українська</option> {/* Opcja dla języka ukraińskiego */}
          <option value="ru">Русский</option> {/* Opcja dla języka rosyjskiego */}
        </select>
        
        {/* Przycisk zamykający okno opcji */}
        <button
          onClick={toogleOptions} // Funkcja wywoływana przy kliknięciu
          className="absolute bottom-10 border-2 rounded-3xl w-1/6 border-maincolor5 hover:shadow-maincolor5 shadow-buttonshadow transition duration-300 hover:text-maincolor5"
        >
          OK
        </button>
      </div>
    </div>
  );
}

export default Options; // Eksport komponentu
