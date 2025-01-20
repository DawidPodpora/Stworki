import React, { useState, useEffect } from 'react' // Import biblioteki React
import { useTranslation } from 'react-i18next'; // Import hooka `useTranslation` z biblioteki do obsługi tłumaczeń
import { useNavigate } from 'react-router-dom'; 

function Menu({ toogleOptions, onButtonClick, username }) {
  const { t, i18n } = useTranslation(); // Funkcja `t` służy do tłumaczeń w `react-i18next`
  const navigate = useNavigate(); // Hook do nawigacji
  const [currentLanguage, setCurrentLanguage] = useState(localStorage.getItem('language') || 'en');


  useEffect(() => {
    const savedLanguage = localStorage.getItem('language');
    if(savedLanguage && savedLanguage !== i18n.language){
      i18n.changeLanguage(savedLanguage);
      setCurrentLanguage(savedLanguage);
    }
  }, [i18n.language]);

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
    t('home'),       // Tłumaczenie dla "Strona główna"
    t('myCreatures'),        // Tłumaczenie dla "Moje stworki"
    t('shop'),               // Tłumaczenie dla "Sklep"
    t('privateMessages'), // Tłumaczenie dla dodatkowej opcji D
    t('market'),             // Tłumaczenie dla dodatkowej opcji E
    t('missions'),             // Tłumaczenie dla dodatkowej opcji E
    t('guilds'),             // Tłumaczenie dla dodatkowej opcji F
  ];

  const [buttonPressed, setButtonPressed] = useState(0);
  

  // Wygląd i logika komponentu
  return (
    <div className="relative flex flex-col items-center bg-gradient-to-r from-maincolor1 via-black to-maincolor1 text-maincolor4 space-y-4 w-1/5 h-screen rounded-xl pt-10 border-r-2 border-maincolor5">
      {/* Przyciski menu */}
      <div>
        {username ? <h1>{t('welcome')}, {username}!</h1> : <p>{t('loadingUser')}</p>}
      </div>
      {buttonLabels.map((label, index) => (
        <button
          key={index}
          onClick={() => { onButtonClick(index + 1); setButtonPressed(index); }}
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
