import React, { useState, useEffect, useRef } from 'react';
import { Send, User, MessageSquare } from 'lucide-react';

// The main Chat App component
const App = () => {
  // State to hold all messages in the chat, including system messages
  const [messages, setMessages] = useState([]);
  // State for the user's name
  const [username, setUsername] = useState('');
  // State for the current message being typed
  const [input, setInput] = useState('');
  // State for the current user's unique ID. We'll simulate this.
  const [userId, setUserId] = useState(null);
  // State for the list of online users
  const [onlineUsers, setOnlineUsers] = useState([]);
  // State for the typing indicator
  const [isTyping, setIsTyping] = useState(false);
  // Ref to automatically scroll to the bottom of the chat
  const messagesEndRef = useRef(null);
  // Ref to store the simulated WebSocket 'connection'
  const wsRef = useRef(null);

  // This useEffect simulates the WebSocket connection setup and teardown, and initial state.
  useEffect(() => {
    // Generate a unique user ID and prompt for a username on load
    const newUser = {
      id: `user-${Math.random().toString(36).substring(2, 9)}`,
      name: prompt('Please enter your name:') || 'Guest'
    };
    setUserId(newUser.id);
    setUsername(newUser.name);

    // Initial list of simulated online users
    const initialUsers = [
      { id: 'user-friend1', name: 'Friend' },
      { id: 'user-friend2', name: 'Dev' },
      { id: 'user-bot', name: 'ChatBot' },
    ];
    setOnlineUsers([...initialUsers, newUser]);

    // Add a system message for the new user joining
    const systemJoinMessage = {
      id: `sys-join-${Date.now()}`,
      sender: 'system',
      text: `${newUser.name} has joined the chat.`,
      timestamp: new Date().toLocaleTimeString(),
      type: 'system',
    };
    setMessages(prevMessages => [...prevMessages, systemJoinMessage]);
    
    // Simulate a WebSocket connection
    const mockWebSocket = {
      // Simulate sending a message to the "server"
      send: (data) => {
        const message = JSON.parse(data);
        console.log(`Sending message to server: ${message.text}`);

        // Simulate a response from the "server"
        setTimeout(() => {
          // A different user starts typing
          setIsTyping(true);
        }, 500);

        setTimeout(() => {
          setIsTyping(false);
          const friendName = 'Dev';
          const friendMessage = {
            id: `msg-${Date.now() + 1}`,
            sender: friendName,
            text: `Hey, ${message.sender}! Thanks for your message.`,
            timestamp: new Date().toLocaleTimeString(),
            userId: 'user-friend2'
          };
          setMessages(prevMessages => [...prevMessages, friendMessage]);
        }, 2000);
      },
      // Simulate closing the connection
      close: () => {
        console.log('Simulated WebSocket connection closed.');
      }
    };

    // Store the mock WebSocket instance in a ref
    wsRef.current = mockWebSocket;

    // The cleanup function for the effect. It runs when the component unmounts.
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []); // The empty dependency array ensures this runs only once on mount

  // This effect scrolls the chat container to the bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Function to handle sending a message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim() === '') return; // Don't send empty messages

    // Create the new message object
    const newMessage = {
      id: `msg-${Date.now()}`,
      sender: username,
      text: input,
      timestamp: new Date().toLocaleTimeString(),
      userId: userId,
      type: 'user'
    };

    // Add the new message to the chat
    setMessages(prevMessages => [...prevMessages, newMessage]);

    // Simulate sending the message via the WebSocket
    if (wsRef.current) {
      wsRef.current.send(JSON.stringify(newMessage));
    }

    // Clear the input field
    setInput('');
  };

  // Function to determine if a message is from the current user
  const isCurrentUser = (msg) => msg.userId === userId;

  return (
    <div className="flex h-screen bg-gray-100 font-sans antialiased">
      {/* Sidebar for online users (hidden on mobile, visible on larger screens) */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-800 text-white p-4 shadow-lg">
        <h2 className="text-xl font-bold mb-4 flex items-center">
          <User size={20} className="mr-2" />
          Online Users
        </h2>
        <ul className="space-y-2 flex-1">
          {onlineUsers.map(user => (
            <li key={user.id} className="flex items-center p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors">
              <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
              {user.name}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-4 border-t border-gray-700">
          <div className="text-sm text-gray-400">Your ID:</div>
          <div className="font-mono text-xs text-gray-300 overflow-hidden text-ellipsis whitespace-nowrap">{userId}</div>
        </div>
      </aside>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col">
        {/* Header section with app title and CODTECH branding */}
        <header className="flex-none bg-white shadow-lg p-4 flex items-center justify-between z-10">
          <div className="flex items-center">
            <MessageSquare size={24} className="text-blue-600 mr-2 hidden md:block" />
            <h1 className="text-2xl font-bold text-gray-800">
              <span className="text-blue-600">Real-Time</span> Chat
            </h1>
          </div>
          <div className="flex flex-col items-end">
            <span className="text-xs text-gray-400">CODTECH Internship</span>
            <span className="text-xs text-gray-400">Final Deliverable</span>
          </div>
        </header>

        {/* Main chat area with message history */}
        <main className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-200">
          {messages.map((message) => {
            // Check for system messages
            if (message.type === 'system') {
              return (
                <div key={message.id} className="text-center text-xs text-gray-500 italic py-2">
                  {message.text}
                </div>
              );
            }

            // Render regular chat messages
            return (
              <div
                key={message.id}
                className={`flex items-start ${isCurrentUser(message) ? 'justify-end' : 'justify-start'}`}
              >
                {/* Display the sender's avatar or icon */}
                {!isCurrentUser(message) && (
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                    <User size={18} className="text-gray-600" />
                  </div>
                )}
                
                {/* The message bubble */}
                <div className={`p-3 rounded-2xl shadow max-w-sm lg:max-w-md ${isCurrentUser(message) ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none'}`}>
                  <div className="font-semibold text-xs mb-1 opacity-80">
                    {message.sender}
                  </div>
                  <div className="text-sm">
                    {message.text}
                  </div>
                  <div className={`text-[10px] mt-1 ${isCurrentUser(message) ? 'text-blue-200' : 'text-gray-400'} flex justify-end`}>
                    {message.timestamp}
                  </div>
                </div>
              </div>
            );
          })}
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex items-center justify-start">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center mr-2">
                <User size={18} className="text-gray-600" />
              </div>
              <div className="p-3 rounded-2xl shadow max-w-sm bg-white text-gray-800 rounded-bl-none">
                <div className="text-xs text-gray-500 italic">
                  Dev is typing<span className="animate-pulse">...</span>
                </div>
              </div>
            </div>
          )}
          {/* Empty div for auto-scrolling */}
          <div ref={messagesEndRef} />
        </main>

        {/* Input form for sending new messages */}
        <footer className="flex-none bg-white p-4 shadow-inner">
          <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 p-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              placeholder="Type your message..."
              disabled={!username}
            />
            <button
              type="submit"
              className="w-12 h-12 flex items-center justify-center bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400"
              disabled={!username || input.trim() === ''}
            >
              <Send size={20} />
            </button>
          </form>
        </footer>
      </div>
    </div>
  );
};

export default App;
