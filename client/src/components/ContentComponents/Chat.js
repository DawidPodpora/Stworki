import React, { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

function Chat({data}) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatRef = useRef(null);
  const socket = useRef(null);
  const currentUser = data.username;
  // Automatycznie przewijaj czat na dół po każdej nowej wiadomości
  useEffect(() => {
    // połącz z backendem WebSocket
    socket.current = io('http://localhost:8080');
    //pobierz historię czatu
    socket.current.on('chatHistory', (history) => {
      setMessages(history);
    });

    // Obsługa odbioru nowej wiadomości
    socket.current.on('newMessage',(message) =>
    {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.current.disconnect(); //rozłącz websocket przy odmontowaniu
    };
  }, []);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth'});
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        userId: data._id,
        text: newMessage,
        sender: currentUser, // wiadomość od użytkownika<-wysyłaćtoken
        isAdmin: data.isAdmin,
      };
      socket.current.emit('newMessage',message);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto space-y-2 p-5">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-2 max-w-xs rounded-lg break-words ${
              message.sender === currentUser
                ? 'ml-auto bg-maincolor1 text-white bg-opacity-70'
                : 'mr-auto bg-maincolor2 text-white bg-opacity-70'
            } &{
              message.isAdmin ? 'border-2 border-maincolor5' : '' 
            }`}
          >
            <span 
              className={`font-semibold ${
                message.isAdmin ? 'text-maincolor5' :'text-white'

              }`}
              >
                {message.sender}:
            </span>{" "}
            {message.text}
          </div>
        ))}

        <div ref={chatRef} />
      </div>

        {/* Pole wejściowe i przycisk wysyłania */}
      <div className="flex flex-col bg-gray-900 p-4 rounded-lg">
        <div className="mt-4 flex">
          <input
            type="text"
            className="flex-grow p-2 rounded-l-lg bg-gray-800 text-white border border-gray-700 focus:outline-none"
            placeholder="Wpisz swoją wiadomość..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            onClick={handleSendMessage}
            className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700"
          >
            Wyślij
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
