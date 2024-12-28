import React, { useState, useEffect } from 'react';

function PrivateMessages() {
    const [messages, setMessages] = useState([]); //Przechowywanie wiadomości użytkownika
    const [newMessage, setNewMessage] = useState({receiver: '', title: '', content: ''});//Nowa wiadomość
    const [selectedMessage, setSelectedMessage] = useState(null); //wybrana wiadomość
    const token = localStorage.getItem('token');

    //Pobieranie wiadomości po załadowaniu komponentu
    useEffect(() => {
        const fetchMessages = async () => {
            try{
                const response = await fetch('http://localhost:8080/api/messages', {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (response.ok){
                    const data = await response.json();
                    console.log('Pobrane wiadomości: ',data);
                    setMessages(data);//Ustawienie wiadomości
                }else{
                    console.error('Błąd podczas pobierania wiadomości');
                }
            } catch(error){
                console.error('Błąd serwera:',error);
            }
        };
        fetchMessages();
    }, [token]);

    //Wysyłąnie nowej wiadomości
    const sendMessage = async () => {
        if(!newMessage.receiver || !newMessage.title || !newMessage.content){
            alert('Wszystkie pola są wymagane!');
            return;
        }
        try{
            const response = await fetch('http://localhost:8080/api/message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newMessage),
            });
            if(response.ok){
                alert('Wiadomość wysłana!');
                setNewMessage({receiver: '', title: '', content: ''}); //reset formularza
            } else {
                console.error('Błąd podczas wysyłania wiadomości');
            }
        } catch (error) {
            console.error('Błąd serwera:', error);
        }
    };

    //Usuwanie wiadomości
    const deleteMessage = async (messageId) => {
        try{
            const response = await fetch(`http://localhost:8080/api/messages/${messageId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (response.ok) {
                setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== messageId));
            } else {
                console.error('Błąd podczas usuwania wiadomości');
            }
        } catch (error){
            console.error('Błąd serwera:', error);
        }
    };

    return (
        <div className="p-6 bg-gray-100 h-screen">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Wiadomości prywatne</h2>
    
          {/* Lista wiadomości */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">Twoje wiadomości</h3>
            {messages.length > 0 ? (
              <ul className="space-y-4">
                {messages.map((msg) => (
                  <li
                    key={msg._id}
                    className={`p-4 rounded-lg shadow-md border ${
                      msg.isRead ? 'bg-white' : 'bg-blue-50'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-gray-800">{msg.title}</span>
                      <button
                        onClick={() => deleteMessage(msg._id)}
                        className="text-red-500 hover:text-red-700 text-sm"
                      >
                        Usuń
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">Od: {msg.senderId.username}</p>
                    <button
                      onClick={() => setSelectedMessage(msg)}
                      className="text-blue-500 hover:underline mt-2"
                    >
                      Zobacz szczegóły
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">Brak wiadomości</p>
            )}
          </div>
    
          {/* Wyświetlanie szczegółów wiadomości */}
          {selectedMessage && (
            <div className="mb-8 bg-white shadow-md rounded-lg p-6 border">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Szczegóły wiadomości</h3>
              <p>
                <strong>Od:</strong> {selectedMessage.senderUsername}
              </p>
              <p>
                <strong>Tytuł:</strong> {selectedMessage.title}
              </p>
              <p>
                <strong>Treść:</strong> {selectedMessage.content}
              </p>
              <button
                onClick={() => setSelectedMessage(null)}
                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
              >
                Zamknij
              </button>
            </div>
          )}
    
          {/* Formularz wysyłania nowej wiadomości */}
          <div className="bg-white shadow-md rounded-lg p-6 border">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Wyślij nową wiadomość</h3>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Odbiorca"
                value={newMessage.receiver}
                onChange={(e) => setNewMessage({ ...newMessage, receiver: e.target.value })}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <input
                type="text"
                placeholder="Tytuł"
                value={newMessage.title}
                onChange={(e) => setNewMessage({ ...newMessage, title: e.target.value })}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <textarea
                placeholder="Treść"
                value={newMessage.content}
                onChange={(e) => setNewMessage({ ...newMessage, content: e.target.value })}
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={sendMessage}
              className="bg-blue-500 text-white px-4 py-2 rounded shadow hover:bg-blue-600"
            >
              Wyślij
            </button>
          </div>
        </div>
      );
    }
    
    export default PrivateMessages;