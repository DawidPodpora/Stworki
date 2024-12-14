import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

function Menu({ toogleOptions, onButtonClick }) {
    const { t } = useTranslation();
    const [username, setUsername] = useState(null); // Stan dla nazwy użytkownika
    const [money, setMoney]= useState(null);
    // Pobierz dane użytkownika po zalogowaniu
    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.warn('Brak tokenu w localStorage');
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/api/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Przekazanie tokenu w nagłówku
                    },
                });

                if (!response.ok) {
                    console.error('Błąd w pobieraniu danych użytkownika:', response.statusText);
                    return;
                }

                const data = await response.json();
                setUsername(data.username); 
                setMoney(data.money);// Ustaw nazwę użytkownika w stanie
            } catch (error) {
                console.error('Błąd podczas pobierania danych użytkownika:', error);
            }
        };

        fetchUserData(); // Wywołaj funkcję do pobrania danych
    }, []);

    // Wygląd i logika komponentu
    return (
        <div className="relative flex flex-col items-center bg-maincolor1 text-maincolor4 space-y-4 w-1/5 h-screen rounded-xl pt-10 border-r-2 border-maincolor5">
            {/* Wyświetlenie nazwy użytkownika */}
            {username && (
                <div className="text-xl font-bold text-white mb-4 items-end w-4/5">
                     <p className="text-right ">{username}</p>
                     <p className="text-right ">{money}</p>
                </div>
            )}

            {/* Przyciski menu */}
            {[
                t('Strona główna'),
                t('Moje stworki'),
                t('Sklep'),
                t('optionD'),
                t('optionE'),
                t('optionF'),
                t('optionG')
            ].map((label, index) => (
                <button
                    key={index}
                    onClick={() => onButtonClick(index + 1)}
                    className="border-maincolor2 rounded-xl border py-2 px-4 w-4/5 hover:border-maincolor5 hover:shadow-maincolor5 hover:bg-maincolor4 shadow-buttonshadow transition duration-300 hover:text-black1 hover:bg-opacity-75"
                >
                    {label}
                </button>
            ))}

            {/* Przyciski na dole menu */}
            <div className="flex justify-between absolute bottom-10 w-3/5">
                <button onClick={toogleOptions} className="w-1/3 border-maincolor5 border rounded-full">
                    {t('options')}
                </button>
                <button className="w-1/3 border-maincolor5 border rounded-full">
                    {t('logout')}
                </button>
            </div>
        </div>
    );
}

export default Menu;
