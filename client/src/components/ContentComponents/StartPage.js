import React, { useEffect, useState } from 'react';
import Chat from './Chat';
import Notice from './Notice'; // Komponent do wyświetlania ogłoszeń

function StartPage({data}) {
  const [notices, setNotices] = useState([]); //stan do przechowywania ogłoszeń
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    //Sprawdzanie czy admin
    setIsAdmin(data.isAdmin);
    //Pobranie ogłoszeń
    const fetchNotices = async () => {
      try{
        const response = await fetch('http://localhost:8080/api/notices');
        if(!response.ok) {
          console.error('Błąd podczas pobierania ogłoszeń');
        }
        const data = await response.json();
        setNotices(data);
      } catch(error){
        console.error(error)
      }
    };
    fetchNotices();
  }, [data.isAdmin]);

  const handleAddNotice = async () => {
    const newNotice = {title: 'Nowe Ogłoszenie', content: 'Treść ogłoszenia'};

    try{
      const response = await fetch('http://localhost:8080/api/notices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${data.token}`,
        },
        body: JSON.stringify(newNotice),
      });
      
      if(!response.ok){
        console.error('Błąd podczas dodawania ogłoszenia');
      }
      
      const savedNotice = await response.json();
      setNotices((prevNotices) => [savedNotice, ...prevNotices]);
    } catch (error){
      console.error(error);
    }
  };

  return (
    <div className="flex h-full">
      {/* Tablica Ogłoszeń */}
      <div className="w-2/3 bg-gray-800 p-4">
        <h2 className="text-2xl font-bold text-white mb-4">Tablica Ogłoszeń</h2>
        
        {data.isAdmin && (
          <button
          className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          onClick={handleAddNotice}
          >
            Dodaj Ogłoszenie
          </button>
        )}

        {/* Dynamicznie renderowanie ogłoszeń */}
        {notices.map((notice, index) => (
          <Notice key={index} title={notice.title} content={notice.content} />
        ))}
      </div>

      {/* Sekcja czatu */}
      <div className="w-1/3 flex flex-col justify-between bg-gray-900 p-4 border-l border-gray-700">
        <h2 className="text-2xl font-bold text-white">Czat</h2>
        <Chat data={data} />
      </div>
    </div>
  );
}

export default StartPage;
