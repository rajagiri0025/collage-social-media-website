import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { getAIResponse } from '../services/AIService';

const ChatContext = createContext();

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};

export const ChatProvider = ({ children }) => {
    const { user } = useAuth();
    const [conversations, setConversations] = useState({});
    const [activeChat, setActiveChat] = useState(null);
    const [users, setUsers] = useState([]);
    const [isTyping, setIsTyping] = useState(false);

    // Load conversations from localStorage
    useEffect(() => {
        const storedConversations = localStorage.getItem('conversations');
        if (storedConversations) {
            setConversations(JSON.parse(storedConversations));
        }
    }, []);

    // Load all registered users and add AI
    useEffect(() => {
        const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
        // Filter out current user
        const otherUsers = allUsers.filter(u => u.email !== user?.email);

        // Add AI Bot
        const aiBot = {
            name: "My AI 🤖",
            email: "ai@campusconnect.com",
            college: "Virtual Assistant",
            isAI: true
        };

        setUsers([aiBot, ...otherUsers]);
    }, [user]);

    // Save conversations to localStorage whenever they change
    useEffect(() => {
        if (Object.keys(conversations).length > 0) {
            localStorage.setItem('conversations', JSON.stringify(conversations));
        }
    }, [conversations]);

    // Send a message
    const sendMessage = async (recipientEmail, messageText) => {
        if (!user || !messageText.trim()) return;

        const newMessage = {
            id: Date.now(),
            sender: user.email,
            recipient: recipientEmail,
            text: messageText,
            timestamp: new Date().toISOString(),
        };

        // Create conversation key (sorted emails to ensure consistency)
        const conversationKey = [user.email, recipientEmail].sort().join('_');

        setConversations(prev => ({
            ...prev,
            [conversationKey]: [...(prev[conversationKey] || []), newMessage],
        }));

        // Handle AI Response
        if (recipientEmail === "ai@campusconnect.com") {
            setIsTyping(true);
            try {
                const responseText = await getAIResponse(messageText);

                const aiMessage = {
                    id: Date.now() + 1,
                    sender: "ai@campusconnect.com",
                    recipient: user.email,
                    text: responseText,
                    timestamp: new Date().toISOString(),
                };

                setConversations(prev => ({
                    ...prev,
                    [conversationKey]: [...(prev[conversationKey] || []), aiMessage],
                }));
            } catch (error) {
                console.error("AI Error:", error);
            } finally {
                setIsTyping(false);
            }
        }
    };

    // Get messages for a specific conversation
    const getMessages = (recipientEmail) => {
        if (!user) return [];
        const conversationKey = [user.email, recipientEmail].sort().join('_');
        return conversations[conversationKey] || [];
    };

    // Get last message for a conversation
    const getLastMessage = (recipientEmail) => {
        const messages = getMessages(recipientEmail);
        return messages[messages.length - 1];
    };

    // Get unread count (simplified - all messages from others)
    const getUnreadCount = (recipientEmail) => {
        const messages = getMessages(recipientEmail);
        return messages.filter(m => m.sender === recipientEmail).length;
    };

    // Delete an entire chat conversation
    const deleteChat = (recipientEmail) => {
        if (!user) return;
        const conversationKey = [user.email, recipientEmail].sort().join('_');

        setConversations(prev => {
            const newConversations = { ...prev };
            delete newConversations[conversationKey];
            return newConversations;
        });
    };

    // Delete a specific message
    const deleteMessage = (messageId, recipientEmail) => {
        if (!user) return;
        const conversationKey = [user.email, recipientEmail].sort().join('_');

        setConversations(prev => {
            const currentMessages = prev[conversationKey] || [];
            const updatedMessages = currentMessages.filter(msg => msg.id !== messageId);

            return {
                ...prev,
                [conversationKey]: updatedMessages
            };
        });
    };

    const value = {
        users,
        activeChat,
        setActiveChat,
        sendMessage,
        deleteChat,
        deleteMessage,
        getMessages,
        getLastMessage,
        getUnreadCount,
        isTyping,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};
