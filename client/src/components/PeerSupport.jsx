import { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { io } from 'socket.io-client';
import { Send, Users, MessageSquare, LogOut, Smile } from 'lucide-react';

const PeerSupport = () => {
  const { user, isAuthenticated } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentRoom, setCurrentRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState('');
  const [usersInRoom, setUsersInRoom] = useState(0);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const rooms = [
    { id: 'anxiety', name: 'Anxiety Support', icon: '😰', description: 'Share experiences and coping strategies' },
    { id: 'exams', name: 'Exam Stress', icon: '📚', description: 'Prepare together and share study tips' },
    { id: 'depression', name: 'Depression Help', icon: '💙', description: 'Safe space to talk and listen' },
    { id: 'stress', name: 'Stress Management', icon: '🧘', description: 'Relaxation techniques and support' },
    { id: 'social', name: 'Social Anxiety', icon: '👥', description: 'Building confidence together' },
    { id: 'general', name: 'General Support', icon: '💬', description: 'Open discussions about mental health' },
  ];

  useEffect(() => {
    if (!isAuthenticated) return;

    socketRef.current = io(import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');

    socketRef.current.on('connect', () => {
      setConnectionStatus('connected');
      console.log('Connected to socket server');
    });

    socketRef.current.on('disconnect', () => {
      setConnectionStatus('disconnected');
      console.log('Disconnected from socket server');
    });

    socketRef.current.on('roomJoined', ({ room, users }) => {
      console.log(`Joined room: ${room}`);
      setUsersInRoom(users);
    });

    socketRef.current.on('userJoined', ({ username, users }) => {
      setUsersInRoom(users);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: 'system',
          message: `${username} joined the room`,
          timestamp: new Date().toISOString(),
        },
      ]);
    });

    socketRef.current.on('userLeft', ({ username, users }) => {
      setUsersInRoom(users);
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          type: 'system',
          message: `${username} left the room`,
          timestamp: new Date().toISOString(),
        },
      ]);
    });

    socketRef.current.on('newMessage', (messageData) => {
      setMessages((prev) => [...prev, { ...messageData, type: 'chat' }]);
    });

    socketRef.current.on('error', ({ message }) => {
      console.error('Socket error:', message);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [isAuthenticated]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const joinRoom = (roomId) => {
    if (currentRoom) {
      socketRef.current.emit('leaveRoom', { room: currentRoom });
    }
    setCurrentRoom(roomId);
    setMessages([]);
    socketRef.current.emit('joinRoom', {
      room: roomId,
      userId: user?.id,
      username: user?.name,
    });
  };

  const leaveRoom = () => {
    if (currentRoom && socketRef.current) {
      socketRef.current.emit('leaveRoom', { room: currentRoom });
      setCurrentRoom(null);
      setMessages([]);
    }
  };

  const sendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !currentRoom || !socketRef.current) return;

    socketRef.current.emit('chatMessage', {
      room: currentRoom,
      userId: user?.id,
      username: user?.name,
      message: messageInput.trim(),
    });
    setMessageInput('');
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const selectedRoom = rooms.find((r) => r.id === currentRoom);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 lg:ml-0">
          <div className="p-4 sm:p-6 lg:p-8">
            <div className="mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Peer Support</h1>
              <p className="mt-1 text-gray-600">
                Connect with others facing similar challenges in a safe, supportive environment
              </p>
              <div className="mt-2 flex items-center space-x-2">
                <div
                  className={`h-2 w-2 rounded-full ${
                    connectionStatus === 'connected' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                />
                <span className="text-sm text-gray-600">
                  {connectionStatus === 'connected' ? 'Connected' : 'Disconnected'}
                </span>
              </div>
            </div>

            {!currentRoom ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => joinRoom(room.id)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl">{room.icon}</div>
                      <MessageSquare className="h-5 w-5 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{room.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{room.description}</p>
                    <button className="w-full bg-primary-600 text-white py-2 px-4 rounded-lg hover:bg-primary-700 transition-colors">
                      Join Room
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="bg-primary-600 text-white p-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{selectedRoom.icon}</span>
                    <div>
                      <h2 className="text-lg font-semibold">{selectedRoom.name}</h2>
                      <p className="text-sm text-primary-100">{selectedRoom.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">{usersInRoom}</span>
                    </div>
                    <button
                      onClick={leaveRoom}
                      className="flex items-center space-x-1 bg-primary-700 hover:bg-primary-800 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      <span className="text-sm">Leave</span>
                    </button>
                  </div>
                </div>

                <div className="h-96 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <Smile className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                        <p>No messages yet. Be the first to say hello!</p>
                      </div>
                    </div>
                  ) : (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.userId === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        {msg.type === 'system' ? (
                          <div className="bg-gray-200 text-gray-600 text-xs py-1 px-3 rounded-full">
                            {msg.message}
                          </div>
                        ) : (
                          <div
                            className={`max-w-xs sm:max-w-md ${
                              msg.userId === user?.id
                                ? 'bg-primary-600 text-white'
                                : 'bg-white border border-gray-200 text-gray-900'
                            } rounded-lg p-3 shadow-sm`}
                          >
                            {msg.userId !== user?.id && (
                              <p className="text-xs font-semibold mb-1 text-primary-600">{msg.username}</p>
                            )}
                            <p className="text-sm">{msg.message}</p>
                            <p
                              className={`text-xs mt-1 ${
                                msg.userId === user?.id ? 'text-primary-200' : 'text-gray-500'
                              }`}
                            >
                              {new Date(msg.timestamp).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </p>
                          </div>
                        )}
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 bg-white">
                  <div className="flex space-x-3">
                    <input
                      type="text"
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                    <button
                      type="submit"
                      disabled={!messageInput.trim()}
                      className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default PeerSupport;
