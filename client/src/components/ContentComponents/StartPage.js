import React, { useEffect, useState } from 'react';
import Chat from './Chat';
import Notice from './Notice';

function StartPage({data}) {
  const [notices, setNotices] = useState([]); //stan do przechowywania ogłoszeń
  const [showModal, setShowModal] = useState(false);
  const [newNotice, setNewNotice] = useState({title:'', content:''});

  useEffect(() => {
    fetch('http://localhost:8080/api/notices')
      .then((response) => response.json())
      .then((data) => setNotices(data))
      .catch((error) => console.error('Błąd podczas pobierania ogłoszeń: ',error));
  }, []);

  //Obsługa dodawania ogłoszenia
  const handleAddNotice = async () => {
    if(!newNotice.title || !newNotice.content){
      alert('Tytuł i treść są wymagane!');
      return;
    }
    
    try{
      const response = await fetch('http://localhost:8080/api/notices',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(newNotice),
      });
      
      if(response.ok){
        const addedNotice = await response.json();
        setNotices([addedNotice, ...notices]);
        setShowModal(false);
        setNewNotice({title:'', content:''});
      } else{
        alert('Błąd podczas dodawania ogłoszenia!');
      }
    } catch(error){
      console.error('Błąd serwera: ',error);
    }
  };
  //Obsługa usuwania ogłoszenia
  const handleDeleteNotice = async (id) => {
    try{
      const response = await fetch(`http://localhost:8080/api/notices/${id}`,{
        method: 'DELETE',
        headers:{
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if(response.ok){
        setNotices(notices.filter((notice) => notice._id !== id)); //aktualizacja stanu po usunięciu
      } else{
        alert('Błąd podczas usuwania ogłoszenia!');
      }
    }catch(error){
      console.error('Błąd serwera', error);
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
          onClick={() => setShowModal(true)}
          >
            Dodaj Ogłoszenie
          </button>
        )}

        {/* Dynamicznie renderowanie ogłoszeń */}
        {notices.map((notice) => (
          <div key={notice._id} className="relative">
            <Notice title={notice.title} content={notice.content} />
            {data.isAdmin && (
              <button
              onClick={() => handleDeleteNotice(notice._id)}
              className="absolute top-2 right-2 bg-red-500 text-white px-2 py1 rounded-full"
              >
                x
              </button>
            )}
            </div>
        ))}
      </div>

      {/* Sekcja czatu */}
      <div className="w-1/3 flex flex-col justify-between bg-gray-900 p-4 border-l border-gray-700">
        <h2 className="text-2xl font-bold text-white">Czat</h2>
        <Chat data={data} />
      </div>

      {/* Modal do tworzenia ogłoszenia */}
      {showModal &&(
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
          <div className="bg-maincolor1 p-6 rounded-lg shadow-md w-1/2">
            <h2 className="text-white text-xl font-bold mb-4">Dodaj nowe ogłoszenie</h2>
            <input
              type="text"
              placeholder="Tytuł"
              value={newNotice.title}
              onChange={(e) => setNewNotice({...newNotice, title: e.target.value})}
              className="w-full mb-4 p-2 border rounded bg-black text-maincolor4"
            />
            <textarea
              placeholder="Treść"
              value={newNotice.content}
              onChange={(e) => setNewNotice({...newNotice, content: e.target.value})}
              className="w-full mb-4 p-2 border rounded bg-black text-maincolor4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowModal(false)}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Anuluj
              </button>
              <button
                onClick={handleAddNotice}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Dodaj
              </button>
            </div>
          </div>
      </div>
      )}
    </div>
  );
}

export default StartPage;
