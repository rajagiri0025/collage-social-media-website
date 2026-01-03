import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Achievements.css';

const Achievements = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [achievements] = useState([
        { id: 1, title: "Early Bird", desc: "Joined the platform", icon: "🐣", unlocked: true },
        { id: 2, title: "Social Butterfly", desc: "Connected with 5 students", icon: "🦋", unlocked: true },
        { id: 3, title: "Study Master", desc: "Joined 3 study groups", icon: "📚", unlocked: false },
        { id: 4, title: "Event Goer", desc: "Registered for an event", icon: "🎫", unlocked: false },
        { id: 5, title: "Top Contributor", desc: "Posted 10 helpful resources", icon: "⭐", unlocked: false },
        { id: 6, title: "Chatterbox", desc: "Sent 100 messages", icon: "💬", unlocked: true },
    ]);

    return (
        <div className="achievements-container">
            <div className="achievements-header">
                <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
                <h1>Your Achievements</h1>
            </div>

            <div className="profile-summary">
                <div className="profile-avatar">
                    {user?.name.charAt(0).toUpperCase()}
                </div>
                <h2>{user?.name}</h2>
                <p>Level 3 Scholar</p>
                <div className="xp-bar-container">
                    <div className="xp-bar" style={{ width: '65%' }}></div>
                    <span className="xp-text">3250 / 5000 XP</span>
                </div>
            </div>

            <div className="achievements-grid">
                {achievements.map((achievement, index) => (
                    <div
                        key={achievement.id}
                        className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div className="achievement-icon">{achievement.icon}</div>
                        <h3>{achievement.title}</h3>
                        <p>{achievement.desc}</p>
                        {achievement.unlocked ? (
                            <span className="status-badge unlocked">Unlocked</span>
                        ) : (
                            <span className="status-badge locked">Locked</span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Achievements;
