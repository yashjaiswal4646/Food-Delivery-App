import React, { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane, FaSpinner, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { useSelector } from 'react-redux';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const AIChatButton = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const messagesEndRef = useRef(null);
    const { user } = useSelector((state) => state.auth);

    // Initial greeting message
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            setMessages([
                {
                    role: 'assistant',
                    content: "👋 Hi! I'm FoodieAI, your food delivery assistant powered by Google Gemini. Ask me anything about ordering, payments, delivery, or our services!"
                }
            ]);
        }
    }, [isOpen]);

    // Fetch suggestions
    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const response = await axios.get(`${API_URL}/ai/suggestions`);
                setSuggestions(response.data.suggestions);
            } catch (error) {
                console.error('Error fetching suggestions:', error);
            }
        };
        fetchSuggestions();
    }, []);

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const sendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage.trim();
        setInputMessage('');
        
        // Add user message to chat
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                setMessages(prev => [...prev, { 
                    role: 'assistant', 
                    content: "Please login to use the AI assistant. You can login from the top navigation bar." 
                }]);
                setIsLoading(false);
                return;
            }

            const config = {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            };

            // Prepare conversation history (last 5 messages for context)
            const conversationHistory = messages.slice(-5).map(msg => ({
                role: msg.role,
                content: msg.content
            }));

            const response = await axios.post(`${API_URL}/ai/chat`, 
                {
                    message: userMessage,
                    conversationHistory
                },
                config
            );

            if (response.data.success) {
                setMessages(prev => [...prev, { 
                    role: 'assistant', 
                    content: response.data.response 
                }]);
            } else {
                setMessages(prev => [...prev, { 
                    role: 'assistant', 
                    content: response.data.message || "I'm sorry, I encountered an error. Please try again." 
                }]);
            }
        } catch (error) {
            console.error('Chat error:', error);
            let errorMessage = "I'm having trouble connecting. ";
            
            if (error.response?.status === 401) {
                errorMessage = "Please login to use the AI assistant.";
            } else if (error.response?.status === 429) {
                errorMessage = "Too many requests. Please wait a moment before trying again.";
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else {
                errorMessage = "I'm having technical difficulties. Please try again in a moment or contact support at support@foodieexpress.com";
            }
            
            setMessages(prev => [...prev, { 
                role: 'assistant', 
                content: errorMessage
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const clearChat = () => {
        setMessages([
            {
                role: 'assistant',
                content: "👋 Chat cleared! How can I help you today?"
            }
        ]);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setInputMessage(suggestion);
        setTimeout(() => sendMessage(), 100);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed z-50 p-4 text-white transition-all duration-300 rounded-full shadow-lg bottom-6 right-6 bg-primary-600 hover:bg-primary-700 group"
            >
                <FaRobot className="text-2xl transition-transform group-hover:scale-110" />
                <span className="absolute -top-1 -right-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs rounded-full px-1.5 py-0.5 animate-pulse">
                    AI
                </span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-96 h-[550px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="p-4 text-white bg-gradient-to-r from-primary-600 to-primary-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FaRobot className="text-2xl" />
                        <div>
                            <h3 className="font-bold">FoodieAI Assistant</h3>
                            <p className="text-xs text-primary-100">Powered by Google Gemini</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={clearChat}
                            className="p-1 transition rounded-full hover:bg-primary-500"
                            title="Clear chat"
                        >
                            <FaTrash size={14} />
                        </button>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 transition rounded-full hover:bg-primary-500"
                        >
                            <FaTimes />
                        </button>
                    </div>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
                {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-[85%] p-3 rounded-2xl ${
                                msg.role === 'user'
                                    ? 'bg-primary-600 text-white rounded-br-sm'
                                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-sm shadow-sm'
                            }`}
                        >
                            <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="p-3 text-gray-800 bg-white border border-gray-200 rounded-bl-sm rounded-2xl">
                            <div className="flex items-center gap-2">
                                <FaSpinner className="animate-spin text-primary-600" />
                                <span className="text-sm">Thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            {messages.length === 1 && suggestions.length > 0 && (
                <div className="px-4 py-2 bg-white border-t border-gray-100">
                    <p className="mb-2 text-xs text-gray-500">💡 Suggested questions:</p>
                    <div className="flex flex-wrap gap-2">
                        {suggestions.slice(0, 6).map((suggestion, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="px-2 py-1 text-xs text-gray-700 transition bg-gray-100 rounded-full hover:bg-primary-100 hover:text-primary-700"
                            >
                                {suggestion.length > 25 ? suggestion.substring(0, 25) + '...' : suggestion}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input */}
            <div className="p-4 bg-white border-t border-gray-200">
                <div className="flex gap-2">
                    <textarea
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Ask me anything about FoodieExpress..."
                        className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-500"
                        rows="1"
                        style={{ minHeight: '40px', maxHeight: '80px' }}
                        disabled={isLoading}
                    />
                    <button
                        onClick={sendMessage}
                        disabled={!inputMessage.trim() || isLoading}
                        className="px-4 py-2 text-white transition rounded-lg bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaPaperPlane />
                    </button>
                </div>
                <p className="mt-2 text-xs text-center text-gray-400">
                    Powered by Google Gemini AI | Responses are AI-generated
                </p>
            </div>
        </div>
    );
};

export default AIChatButton;