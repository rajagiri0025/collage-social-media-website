import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useStory } from '../context/StoryContext';
import FloatingActionButton from './FloatingActionButton';
import StoryRing from './StoryRing';
import './MainLayout.css';

const MainLayout = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const { hasActiveStory, viewUserStories, areAllStoriesViewed } = useStory();
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const menuItems = [
        { icon: '🏠', label: 'Homepage', path: '/dashboard' },
        { icon: '🔍', label: 'Search', path: '/connect' },
        { icon: '🔔', label: 'Notifications', path: '/notifications' },
        { icon: '💬', label: 'Chats', path: '/chat' },
        { icon: '👥', label: 'Study Groups', path: '/groups' },
        { icon: '📅', label: 'Events', path: '/events' },
        { icon: '🏆', label: 'Achievements', path: '/achievements' },
        { icon: '⚙️', label: 'Settings', path: '/settings' },
    ];

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleAvatarClick = (e) => {
        e.stopPropagation();
        if (hasActiveStory('current-user')) {
            viewUserStories('current-user');
        } else {
            navigate('/profile');
        }
    };

    return (
        <div className="main-layout">
            <aside className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <h2 className="logo">📚 Campus</h2>
                    <button className="theme-toggle-btn" onClick={toggleTheme} title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}>
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map((item) => (
                        <button
                            key={item.path}
                            className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
                            onClick={() => handleNavigation(item.path)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="user-profile" onClick={() => navigate('/profile')}>
                        <StoryRing
                            hasStory={hasActiveStory('current-user')}
                            isViewed={areAllStoriesViewed('current-user')}
                            size={45}
                        >
                            <div className="user-avatar" onClick={handleAvatarClick}>
                                {user?.name?.charAt(0).toUpperCase() || 'U'}
                            </div>
                        </StoryRing>
                        <div className="user-info">
                            <div className="user-name">{user?.name || 'User'}</div>
                            <div className="user-college">{user?.college || 'College'}</div>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        🚪 Logout
                    </button>
                </div>
            </aside>

            <main className="main-content">
                {children}
            </main>

            <FloatingActionButton />
        </div>
    );
};

export default MainLayout;
