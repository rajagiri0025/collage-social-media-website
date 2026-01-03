import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useStory } from '../context/StoryContext';
import StoryRing from './StoryRing';
import EditProfileModal from './EditProfileModal';
import PostViewModal from './PostViewModal';
import './Profile.css';

const Profile = () => {
    const { user, deletePost } = useAuth();
    const { hasActiveStory, viewUserStories, areAllStoriesViewed } = useStory();
    const [activeTab, setActiveTab] = useState('posts');

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isPostViewOpen, setIsPostViewOpen] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);

    // Mock stats - in a real app these would come from an API
    const [stats] = useState({
        posts: 12,
        followers: 1234,
        following: 567
    });

    // Get posts from user context
    const userPosts = user?.posts || [];

    // Deletion logic
    const [deletedPost, setDeletedPost] = useState(null);
    const [showUndo, setShowUndo] = useState(false);
    const [longPressPost, setLongPressPost] = useState(null);
    const [longPressProgress, setLongPressProgress] = useState(0);
    const progressIntervalRef = useRef(null);
    const undoTimerRef = useRef(null);

    const handlePostClick = (post) => {
        setSelectedPost(post);
        setIsPostViewOpen(true);
    };

    const handleLongPressStart = (post, e) => {
        e.preventDefault(); // Prevent default context menu
        setLongPressPost(post.id);
        setLongPressProgress(0);

        // Start progress animation
        let progress = 0;
        progressIntervalRef.current = setInterval(() => {
            progress += 2; // 50ms * 50 = 2500ms for 100%
            setLongPressProgress(progress);
            if (progress >= 100) {
                clearInterval(progressIntervalRef.current);
                handleDeletePost(post);
            }
        }, 20);
    };

    const handleLongPressEnd = () => {
        if (progressIntervalRef.current) {
            clearInterval(progressIntervalRef.current);
            progressIntervalRef.current = null;
        }
        setLongPressPost(null);
        setLongPressProgress(0);
    };

    const handleDeletePost = (post) => {
        setDeletedPost(post);
        setShowUndo(true);
        handleLongPressEnd();

        // Clear any existing timer
        if (undoTimerRef.current) clearTimeout(undoTimerRef.current);

        // Permanently delete after 3 seconds
        undoTimerRef.current = setTimeout(() => {
            deletePost(post.id);
            setShowUndo(false);
            setDeletedPost(null);
        }, 3000);
    };

    const handleUndo = () => {
        if (undoTimerRef.current) {
            clearTimeout(undoTimerRef.current);
            undoTimerRef.current = null;
        }
        setDeletedPost(null);
        setShowUndo(false);
    };

    useEffect(() => {
        return () => {
            if (progressIntervalRef.current) {
                clearInterval(progressIntervalRef.current);
            }
            if (undoTimerRef.current) {
                clearTimeout(undoTimerRef.current);
            }
        };
    }, []);

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-header-content">
                    <div className="profile-avatar-section">
                        <div className="profile-avatar-section">
                            <StoryRing
                                hasStory={hasActiveStory('current-user')}
                                isViewed={areAllStoriesViewed('current-user')}
                                size={200}
                                onClick={() => hasActiveStory('current-user') && viewUserStories('current-user')}
                            >
                                <div className="profile-avatar-xl">
                                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                                </div>
                            </StoryRing>
                        </div>
                    </div>

                    <div className="profile-info-section">
                        <div className="profile-username-row">
                            <h1 className="profile-username">{user?.name || 'User'}</h1>
                            <button
                                className="edit-profile-btn"
                                onClick={() => setIsEditModalOpen(true)}
                            >
                                Edit Profile
                            </button>
                        </div>

                        <div className="profile-stats">
                            <div className="stat-item">
                                <span className="stat-value">{stats.posts}</span>
                                <span className="stat-label">posts</span>
                            </div>
                            <div className="stat-item">
                                <span className="stat-value">{stats.followers}</span>
                                <span className="stat-label">followers</span>
                            </div >
                            <div className="stat-item">
                                <span className="stat-value">{stats.following}</span>
                                <span className="stat-label">following</span>
                            </div>
                        </div >

                        <div className="profile-bio">
                            <div className="profile-full-name">{user?.name || 'User Name'}</div>
                            <div className="profile-college">🎓 {user?.college || 'College Name'}</div>
                            <div className="profile-description">
                                {user?.bio || 'Computer Science Student | Tech Enthusiast | Coffee Lover ☕'}
                            </div>
                            {user?.website && (
                                <div className="profile-website">
                                    <a href={user.website} target="_blank" rel="noopener noreferrer">
                                        🔗 {user.website}
                                    </a>
                                </div>
                            )}
                            {user?.location && (
                                <div className="profile-location">
                                    📍 {user.location}
                                </div>
                            )}
                        </div>
                    </div >
                </div >
            </div >

            <div className="profile-tabs">
                <button
                    className={`profile-tab ${activeTab === 'posts' ? 'active' : ''}`}
                    onClick={() => setActiveTab('posts')}
                >
                    <span className="tab-icon">📝</span>
                    POSTS
                </button>
                <button
                    className={`profile-tab ${activeTab === 'saved' ? 'active' : ''}`}
                    onClick={() => setActiveTab('saved')}
                >
                    <span className="tab-icon">🔖</span>
                    SAVED
                </button>
                <button
                    className={`profile-tab ${activeTab === 'tagged' ? 'active' : ''}`}
                    onClick={() => setActiveTab('tagged')}
                >
                    <span className="tab-icon">👤</span>
                    TAGGED
                </button>
            </div>

            <div className="profile-content">
                {activeTab === 'posts' && (
                    <div className="posts-grid">
                        {userPosts.filter(p => p.id !== deletedPost?.id).length > 0 ? (
                            userPosts.filter(p => p.id !== deletedPost?.id).map(post => (
                                <div
                                    key={post.id}
                                    className="post-grid-item"
                                    onClick={() => handlePostClick(post)}
                                    onMouseDown={(e) => handleLongPressStart(post, e)}
                                    onMouseUp={handleLongPressEnd}
                                    onMouseLeave={handleLongPressEnd}
                                    onTouchStart={(e) => handleLongPressStart(post, e)}
                                    onTouchEnd={handleLongPressEnd}
                                >
                                    {post.mediaType === 'image' ? (
                                        <img src={post.media} alt="Post" className="post-grid-image" />
                                    ) : (
                                        <video src={post.media} className="post-grid-video" />
                                    )}
                                    <div className="post-overlay">
                                        <div className="post-stats">
                                            <span>❤️ {post.likes || 0}</span>
                                            <span>💬 {post.comments || 0}</span>
                                        </div>
                                    </div>
                                    {longPressPost === post.id && (
                                        <div className="delete-progress-bar">
                                            <div
                                                className="delete-progress-fill"
                                                style={{ width: `${longPressProgress}%` }}
                                            />
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="empty-posts">
                                <span className="empty-icon">📷</span>
                                <h3>No Posts Yet</h3>
                                <p>Click the + button to create your first post!</p>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'saved' && (
                    <div className="empty-tab">
                        <span className="empty-icon">🔖</span>
                        <h3>No Saved Posts</h3>
                        <p>Save posts to see them here</p>
                    </div>
                )}

                {activeTab === 'tagged' && (
                    <div className="empty-tab">
                        <span className="empty-icon">👤</span>
                        <h3>No Tagged Posts</h3>
                        <p>Posts you're tagged in will appear here</p>
                    </div>
                )}
            </div>

            {showUndo && (
                <div className="undo-popup">
                    <span>Post deleted</span>
                    <button onClick={handleUndo}>UNDO</button>
                </div>
            )}

            <EditProfileModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
            />

            <PostViewModal
                isOpen={isPostViewOpen}
                post={selectedPost}
                onClose={() => {
                    setIsPostViewOpen(false);
                    setSelectedPost(null);
                }}
            />
        </div >
    );
};

export default Profile;
