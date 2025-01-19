import React, { useState, useEffect } from 'react' // Import biblioteki React
import { useTranslation } from 'react-i18next'; // Import hooka `useTranslation` z biblioteki do obsługi tłumaczeń
import { useNavigate } from 'react-router-dom'; 
// Komponent Menu
// `toogleOptions` - funkcja do przełączania opcji
// `onButtonClick` - funkcja obsługująca kliknięcia przycisków w menu
function Menu({ toogleOptions, onButtonClick, username, creatureFightActiveButton}) {
  const { t } = useTranslation(); // Funkcja `t` służy do tłumaczeń w `react-i18next`
  const navigate = useNavigate(); // Hook do nawigacji
  
  const handleLogout = async () => {
    try {
        const response = await fetch('http://localhost:8080/api/logout', {
            method: 'POST',
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'Nie udało się wylogować');

        // Usuń token i userId z localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('userId');

        // Przekieruj użytkownika na stronę logowania lub główną
        navigate('/');
    } catch (error) {
        console.error('Błąd podczas wylogowywania:', error.message);
        alert('Nie udało się wylogować');
    }
};

  // Lista etykiet dla przycisków menu, przetłumaczona za pomocą `t`
  const buttonLabels = [
    t('Strona główna'),       // Tłumaczenie dla "Strona główna"
    t('Moje stworki'),        // Tłumaczenie dla "Moje stworki"
    t('Sklep'),               // Tłumaczenie dla "Sklep"
    t('Wiadomości prywatne'), // Tłumaczenie dla dodatkowej opcji D
    t('Misje'),             // Tłumaczenie dla dodatkowej opcji E
    t('Gildie'),             // Tłumaczenie dla dodatkowej opcji F
    t('Ranking')              // Tłumaczenie dla dodatkowej opcji G
  ];
  const [buttonPressed, setButtonPressed] = useState(0);
  const changeButton =(number)=>{
    setButtonPressed(number);
  }
  // Wygląd i logika komponentu
  return (
    <div className="relative flex flex-col items-center bg-gradient-to-r from-maincolor1 via-black to-maincolor1 text-maincolor4 space-y-4 w-1/5 h-screen rounded-xl pt-10 border-r-2 border-maincolor5">
      {/* Przyciski menu */}
      <div>
            {username ? <h1>Witaj, {username}!</h1> : <p>Ładowanie danych użytkownika...</p>}
        </div>
        {buttonLabels.map((label, index) => (
  <button
    key={index}
    onClick={() => { onButtonClick(index + 1); changeButton(index); }}
    className={`border-maincolor2 rounded-xl border py-2 px-4 w-4/5 transition duration-300 ${
      buttonPressed === index 
        ? "border-maincolor5 shadow-maincolor5 bg-maincolor4 text-black1 bg-opacity-75" // Kolor aktywnego przycisku
        : "hover:border-maincolor5 hover:shadow-maincolor5 hover:bg-maincolor4 shadow-buttonshadow hover:text-black1 hover:bg-opacity-75"
    }`}
  >
    {label}
  </button>
))}

      
      {/* Przyciski na dole menu */}
      <div className="flex justify-between absolute bottom-10 w-3/5">
        {/* Przycisk opcji */}
        <button onClick={toogleOptions} className="w-1/3 border-maincolor5 border rounded-full">
          {t('options')} {/* Tłumaczenie dla "options" */}
        </button>
        
       
        {/* Przycisk wylogowania */}
        <button onClick={handleLogout} className="w-1/3 border-maincolor5 border rounded-full">
          {t('logout')}
        </button>
      </div>
    </div>
  );
}

export default Menu; // Eksport komponentu
