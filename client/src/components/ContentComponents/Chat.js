import React, { useState, useEffect, useRef } from 'react';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatRef = useRef(null);

  // Lista dostępnych emotikonów
  const emojiList = [
    "😊", "😂", "😢", "😍", "😎", "😱", "🤔", "😅", "🥺", "😤", "❤️", "🔥"
  ];

  // Automatycznie przewijaj czat na dół po każdej nowej wiadomości
  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: 'me', // wiadomość od użytkownika
      };
      setMessages((prevMessages) => [...prevMessages, message]);
      setNewMessage('');
    }
  };

  // Funkcja do dodawania emotikonu do wiadomości
  const addEmoji = (emoji) => {
    setNewMessage(newMessage + emoji);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      <div className="flex-grow overflow-y-auto space-y-2 p-5">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-2 max-w-xs rounded-lg ${
              message.sender === 'me'
                ? 'ml-auto bg-blue-600 text-white'
                : 'mr-auto bg-gray-700 text-white'
            }`}
          >
            <span className="font-semibold">
              {message.sender === 'me' ? 'Ty' : 'Inny użytkownik'}:
            </span>{" "}
            {message.text}
          </div>
        ))}

        <div ref={chatRef} />
      </div>

      <div className="flex flex-col bg-gray-900 p-4 rounded-lg">
        {/* Dodawanie emotikonów */}
        <div className="flex flex-wrap gap-2 mb-4">
          {emojiList.map((emoji, index) => (
            <button
              key={index}
              onClick={() => addEmoji(emoji)}
              className="text-2xl p-2 hover:bg-gray-700 rounded-lg"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Pole wejściowe i przycisk wysyłania */}
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
    </>
  );
}

export default Chat;
