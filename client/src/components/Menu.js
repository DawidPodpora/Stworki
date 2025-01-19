import React, { useState, useEffect } from 'react' // Import biblioteki React
import { useTranslation } from 'react-i18next'; // Import hooka `useTranslation` z biblioteki do obsługi tłumaczeń

// Komponent Menu
// `toogleOptions` - funkcja do przełączania opcji
// `onButtonClick` - funkcja obsługująca kliknięcia przycisków w menu
function Menu({ toogleOptions, onButtonClick, username }) {
  const { t } = useTranslation(); // Funkcja `t` służy do tłumaczeń w `react-i18next`
  // Lista etykiet dla przycisków menu, przetłumaczona za pomocą `t`
  const buttonLabels = [
    t('Strona główna'),       // Tłumaczenie dla "Strona główna"
    t('Moje stworki'),        // Tłumaczenie dla "Moje stworki"
    t('Sklep'),               // Tłumaczenie dla "Sklep"
    t('Wiadomości prywatne'), // Tłumaczenie dla dodatkowej opcji D
    t('Market'),             // Tłumaczenie dla dodatkowej opcji E
    t('optionF'),             // Tłumaczenie dla dodatkowej opcji F
    t('optionG')              // Tłumaczenie dla dodatkowej opcji G
  ];
  
  // Wygląd i logika komponentu
  return (
    <div className="relative flex flex-col items-center bg-maincolor1 text-maincolor4 space-y-4 w-1/5 h-screen rounded-xl pt-10 border-r-2 border-maincolor5">
      {/* Przyciski menu */}
      <div>
            {username ? <h1>Witaj, {username}!</h1> : <p>Ładowanie danych użytkownika...</p>}
        </div>
      {buttonLabels.map((label, index) => (
        <button
          key={index} // Unikalny klucz dla każdego przycisku
          onClick={() => onButtonClick(index + 1)} // Wywołanie `onButtonClick` z numerem przycisku (indeks + 1)
          className="border-maincolor2 rounded-xl border py-2 px-4 w-4/5 hover:border-maincolor5 hover:shadow-maincolor5 hover:bg-maincolor4 shadow-buttonshadow transition duration-300 hover:text-black1 hover:bg-opacity-75"
        >
          {label} {/* Wyświetlana etykieta przycisku */}
        </button>
      ))}
      
      {/* Przyciski na dole menu */}
      <div className="flex justify-between absolute bottom-10 w-3/5">
        {/* Przycisk opcji */}
        <button onClick={toogleOptions} className="w-1/3 border-maincolor5 border rounded-full">
          {t('options')} {/* Tłumaczenie dla "options" */}
        </button>
        
        {/* Przycisk wylogowania */}
        <button className="w-1/3 border-maincolor5 border rounded-full">
          {t('logout')} {/* Tłumaczenie dla "logout" */}
        </button>
      </div>
    </div>
  );
}

export default Menu; // Eksport komponentu
