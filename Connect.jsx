import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Connect.css';

const Connect = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState('all'); // all, same-college

    useEffect(() => {
        const allUsers = JSON.parse(localStorage.getItem('users') || '[]');
        // Filter out current user and AI
        const realUsers = allUsers.filter(u => u.email !== user?.email && !u.isAI);
        setUsers(realUsers);
    }, [user]);

    const filteredUsers = users.filter(u => {
        const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.college.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filter === 'all' ||
            (filter === 'same-college' && u.college === user?.college);
        return matchesSearch && matchesFilter;
    });

    const handleConnect = (userId) => {
        alert("Connection request sent! (Simulation)");
    };

    return (
        <div className="connect-container">
            <div className="connect-header">
                <button className="back-btn" onClick={() => navigate('/dashboard')}>← Back</button>
                <h1>Connect with Students</h1>
                <div className="search-bar">
                    <input
                        type="text"
                        placeholder="Search students or colleges..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filters">
                    <button
                        className={filter === 'all' ? 'active' : ''}
                        onClick={() => setFilter('all')}
                    >
                        All Students
                    </button>
                    <button
                        className={filter === 'same-college' ? 'active' : ''}
                        onClick={() => setFilter('same-college')}
                    >
                        My College
                    </button>
                </div>
            </div>

            <div className="students-grid">
                {filteredUsers.length === 0 ? (
                    <div className="no-results">
                        <p>No students found matching your criteria.</p>
                    </div>
                ) : (
                    filteredUsers.map(student => (
                        <div key={student.email} className="student-card">
                            <div className="student-avatar">
                                {student.name.charAt(0).toUpperCase()}
                            </div>
                            <h3>{student.name}</h3>
                            <p className="student-college">{student.college}</p>
                            <button
                                className="connect-btn"
                                onClick={() => handleConnect(student.email)}
                            >
                                Connect
                            </button>
                            <button
                                className="message-btn"
                                onClick={() => navigate('/chat')}
                            >
                                Message
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Connect;
