import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next'; // Import hooka `useTranslation` z biblioteki do obsługi tłumaczeń

// Komponent `Options`, który obsługuje wybór języka i posiada przycisk zamykający okno opcji
function NewCreatureWindow({ newCreatureData , windowSwicher}) {
  const { i18n } = useTranslation(); // Inicjalizacja tłumaczeń z `react-i18next`
    const [photoName, setPhotoName] = useState(null);
    const [name,setName] = useState();
  // Funkcja obsługująca zmianę języka
  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.target.value); // Zmiana języka na wybrany w select
  };
  useEffect(() => {
        const fetchSpeciesPhoto = async () => {
            const token = localStorage.getItem('token'); // Pobranie tokena z localStorage
            if (!token) {
                console.warn('Brak tokenu w localStorage');
                return;
            }
    
            try {
                const response = await fetch(`http://localhost:8080/api/speciesPhoto?speciesName=${newCreatureData.species}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`, // Wysłanie tokena w nagłówku
                    },
                });
    
                if (!response.ok) {
                    console.error('Błąd pobierania danych obrazka:', response.statusText);
                    return;
                }
                
                const photo = await response.json();
                setPhotoName(photo.photoName);
                console.log(photoName);
            } catch (error) {
                console.error('Błąd podczas pobierania danych obrazka:', error);
            }
  
        };
    
        fetchSpeciesPhoto(); // Wywołanie funkcji
    }, []);
    const sendNewName = async()=>
    {
        const token = localStorage.getItem('token'); // Pobranie tokena z localStorage
            if (!token) {
                console.warn('Brak tokenu w localStorage');
                return;
            }
            try{
                const response = await fetch('http://localhost:8080/api/setNewName',{
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({newName: name,
                    creatureid: newCreatureData._id
                    }),
                });
                if (!response.ok) {
                    throw new Error(`Błąd ${response.status}: ${response.statusText}`);
                  }
            }catch(error){
                console.error('Błąd podczas wysyłania danych:', error);
            }

    }
    const okClickActions = () =>
    {
        windowSwicher();
        sendNewName();
    }
  // Wygląd i logika komponentu
  return (
    <div className="absolute bg-black1 bg-opacity-90 w-full h-screen items-center flex flex-col">
      {/* Główne okno opcji */}
      <div className="relative bg-maincolor1 w-1/2 h-2/3 mt-[10vh] text-maincolor4 flex flex-col items-center rounded-3xl border-2 text-2xl space-y-4">
        {newCreatureData.species}
        <div className="relative h-[27vw] aspect-square bg-black1 rounded-xl border-maincolor5 border-2">
        {photoName &&(
        <img src={`images/${photoName}.png` } className="absolute w-full h-full object-cover rounded-xl"/>
        )
        }
        </div>
        Nadaj imie:
        <input type="text" value={name} onChange={(e)=> setName(e.target.value)} className='bg-black text-maincolor4 border border-maincolor5 rounded-xl'/>
        <button onClick={okClickActions} className='bottom-10 border-2 rounded-3xl w-1/6 border-maincolor5 hover:shadow-maincolor5 shadow-buttonshadow transition duration-300 hover:text-maincolor5'>OK</button>
      </div>
    </div>
  );
}

export default NewCreatureWindow; // Eksport komponentu