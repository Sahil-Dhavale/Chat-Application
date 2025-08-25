import React, { useState } from "react";
import ChatWindow from "./components/ChatWindow";
import MessageInput from "./components/MessageInput";
import { dummyMessages } from "./utils/dummyMessages";

function App() {
  const [messages, setMessages] = useState(dummyMessages);

  const handleSend = (text) => {
    if (text.trim()) {
      const newMessage = { sender: "You", text };
      setMessages([...messages, newMessage]);
    }
  };

  return (
    <div className="app">
      <h2 className="app-header">💬 Simple Chat App</h2>
      <ChatWindow messages={messages} />
      <MessageInput onSend={handleSend} />
    </div>
  );
}

export default App;
