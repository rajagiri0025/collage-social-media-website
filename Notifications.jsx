import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Notifications.css';

const Notifications = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: "connect",
            title: "New Connection Request",
            message: "Sarah Jenkins wants to connect with you.",
            time: "2 mins ago",
            read: false
        },
        {
            id: 2,
            type: "event",
            title: "Event Reminder",
            message: "Campus Tech Fest starts tomorrow at 10 AM.",
            time: "1 hour ago",
            read: false
        },
        {
            id: 3,
            type: "group",
            title: "Group Update",
            message: "New study material added to 'Advanced Calculus'.",
            time: "3 hours ago",
            read: true
        },
        {
            id: 4,
            type: "system",
            title: "Welcome!",
            message: "Thanks for joining Campus Connect. Complete your profile to get started.",
            time: "1 day ago",
            read: true
        }
    ]);

    const [longPressId, setLongPressId] = useState(null);
    const [isPressing, setIsPressing] = useState(false);
    const [longPressProgress, setLongPressProgress] = useState(0);
    const [deletedNotification, setDeletedNotification] = useState(null);
    const [showUndo, setShowUndo] = useState(false);

    const timerRef = useRef(null);
    const progressInterval = useRef(null);
    const undoTimer = useRef(null);
    const PRESS_DURATION = 1000; // ms to trigger delete

    // Cleanup timers
    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
            if (progressInterval.current) clearInterval(progressInterval.current);
            if (undoTimer.current) clearTimeout(undoTimer.current);
        };
    }, []);

    const handlePressStart = (id) => {
        setIsPressing(true);
        setLongPressId(id);
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
            deleteNotification(id);
            setIsPressing(false);
            setLongPressId(null);
            setLongPressProgress(0);
        }, PRESS_DURATION);
    };

    const handlePressEnd = () => {
        setIsPressing(false);
        setLongPressId(null);
        setLongPressProgress(0);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
        }
        if (progressInterval.current) {
            clearInterval(progressInterval.current);
        }
    };

    const deleteNotification = (id) => {
        // Add a vibration feedback if available
        if (navigator.vibrate) navigator.vibrate(50);

        const notifToDelete = notifications.find(n => n.id === id);
        setDeletedNotification(notifToDelete);
        setShowUndo(true);

        // Actually delete after 3 seconds if not undone
        undoTimer.current = setTimeout(() => {
            setNotifications(prev => prev.filter(n => n.id !== id));
            setShowUndo(false);
            setDeletedNotification(null);
        }, 3000);
    };

    const handleUndo = () => {
        if (undoTimer.current) {
            clearTimeout(undoTimer.current);
        }
        setShowUndo(false);
        setDeletedNotification(null);
    };

    const markAsRead = (id) => {
        if (!isPressing) {
            setNotifications(notifications.map(n =>
                n.id === id ? { ...n, read: true } : n
            ));
        }
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const getIcon = (type) => {
        switch (type) {
            case 'connect': return '👥';
            case 'event': return '📅';
            case 'group': return '📚';
            case 'system': return '🎓';
            default: return '🔔';
        }
    };

    return (
        <div className="notifications-container">
            <div className="notifications-header">
                <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
                <h1>Notifications</h1>
                {notifications.length > 0 && (
                    <button className="clear-btn" onClick={clearAll}>Clear All</button>
                )}
            </div>

            <div className="notifications-list">
                {notifications.filter(n => deletedNotification?.id !== n.id).length === 0 ? (
                    <div className="no-notifications">
                        <div className="empty-icon">🔕</div>
                        <h3>No new notifications</h3>
                        <p>You're all caught up!</p>
                    </div>
                ) : (
                    notifications.filter(n => deletedNotification?.id !== n.id).map(notification => (
                        <div
                            key={notification.id}
                            className={`notification-card ${notification.read ? 'read' : 'unread'} ${longPressId === notification.id && isPressing ? 'pressing' : ''}`}
                            onClick={() => markAsRead(notification.id)}
                            onMouseDown={() => handlePressStart(notification.id)}
                            onMouseUp={handlePressEnd}
                            onMouseLeave={handlePressEnd}
                            onTouchStart={() => handlePressStart(notification.id)}
                            onTouchEnd={handlePressEnd}
                        >
                            <div className="notification-icon">
                                {getIcon(notification.type)}
                            </div>
                            <div className="notification-content">
                                <div className="notification-top">
                                    <h3>{notification.title}</h3>
                                    <span className="time">{notification.time}</span>
                                </div>
                                <p>{notification.message}</p>
                            </div>
                            {!notification.read && <div className="unread-dot"></div>}

                            {/* Visual feedback for long press */}
                            {longPressId === notification.id && isPressing && (
                                <>
                                    <div className="delete-overlay">
                                        <span className="delete-text">Deleting...</span>
                                    </div>
                                    <div className="delete-progress">
                                        <div
                                            className="progress-bar"
                                            style={{ width: `${longPressProgress}%` }}
                                        ></div>
                                    </div>
                                </>
                            )}
                        </div>
                    ))
                )}
            </div>

            {showUndo && (
                <div className="undo-popup">
                    <span>Notification deleted</span>
                    <button onClick={handleUndo}>UNDO</button>
                </div>
            )}
        </div>
    );
};

export default Notifications;
