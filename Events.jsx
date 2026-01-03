import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Events.css';

const Events = () => {
    const navigate = useNavigate();

    const [events] = useState([
        {
            id: 1,
            title: "Campus Tech Fest 2025",
            date: "Dec 15, 2025",
            time: "10:00 AM",
            location: "Main Auditorium",
            category: "Technology",
            image: "💻"
        },
        {
            id: 2,
            title: "Annual Sports Meet",
            date: "Dec 20, 2025",
            time: "08:00 AM",
            location: "Sports Complex",
            category: "Sports",
            image: "🏆"
        },
        {
            id: 3,
            title: "Cultural Night",
            date: "Dec 24, 2025",
            time: "06:00 PM",
            location: "Open Air Theatre",
            category: "Cultural",
            image: "🎭"
        },
        {
            id: 4,
            title: "Career Fair",
            date: "Jan 10, 2026",
            time: "09:00 AM",
            location: "Exhibition Hall",
            category: "Career",
            image: "💼"
        }
    ]);

    const handleRegister = (eventName) => {
        alert(`Registered for ${eventName}! (Simulation)`);
    };

    return (
        <div className="events-container">
            <div className="events-header">
                <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
                <h1>Upcoming Events</h1>
            </div>

            <div className="events-list">
                {events.map(event => (
                    <div key={event.id} className="event-card">
                        <div className="event-image">{event.image}</div>
                        <div className="event-content">
                            <span className="event-category">{event.category}</span>
                            <h3>{event.title}</h3>
                            <div className="event-details">
                                <p>📅 {event.date} at {event.time}</p>
                                <p>📍 {event.location}</p>
                            </div>
                            <button
                                className="register-btn"
                                onClick={() => handleRegister(event.title)}
                            >
                                Register Now
                            </button>
                        </div>
                        <div className="event-date-badge">
                            <span className="day">{event.date.split(' ')[1].replace(',', '')}</span>
                            <span className="month">{event.date.split(' ')[0]}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Events;
