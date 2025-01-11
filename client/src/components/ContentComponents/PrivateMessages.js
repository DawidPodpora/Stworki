import React, { useState, useEffect } from 'react';

function PrivateMessages({data}) {
    const [messages, setMessages] = useState([]); //Przechowywanie wiadomości użytkownika
    const [newMessage, setNewMessage] = useState({receiver: '', title: '', content: ''});//Nowa wiadomość
    const [newMessageToAll, setNewMessageToAll] = useState({title: '', content: ''});
    const [selectedMessage, setSelectedMessage] = useState(null); //wybrana wiadomość
    const [showSendModal, setShowSendModal] = useState(false);
    const [showSendToAllModal, setShowSendToAllModal] = useState(false);
    const token = localStorage.getItem('token');
    const currentUser = data.username;

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
                    console.log('Pobrane wiadomości: ')
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

    //Wysyłanie wiadomości do wszystkich
    const sendMessageToAll = async() => {
        if(!newMessageToAll.title || !newMessageToAll.content){
            alert('Tytuł i treść są wymagane!');
            return;
        }
        try{
            const response = await fetch('http://localhost:8080/api/messageToAll', {
                method: 'POST',
                headers: {
                    'Content-Type' : 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(newMessageToAll),
            });
            if(response.ok){
                //alert('Wiadomość do wszystkich została wysłana!');
                setNewMessageToAll({title:'', content:''});
                setShowSendToAllModal(false);
            }else{
                const errorData = await response.json();
                alert(`Błąd: ${errorData.error || 'Nie udało się wysłać wiadomości do wszystkich użytkowników.'}`);
            }
        }catch(error){
            console.error('Błąd serwera: ',error);
        }
    };

    //Wysyłąnie nowej wiadomości
    const sendMessage = async () => {
        if(!newMessage.receiver || !newMessage.title || !newMessage.content){
            alert('Wszystkie pola są wymagane!');
            return;
        }
        if(newMessage.receiver === currentUser) {
            alert('Nie możesz wysłać wiadomości do samego siebie.');
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
                setShowSendModal(false);
            } else {
                const errorData = await response.json();
                alert(`Błąd: ${errorData.error || 'Nie udało się wysłać wiadomości.'}`);
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

    //Oznaczanie wiadomości jako przeczytana
    const markMessageAsReaded = async (messageId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/messages/${messageId}/read`, {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            if (!response.ok) 
            {
                throw new Error('Nie udało się oznaczyć wiadomości jako przeczytanej.');
            }
            console.log(`Wiadomość ${messageId} oznaczona jako przeczytana.`);
        } catch (error) {
            console.error(error.message);
        }
    };


    return (
        <div className="w-full h-screen bg-black flex flex-col p-5 justify-center text-maincolor4">
            {/* Zielony komponent na czarnym tle */}
            <div className="w-full h-full bg-maincolor1 p-5 rounded-xl flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Wiadomości prywatne</h1>
                    <button
                        onClick={() => setShowSendModal(true)}
                        className="bg-maincolor1 text-maincolor4 border-maincolor2 border px-4 py-2 rounded shadow hover:bg-opacity-80"
                    >
                        Wyślij wiadomość
                    </button>
                    {data.isAdmin && (
                        <button
                            onClick={() => setShowSendToAllModal(true)}
                            className="bg-maincolor4 text-black border-maincolor2 border px-4 py-2 rounded shadow hover:bg-opacity-80"
                        >
                            Wiadomość do wszystkich
                        </button>
                    )}
                </div>
    
                {/* Lista wiadomości */}
                <div className="p-4 rounded-xl overflow-y-auto space-y-4 flex-grow">
                    {messages.length > 0 ? (
                        messages.map((msg) => (
                            <div
                                key={msg._id}
                                className={`p-4 rounded-lg shadow-md border ${
                                    msg.isRead ? "border-maincolor2" : "border-maincolor5"
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-bold">{msg.title}</p>
                                        <p className="text-sm">Od: {msg.senderId.username}</p>
                                        <p className="text-xs">{new Date(msg.createdAt).toLocaleString()}</p>
                                    </div>
                                    <button
                                        onClick={() => deleteMessage(msg._id)}
                                        className="text-red-500 hover:text-red-700 text-sm"
                                    >
                                        Usuń
                                    </button>
                                </div>
                                <button
                                    onClick={() => {
                                        setSelectedMessage(selectedMessage === msg ? null : msg);
                                        if (!msg.isRead) markMessageAsReaded(msg._id);
                                    }}
                                    className="mt-2 text-blue-500 hover:underline"
                                >
                                    {selectedMessage === msg ? "Zwiń" : "Zobacz szczegóły"}
                                </button>
                                {selectedMessage === msg && (
                                    <div className="mt-4">
                                        <p className="text-sm">{msg.content}</p>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="text-center">Brak wiadomości</p>
                    )}
                </div>
            </div>
    
            {/* Modal do wysyłania wiadomości do wszystkich */}
            {showSendToAllModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
                    <div className="bg-maincolor1 p-6 rounded-lg shadow-md w-1/2">
                        <h2 className="text-lg font-bold mb-4">Wyślij wiadomość do wszystkich</h2>
                        <input
                            type="text"
                            placeholder="Tytuł"
                            value={newMessageToAll.title}
                            onChange={(e) => setNewMessageToAll({...newMessageToAll, title: e.target.value})}
                            className="w-full mb-4 p-2 border rounded bg-black text-maincolor4"
                        />
                        <textarea
                            placeholder="Treść"
                            value={newMessageToAll.content}
                            onChange={(e) => setNewMessageToAll({...newMessageToAll, content: e.target.value})}
                            className="w-full mb-4 p-2 border rounded bg-black text-maincolor4"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => {
                                    setShowSendToAllModal(false);
                                    setNewMessageToAll({title: '', content: ''});
                                }}
                                className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
                            >
                                Anuluj
                            </button>
                            <button
                                onClick={sendMessageToAll}
                                className="bg-maincolor4 text-black px-4 py-2 rounded shadow hover:bg-opacity-80"
                            >
                                Wyślij
                            </button>
                        </div>
                    </div>
                </div>
            )}
    
            {/* Modal do wysyłania wiadomości */}
            {showSendModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
                    <div className="bg-maincolor1 p-6 rounded-lg shadow-md w-1/2">
                        <h2 className="text-lg font-bold mb-4">Wyślij wiadomość</h2>
                        <input
                            type="text"
                            placeholder="Odbiorca"
                            value={newMessage.receiver}
                            onChange={(e) => setNewMessage({...newMessage, receiver: e.target.value})}
                            className="w-full mb-4 p-2 border rounded bg-black text-maincolor4"
                        />
                        <input
                            type="text"
                            placeholder="Tytuł"
                            value={newMessage.title}
                            onChange={(e) => setNewMessage({...newMessage, title: e.target.value})}
                            className="w-full mb-4 p-2 border rounded bg-black text-maincolor4"
                        />
                        <textarea
                            type="text"
                            placeholder="Treść"
                            value={newMessage.content}
                            onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                            className="w-full mb-4 p-2 border rounded bg-black text-maincolor4"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => {
                                    setShowSendModal(false);
                                    setNewMessage({receiver: '', title: '', content: ''});
                                }}
                                className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
                            >
                                Anuluj
                            </button>
                            <button
                                onClick={sendMessage}
                                className="bg-maincolor4 text-black px-4 py-2 rounded shadow hover:bg-opacity-80"
                            >
                                Wyślij
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
    
}
export default PrivateMessages;