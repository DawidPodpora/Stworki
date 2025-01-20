import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
function PrivateMessages({data}) {
    const [messages, setMessages] = useState([]); //Przechowywanie wiadomości użytkownika
    const [newMessage, setNewMessage] = useState({receiver: '', title: '', content: ''});//Nowa wiadomość
    const [newMessageToAll, setNewMessageToAll] = useState({title: '', content: ''});
    const [selectedMessage, setSelectedMessage] = useState(null); //wybrana wiadomość
    const [showSendModal, setShowSendModal] = useState(false);
    const [showSendToAllModal, setShowSendToAllModal] = useState(false);
    const [showReplyModal, setShowReplyModal] = useState(false);
    const token = localStorage.getItem('token');
    const currentUser = data.username;
    const { t } = useTranslation();

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
                setMessages(data);//Ustawienie wiadomości
            }else{
                console.error(t('fetchMessagesError'));
            }
        } catch(error){
            console.error(t('serverError'),error);
        }
    };
    //Pobieranie wiadomości po załadowaniu komponentu
    useEffect(() => {
        fetchMessages();
    }, [token]);
    //Wysyłanie wiadomości do wszystkich
    const sendMessageToAll = async() => {
        if(!newMessageToAll.title || !newMessageToAll.content){
            alert(t('titleAndContent'));
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
            console.error(t('serverError'),error);
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
                setShowReplyModal(false);
            } else {
                const errorData = await response.json();
                alert(`Błąd: ${errorData.error || 'Nie udało się wysłać wiadomości.'}`);
            }
        } catch (error) {
            console.error(t('serverError'), error);
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
                console.error(t('deleteMessagesError'));
            }
        } catch (error){
            console.error(t('serverError'), error);
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

    //Otwieranie modala do odpowiedzi
    const openReplyModal = (senderUsername) => {
        setNewMessage({receiver: senderUsername, title: '', content: ''});
        setShowReplyModal(true);
    };



    return (
        <div className="w-full h-screen bg-black flex flex-col p-5 justify-center text-maincolor4">
            {/* Zielony komponent na czarnym tle */}
            <div className="w-full h-full bg-maincolor1 p-5 rounded-xl flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">{t('privateMessages')}</h1>
                    <button
                    onClick={() => fetchMessages()}
                    className="bg-maincolor1 text-maincolor4 border-maincolor2 border px-4 py-2 rounded shadow hover:bg-opacity-80"
                    >
                        {t('refresh')}
                    </button>
                    <button
                        onClick={() => setShowSendModal(true)}
                        className="bg-maincolor1 text-maincolor4 border-maincolor2 border px-4 py-2 rounded shadow hover:bg-opacity-80"
                    >
                        {t('sendMessage')}
                    </button>
                    {data.isAdmin && (
                        <button
                            onClick={() => setShowSendToAllModal(true)}
                            className="bg-maincolor4 text-black border-maincolor2 border px-4 py-2 rounded shadow hover:bg-opacity-80"
                        >
                            {t('sendMessageToAll')}
                        </button>
                    )}
                </div>
    
                {/* Lista wiadomości */}
                <div className="p-4 rounded-xl overflow-y-auto space-y-4 flex-grow">
                {messages.length > 0 ? (
                    messages.map((msg) => (
                        msg.senderId ? (
                            <div
                                key={msg._id}
                                className={`p-4 rounded-lg shadow-md border ${
                                    msg.isRead ? "border-maincolor2" : "border-maincolor5"
                                }`}
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="font-bold">{msg.title}</p>
                                        <p className="text-sm">{t('from')} {msg.senderId ? msg.senderId.username : t('unknownUser')}</p>
                                        <p className="text-xs">{new Date(msg.createdAt).toLocaleString()}</p>
                                    </div>
                                    <button
                                        onClick={() => deleteMessage(msg._id)}
                                        className="text-red-500 hover:text-red-700 text-sm"
                                    >
                                        {t('delete')}
                                    </button>
                                </div>
                                <div className="space-x-4 mt-2">
                                    <button
                                        onClick={() => {
                                            setSelectedMessage(selectedMessage === msg ? null : msg);
                                            if (!msg.isRead) markMessageAsReaded(msg._id);
                                        }}
                                        className="mt-2 text-blue-500 hover:underline"
                                    >
                                        {selectedMessage === msg ? t('hide') : t('show')}
                                    </button>
                                    <button
                                        onClick={() => openReplyModal(msg.senderId.username)}
                                        className="text-green-500 hover:underline"
                                    >
                                        {t('reply')}
                                    </button>
                                </div>
                                {selectedMessage === msg && (
                                    <div className="mt-4">
                                        <p className="text-sm">{msg.content}</p>
                                    </div>
                                )}
                            </div>
                        ) : null // Dodaj odpowiednie zachowanie, gdy senderId jest null
                    ))
                ) : (
                    <p className="text-center">{t('noMessages')}</p>
                )}
                </div>
            </div>
    
            {/*Modal do odpowiedzi */}
            {showReplyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
                    <div className="bg-maincolor1 p-6 rounded-lg shadow-md w-1/2">
                        <h2 className="text-lg font-bold mb-4"> {t('replyTo')} {newMessage.receiver}</h2>
                        <input
                            type="text"
                            placeholder={t('title')}
                            value={newMessage.title}
                            onChange={(e) => setNewMessage({...newMessage, title: e.target.value})}
                            className="w-full mb-4 p-2 border rounded bg-black text-maincolor4"
                            />
                            <textarea
                            placeholder={t('content')}
                            value={newMessage.content}
                            onChange={(e) => setNewMessage({...newMessage, content: e.target.value})}
                            className="w-full mb-4 p-2 border rounded bg-black text-maincolor4"
                        />
                        <div className="flex justify-end space-x-2">
                            <button
                                onClick={() => setShowReplyModal(false)}
                                className="bg-red-500 text-white px-4 py-2 rounded shadow hover:bg-red-600"
                            >
                                {t('cancel')}
                            </button>
                            <button
                                onClick={sendMessage}
                                className="bg-maincolor4 text-black px-4 py-2 rounded shadow hover:bg-opacity-80"
                            >
                                {t('send')}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal do wysyłania wiadomości do wszystkich */}
            {showSendToAllModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
                    <div className="bg-maincolor1 p-6 rounded-lg shadow-md w-1/2">
                        <h2 className="text-lg font-bold mb-4">{t('sendMessageToAll')}</h2>
                        <input
                            type="text"
                            placeholder={t('title')}
                            value={newMessageToAll.title}
                            onChange={(e) => setNewMessageToAll({...newMessageToAll, title: e.target.value})}
                            className="w-full mb-4 p-2 border rounded bg-black text-maincolor4"
                        />
                        <textarea
                            placeholder={t('content')}
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
                                {t('cancel')}
                            </button>
                            <button
                                onClick={sendMessageToAll}
                                className="bg-maincolor4 text-black px-4 py-2 rounded shadow hover:bg-opacity-80"
                            >
                                {t('send')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
    
            {/* Modal do wysyłania wiadomości */}
            {showSendModal && (
                <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center">
                    <div className="bg-maincolor1 p-6 rounded-lg shadow-md w-1/2">
                        <h2 className="text-lg font-bold mb-4">{t('sendMessage')}</h2>
                        <input
                            type="text"
                            placeholder={t('receiver')}
                            value={newMessage.receiver}
                            onChange={(e) => setNewMessage({...newMessage, receiver: e.target.value})}
                            className="w-full mb-4 p-2 border rounded bg-black text-maincolor4"
                        />
                        <input
                            type="text"
                            placeholder={t('title')}
                            value={newMessage.title}
                            onChange={(e) => setNewMessage({...newMessage, title: e.target.value})}
                            className="w-full mb-4 p-2 border rounded bg-black text-maincolor4"
                        />
                        <textarea
                            type="text"
                            placeholder={t('content')}
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
                                {t('cancel')}
                            </button>
                            <button
                                onClick={sendMessage}
                                className="bg-maincolor4 text-black px-4 py-2 rounded shadow hover:bg-opacity-80"
                            >
                                {t('send')}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
    
}
export default PrivateMessages;