import { useState, useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Chat.css';

const Chat = () => {
    const { user } = useAuth();
    const { users, activeChat, setActiveChat, sendMessage, deleteChat: contextDeleteChat, deleteMessage: contextDeleteMessage, getMessages, isTyping } = useChat();
    const [messageText, setMessageText] = useState('');
    const [messages, setMessages] = useState([]);
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();

    // Long press state
    const [longPressId, setLongPressId] = useState(null);
    const [longPressType, setLongPressType] = useState(null); // 'message' or 'chat'
    const [isPressing, setIsPressing] = useState(false);
    const [longPressProgress, setLongPressProgress] = useState(0);
    const [deletedItem, setDeletedItem] = useState(null); // { id, type, data }
    const [showUndo, setShowUndo] = useState(false);

    const timerRef = useRef(null);
    const progressInterval = useRef(null);
    const undoTimer = useRef(null);
    const PRESS_DURATION = 1000;

    const commonEmojis = ['😊', '😂', '❤️', '👍', '🎉', '🔥', '🤔', '👋', '🎓', '📚', '💻', '⭐'];

    // Load messages when active chat changes
    useEffect(() => {
        if (activeChat) {
            setMessages(getMessages(activeChat.email));
        }
    }, [activeChat, getMessages, messages]);

    // Auto-scroll to bottom when new messages arrive
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Refresh messages periodically
    useEffect(() => {
        if (activeChat) {
            const interval = setInterval(() => {
                setMessages(getMessages(activeChat.email));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [activeChat, getMessages]);

    // Cleanup timers
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (progressInterval.current) clearInterval(progressInterval.current);
            if (undoTimer.current) clearTimeout(undoTimer.current);
        };
    }, []);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!messageText.trim() || !activeChat) return;

        sendMessage(activeChat.email, messageText);
        setMessageText('');
        setShowEmojiPicker(false);
        setTimeout(() => {
            setMessages(getMessages(activeChat.email));
        }, 100);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file && activeChat) {
            // Simulate file upload by sending a formatted message
            const fileMsg = `📎 Sent a file: ${file.name}`;
            sendMessage(activeChat.email, fileMsg);
            setTimeout(() => {
                setMessages(getMessages(activeChat.email));
            }, 100);
        }
    };

    const handleEmojiClick = (emoji) => {
        setMessageText(prev => prev + emoji);
    };

    // Long Press Logic
    const handlePressStart = (id, type) => {
        setIsPressing(true);
        setLongPressId(id);
        setLongPressType(type);
        setLongPressProgress(0);

        // Progress animation
        progressInterval.current = setInterval(() => {
            setLongPressProgress(prev => {
                if (prev >= 100) {
                    clearInterval(progressInterval.current);
                    return 100;
                }
                return prev + 2; // 50 intervals = 1000ms
            });
        }, 20);

        timerRef.current = setTimeout(() => {
            if (type === 'message') {
                deleteMessage(id);
            } else if (type === 'chat') {
                deleteChat(id); // id here is email for chat
            }
            setIsPressing(false);
            setLongPressId(null);
            setLongPressType(null);
            setLongPressProgress(0);
        }, PRESS_DURATION);
    };

    const handlePressEnd = () => {
        setIsPressing(false);
        setLongPressId(null);
        setLongPressType(null);
        setLongPressProgress(0);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        if (progressInterval.current) {
            clearInterval(progressInterval.current);
        }
    };

    const deleteMessage = (msgId) => {
        if (navigator.vibrate) navigator.vibrate(50);

        const msgToDelete = messages.find(m => m.id === msgId);
        setDeletedItem({ id: msgId, type: 'message', data: msgToDelete });
        setShowUndo(true);

        // Actually delete after 3 seconds if not undone
        undoTimer.current = setTimeout(() => {
            if (activeChat) {
                contextDeleteMessage(msgId, activeChat.email);
                setMessages(prev => prev.filter(m => m.id !== msgId));
            }
            setShowUndo(false);
            setDeletedItem(null);
        }, 3000);
    };

    const deleteChat = (userEmail) => {
        if (navigator.vibrate) navigator.vibrate(50);

        const chatToDelete = users.find(u => u.email === userEmail);
        setDeletedItem({ id: userEmail, type: 'chat', data: chatToDelete });
        setShowUndo(true);

        // Actually delete after 3 seconds if not undone
        undoTimer.current = setTimeout(() => {
            contextDeleteChat(userEmail);
            if (activeChat?.email === userEmail) {
                setActiveChat(null);
                setMessages([]);
            }
            setShowUndo(false);
            setDeletedItem(null);
        }, 3000);
    };

    const handleUndo = () => {
        if (undoTimer.current) {
            clearTimeout(undoTimer.current);
        }
        setShowUndo(false);
        setDeletedItem(null);
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === yesterday.toDateString()) {
            return 'Yesterday';
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            });
        }
    };

    return (
        <div className="chat-container">
            {/* Sidebar with user list */}
            <div className="chat-sidebar">
                <div className="chat-sidebar-header">
                    <h2>💬 Messages</h2>
                    <button
                        className="back-button"
                        onClick={() => navigate('/dashboard')}
                    >
                        ← Back
                    </button>
                </div>

                <div className="user-list">
                    {users.filter(u => deletedItem?.type !== 'chat' || deletedItem?.id !== u.email).length === 0 ? (
                        <div className="no-users">
                            <p>No other users yet</p>
                            <small>Register more accounts to start chatting!</small>
                        </div>
                    ) : (
                        users.filter(u => deletedItem?.type !== 'chat' || deletedItem?.id !== u.email).map((u) => (
                            <div
                                key={u.email}
                                className={`user-item ${activeChat?.email === u.email ? 'active' : ''} ${longPressId === u.email && isPressing ? 'pressing' : ''}`}
                                onClick={() => setActiveChat(u)}
                                onMouseDown={() => handlePressStart(u.email, 'chat')}
                                onMouseUp={handlePressEnd}
                                onMouseLeave={handlePressEnd}
                                onTouchStart={() => handlePressStart(u.email, 'chat')}
                                onTouchEnd={handlePressEnd}
                            >
                                <div className="user-avatar">
                                    {u.name.charAt(0).toUpperCase()}
                                </div>
                                <div className="user-info">
                                    <div className="user-name">{u.name}</div>
                                    <div className="user-college">{u.college}</div>
                                </div>
                                {longPressId === u.email && isPressing && (
                                    <div className="delete-progress-overlay">
                                        <div
                                            className="progress-bar"
                                            style={{ width: `${longPressProgress}%` }}
                                        ></div>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Chat area */}
            <div className="chat-main">
                {activeChat ? (
                    <>
                        {/* Chat header */}
                        <div className="chat-header">
                            <div className="chat-user-info">
                                <div className="chat-avatar">
                                    {activeChat.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                    <div className="chat-user-name">{activeChat.name}</div>
                                    <div className="chat-user-status">
                                        {activeChat.college}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="chat-messages">
                            {messages.filter(m => deletedItem?.type !== 'message' || deletedItem?.id !== m.id).length === 0 ? (
                                <div className="no-messages">
                                    <p>👋 Start a conversation with {activeChat.name}!</p>
                                </div>
                            ) : (
                                <>
                                    {messages.filter(m => deletedItem?.type !== 'message' || deletedItem?.id !== m.id).map((msg, index) => {
                                        // Need to recalculate showDate based on filtered messages
                                        const filteredMessages = messages.filter(m => deletedItem?.type !== 'message' || deletedItem?.id !== m.id);
                                        const currentIndex = filteredMessages.findIndex(m => m.id === msg.id);
                                        const showDate = currentIndex === 0 ||
                                            formatDate(filteredMessages[currentIndex - 1].timestamp) !== formatDate(msg.timestamp);

                                        return (
                                            <div key={msg.id}>
                                                {showDate && (
                                                    <div className="message-date">
                                                        {formatDate(msg.timestamp)}
                                                    </div>
                                                )}
                                                <div
                                                    className={`message ${msg.sender === user.email ? 'sent' : 'received'} ${longPressId === msg.id && isPressing ? 'pressing' : ''}`}
                                                    onMouseDown={() => handlePressStart(msg.id, 'message')}
                                                    onMouseUp={handlePressEnd}
                                                    onMouseLeave={handlePressEnd}
                                                    onTouchStart={() => handlePressStart(msg.id, 'message')}
                                                    onTouchEnd={handlePressEnd}
                                                >
                                                    <div className="message-bubble">
                                                        <div className="message-text">{msg.text}</div>
                                                        <div className="message-time">
                                                            {formatTime(msg.timestamp)}
                                                        </div>
                                                        {longPressId === msg.id && isPressing && (
                                                            <div className="delete-progress-msg">
                                                                <div
                                                                    className="progress-bar"
                                                                    style={{ width: `${longPressProgress}%` }}
                                                                ></div>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                    {isTyping && activeChat?.isAI && (
                                        <div className="message received">
                                            <div className="message-bubble typing-indicator">
                                                <span></span>
                                                <span></span>
                                                <span></span>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>

                        {/* Message input */}
                        <form className="chat-input-container" onSubmit={handleSendMessage}>
                            {showEmojiPicker && (
                                <div className="emoji-picker">
                                    {commonEmojis.map(emoji => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            className="emoji-btn"
                                            onClick={() => handleEmojiClick(emoji)}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>
                            )}

                            <button
                                type="button"
                                className="action-btn"
                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                            >
                                😊
                            </button>

                            <button
                                type="button"
                                className="action-btn"
                                onClick={() => fileInputRef.current.click()}
                            >
                                📎
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileUpload}
                            />

                            <input
                                type="text"
                                className="chat-input"
                                placeholder="Type a message..."
                                value={messageText}
                                onChange={(e) => setMessageText(e.target.value)}
                            />
                            <button type="submit" className="send-button">
                                ➤
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="no-chat-selected">
                        <div className="no-chat-content">
                            <div className="no-chat-icon">💬</div>
                            <h2>Select a conversation</h2>
                            <p>Choose a user from the list to start chatting</p>
                        </div>
                    </div>
                )}
            </div>

            {showUndo && (
                <div className="undo-popup">
                    <span>{deletedItem?.type === 'chat' ? 'Chat deleted' : 'Message deleted'}</span>
                    <button onClick={handleUndo}>UNDO</button>
                </div>
            )}
        </div>
    );
};

export default Chat;
