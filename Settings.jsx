import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import './Settings.css';

const Settings = () => {
    const { user, logout, updatePassword } = useAuth();
    const { theme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('account');

    // Theme logic is now handled by ThemeContext

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [blockedUsers, setBlockedUsers] = useState([
        { id: 1, name: 'Blocked User 1', email: 'blocked1@example.com' },
        { id: 2, name: 'Blocked User 2', email: 'blocked2@example.com' }
    ]);

    const handleUnblock = (userId) => {
        setBlockedUsers(blockedUsers.filter(u => u.id !== userId));
    };

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdatePassword = () => {
        if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
            alert('Please fill in all password fields');
            return;
        }

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('New passwords do not match');
            return;
        }

        if (passwordData.newPassword.length < 6) {
            alert('Password must be at least 6 characters');
            return;
        }

        // Update password using AuthContext
        const result = updatePassword(passwordData.currentPassword, passwordData.newPassword);

        if (result.success) {
            alert(result.message);
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } else {
            alert(result.message);
        }
    };

    return (
        <div className="settings-container">
            <div className="settings-header">
                <h1>Settings</h1>
                <p>Manage your account settings and preferences</p>
            </div>

            <div className="settings-content">
                <div className="settings-sidebar">
                    <button
                        className={`settings-tab ${activeTab === 'account' ? 'active' : ''}`}
                        onClick={() => setActiveTab('account')}
                    >
                        🔐 Account
                    </button>
                    <button
                        className={`settings-tab ${activeTab === 'security' ? 'active' : ''}`}
                        onClick={() => setActiveTab('security')}
                    >
                        🛡️ Security
                    </button>
                    <button
                        className={`settings-tab ${activeTab === 'privacy' ? 'active' : ''}`}
                        onClick={() => setActiveTab('privacy')}
                    >
                        🔒 Privacy
                    </button>
                    <button
                        className={`settings-tab ${activeTab === 'notifications' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notifications')}
                    >
                        🔔 Notifications
                    </button>
                    <button
                        className={`settings-tab ${activeTab === 'blocklist' ? 'active' : ''}`}
                        onClick={() => setActiveTab('blocklist')}
                    >
                        🚫 Blocked Accounts
                    </button>
                    <button
                        className={`settings-tab ${activeTab === 'theme' ? 'active' : ''}`}
                        onClick={() => setActiveTab('theme')}
                    >
                        🎨 Theme
                    </button>
                    <button
                        className={`settings-tab ${activeTab === 'membership' ? 'active' : ''}`}
                        onClick={() => setActiveTab('membership')}
                    >
                        👑 Membership
                    </button>
                    <button
                        className={`settings-tab ${activeTab === 'help' ? 'active' : ''}`}
                        onClick={() => setActiveTab('help')}
                    >
                        ❓ Help & Support
                    </button>
                </div>

                <div className="settings-main">
                    {activeTab === 'account' && (
                        <div className="settings-section">
                            <h2>Account Settings</h2>
                            <p className="section-description">Manage your account information and preferences</p>

                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    value={user?.email || ''}
                                    disabled
                                />
                                <small>Email cannot be changed</small>
                            </div>

                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    defaultValue={user?.name || ''}
                                    placeholder="Enter username"
                                />
                            </div>

                            <div className="form-group">
                                <label>College</label>
                                <input
                                    type="text"
                                    defaultValue={user?.college || ''}
                                    placeholder="Your college"
                                />
                            </div>

                            <button className="save-btn">Save Changes</button>

                            <div className="actions-account">
                                <h3>Account Actions</h3>
                                <div className="form-groupp">
                                <button className="action-btn-secondary">Download Your Data</button>
                                <button className="action-btn-secondary">Deactivate Account</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="settings-section">
                            <h2>Security</h2>
                            <p className="section-description">Keep your account secure</p>

                            <div className="form-group">
                                <label>Change Password</label>
                                <input
                                    type="password"
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Current password"
                                />
                                <input
                                    type="password"
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="New password"
                                />
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    placeholder="Confirm new password"
                                />
                            </div>

                            <button className="save-btn" onClick={handleUpdatePassword}>Update Password</button>

                            <div className="security-options">
                                <h3>Two-Factor Authentication</h3>
                                <p>Add an extra layer of security to your account</p>
                                <button className="action-btn-secondary">Enable 2FA</button>
                            </div>

                            <div className="security-options">
                                <h3>Login Activity</h3>
                                <p>See where you're logged in and manage your sessions</p>
                                <button className="action-btn-secondary">View Activity</button>
                            </div>

                            <div className="danger-zone">
                                <h3>Danger Zone</h3>
                                <p>Once you delete your account, there is no going back.</p>
                                <button className="delete-btn">Delete Account</button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'privacy' && (
                        <div className="settings-section">
                            <h2>Privacy</h2>
                            <p className="section-description">Control who can see your content and activity</p>

                            <div className="privacy-option">
                                <div className="privacy-info">
                                    <h4>Account Privacy</h4>
                                    <p>Make your account private</p>
                                </div>
                                <label className="toggle">
                                    <input type="checkbox" />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="privacy-option">
                                <div className="privacy-info">
                                    <h4>Activity Status</h4>
                                    <p>Show when you're active</p>
                                </div>
                                <label className="toggle">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="privacy-option">
                                <div className="privacy-info">
                                    <h4>Story Sharing</h4>
                                    <p>Allow sharing of your stories</p>
                                </div>
                                <label className="toggle">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="privacy-option">
                                <div className="privacy-info">
                                    <h4>Read Receipts</h4>
                                    <p>Let people know when you've seen their messages</p>
                                </div>
                                <label className="toggle">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="settings-section">
                            <h2>Notifications</h2>
                            <p className="section-description">Choose what notifications you want to receive</p>

                            <div className="notification-option">
                                <div className="notification-info">
                                    <h4>Push Notifications</h4>
                                    <p>Receive push notifications</p>
                                </div>
                                <label className="toggle">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="notification-option">
                                <div className="notification-info">
                                    <h4>Email Notifications</h4>
                                    <p>Receive email updates</p>
                                </div>
                                <label className="toggle">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="notification-option">
                                <div className="notification-info">
                                    <h4>Likes and Comments</h4>
                                    <p>Get notified when someone likes or comments</p>
                                </div>
                                <label className="toggle">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="notification-option">
                                <div className="notification-info">
                                    <h4>New Followers</h4>
                                    <p>Get notified of new followers</p>
                                </div>
                                <label className="toggle">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider"></span>
                                </label>
                            </div>

                            <div className="notification-option">
                                <div className="notification-info">
                                    <h4>Messages</h4>
                                    <p>Get notified of new messages</p>
                                </div>
                                <label className="toggle">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>
                    )}

                    {activeTab === 'blocklist' && (
                        <div className="settings-section">
                            <h2>Blocked Accounts</h2>
                            <p className="section-description">Manage accounts you've blocked</p>

                            {blockedUsers.length === 0 ? (
                                <div className="empty-state">
                                    <p>🚫 No blocked accounts</p>
                                    <small>When you block someone, they won't be able to find your profile or see your posts</small>
                                </div>
                            ) : (
                                <div className="blocked-list">
                                    {blockedUsers.map(user => (
                                        <div key={user.id} className="blocked-user-item">
                                            <div className="blocked-user-avatar">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="blocked-user-info">
                                                <div className="blocked-user-name">{user.name}</div>
                                                <div className="blocked-user-email">{user.email}</div>
                                            </div>
                                            <button
                                                className="unblock-btn"
                                                onClick={() => handleUnblock(user.id)}
                                            >
                                                Unblock
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'theme' && (
                        <div className="settings-section">
                            <h2>Theme</h2>
                            <p className="section-description">Customize how Campus looks to you</p>

                            <div className="theme-options">
                                <div
                                    className={`theme-card ${theme === 'light' ? 'active' : ''}`}
                                    onClick={() => handleThemeChange('light')}
                                >
                                    <div className="theme-preview light-preview">
                                        <div className="preview-header"></div>
                                        <div className="preview-content"></div>
                                    </div>
                                    <h4>☀️ Light</h4>
                                    <p>Classic bright theme</p>
                                </div>

                                <div
                                    className={`theme-card ${theme === 'dark' ? 'active' : ''}`}
                                    onClick={() => handleThemeChange('dark')}
                                >
                                    <div className="theme-preview dark-preview">
                                        <div className="preview-header"></div>
                                        <div className="preview-content"></div>
                                    </div>
                                    <h4>🌙 Dark</h4>
                                    <p>Easy on the eyes</p>
                                </div>

                                <div
                                    className={`theme-card ${theme === 'auto' ? 'active' : ''}`}
                                    onClick={() => handleThemeChange('auto')}
                                >
                                    <div className="theme-preview auto-preview">
                                        <div className="preview-header"></div>
                                        <div className="preview-content"></div>
                                    </div>
                                    <h4>🔄 Auto</h4>
                                    <p>Matches system theme</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'membership' && (
                        <div className="settings-section">
                            <h2>Membership</h2>
                            <p className="section-description">Upgrade your account for premium features</p>

                            <div className="membership-cards">
                                <div className="membership-card">
                                    <div className="membership-badge">Current Plan</div>
                                    <h3>Free</h3>
                                    <div className="membership-price">$0<span>/month</span></div>
                                    <ul className="membership-features">
                                        <li>✓ Basic features</li>
                                        <li>✓ Connect with students</li>
                                        <li>✓ Join study groups</li>
                                        <li>✓ View events</li>
                                    </ul>
                                </div>

                                <div className="membership-card premium">
                                    <div className="membership-badge premium-badge">Recommended</div>
                                    <h3>Premium</h3>
                                    <div className="membership-price">$9.99<span>/month</span></div>
                                    <ul className="membership-features">
                                        <li>✓ All Free features</li>
                                        <li>✓ Priority support</li>
                                        <li>✓ Advanced analytics</li>
                                        <li>✓ Custom profile themes</li>
                                        <li>✓ Ad-free experience</li>
                                        <li>✓ Verified badge</li>
                                    </ul>
                                    <button className="upgrade-btn">Upgrade Now</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'help' && (
                        <div className="settings-section">
                            <h2>Help & Support</h2>
                            <p className="section-description">Get help and learn more about Campus</p>

                            <div className="help-options">
                                <button className="help-option-btn raja">
                                    <span className="help-icon"></span>
                                    <div>
                                        <h4>Help Center</h4>
                                        <p>Browse articles and tutorials</p>
                                    </div>
                                </button>

                                <button className="help-option-btn raja">
                                    <span className="help-icon"></span>
                                    <div>
                                        <h4>Contact Support</h4>
                                        <p>Get help from our team</p>
                                    </div>
                                </button>

                                <button className="help-option-btn raja">
                                    <span className="help-icon"></span>
                                    <div>
                                        <h4>Terms of Service</h4>
                                        <p>Read our terms and conditions</p>
                                    </div>
                                </button>

                                <button className="help-option-btn raja">
                                    <span className="help-icon"></span>
                                    <div>
                                        <h4>Privacy Policy</h4>
                                        <p>Learn how we protect your data</p>
                                    </div>
                                </button>
                            </div>

                            <div className="app-info">
                                <h3>About</h3>
                                <p>Campus Social Media v1.0.0</p>
                                <p>© 2025 Campus. All rights reserved.</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Settings;
