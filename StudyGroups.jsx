import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './StudyGroups.css';

const StudyGroups = () => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);
    const [groups, setGroups] = useState([
        { id: 1, name: "Advanced Calculus", subject: "Math", members: 12, time: "Mon/Wed 4PM", description: "Deep dive into integrals and derivatives." },
        { id: 2, name: "Physics Lab Prep", subject: "Physics", members: 8, time: "Tue 2PM", description: "Preparing for weekly lab experiments." },
        { id: 3, name: "React Developers", subject: "CS", members: 25, time: "Fri 5PM", description: "Building cool web apps together." },
        { id: 4, name: "Literature Review", subject: "English", members: 6, time: "Thu 1PM", description: "Analyzing classic novels." },
        { id: 5, name: "Chemistry 101", subject: "Chemistry", members: 15, time: "Wed 10AM", description: "Study support for general chemistry." },
        { id: 6, name: "AI & ML Enthusiasts", subject: "CS", members: 40, time: "Sat 11AM", description: "Discussing the future of AI." },
    ]);

    const [newGroup, setNewGroup] = useState({
        name: '',
        subject: '',
        time: '',
        description: ''
    });

    const handleJoin = (groupName) => {
        alert(`You joined ${groupName}! (Simulation)`);
    };

    const handleCreateGroup = (e) => {
        e.preventDefault();
        if (!newGroup.name || !newGroup.subject) return;

        const group = {
            id: groups.length + 1,
            ...newGroup,
            members: 1
        };

        setGroups([group, ...groups]);
        setShowModal(false);
        setNewGroup({ name: '', subject: '', time: '', description: '' });
    };

    return (
        <div className="groups-container">
            <div className="groups-header">
                <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
                <h1 className='raja'>Study Groups</h1>
                <button className="create-group-btn" onClick={() => setShowModal(true)}>+ Create Group</button>
            </div>

            <div className="groups-grid">
                {groups.map(group => (
                    <div key={group.id} className="group-card">
                        <div className="group-icon">📚</div>
                        <div className="group-content">
                            <h3>{group.name}</h3>
                            <span className="subject-tag">{group.subject}</span>
                            <p className="group-desc">{group.description}</p>
                            <div className="group-details">
                                <span>👥 {group.members} Members</span>
                                <span>⏰ {group.time}</span>
                            </div>
                        </div>
                        <button
                            className="join-btn"
                            onClick={() => handleJoin(group.name)}
                        >
                            Join Group
                        </button>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>Create New Group</h2>
                        <form onSubmit={handleCreateGroup}>
                            <div className="form-group">
                                <label>Group Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Calculus Study"
                                    value={newGroup.name}
                                    onChange={e => setNewGroup({ ...newGroup, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Subject</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Math"
                                    value={newGroup.subject}
                                    onChange={e => setNewGroup({ ...newGroup, subject: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Meeting Time</label>
                                <input
                                    type="text"
                                    placeholder="e.g., Mon 4PM"
                                    value={newGroup.time}
                                    onChange={e => setNewGroup({ ...newGroup, time: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Description</label>
                                <textarea
                                    placeholder="What will you study?"
                                    value={newGroup.description}
                                    onChange={e => setNewGroup({ ...newGroup, description: e.target.value })}
                                />
                            </div>
                            <div className="modal-actions">
                                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="submit" className="submit-btn">Create Group</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudyGroups;
