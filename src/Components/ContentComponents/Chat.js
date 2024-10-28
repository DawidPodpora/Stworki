import React, { useState, useEffect, useRef } from 'react';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatRef = useRef(null);

  // Scroll to the bottom when a new message is added
  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: Date.now(),
        text: newMessage,
        sender: 'me', // or 'other' depending on the sender
      };
      setMessages([...messages, message]);
      setNewMessage('');
      // Here you would also send the message to the server via WebSocket
    }
  };

  return (
    <>
    <div className="flex-grow overflow-y-auto space-y-2 p-5">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-2 max-w-xs rounded-lg ${
              message.sender === 'me' ? 'ml-auto bg-blue-600 text-white' : 'mr-auto bg-gray-700 text-white'
            }`}
          >
            {message.text}
          </div>
        ))}
        <div ref={chatRef} />
      </div>
    <div className="flex flex-col bg-gray-900 p-4 rounded-lg">
      {/* Messages Container */}
      

      {/* Input and Send Button */}
      <div className="mt-4 flex">
        <input
          type="text"
          className="flex-grow p-2 rounded-l-lg bg-gray-800 text-white border border-gray-700 focus:outline-none"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button
          onClick={handleSendMessage}
          className="bg-blue-600 text-white p-2 rounded-r-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
    </>
  );
}

export default Chat;
