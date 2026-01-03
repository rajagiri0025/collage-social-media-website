import { useState } from 'react';
import { useStory } from '../context/StoryContext';
import { useAuth } from '../context/AuthContext';
import StoryRing from './StoryRing';
import CreatePostModal from './CreatePostModal';
import './Feed.css';

const Feed = () => {
    const { userStoriesList, viewUserStories } = useStory();
    const { user, deletePost } = useAuth();

    // State for create post modal
    const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

    // Undo/Delete State
    const [deletedPostId, setDeletedPostId] = useState(null);
    const [showUndo, setShowUndo] = useState(false);
    const [undoTimer, setUndoTimer] = useState(null);

    // Static posts data
    const [staticPosts] = useState([
        {
            id: 1,
            author: 'Sarah Johnson',
            college: 'MIT',
            avatar: 'S',
            time: '2h ago',
            content: 'Just finished my final project presentation! 🎉 Feeling accomplished!',
            likes: 42,
            comments: 8,
            image: null,
            isStatic: true,
            timestamp: Date.now() - 7200000 // 2 hours ago
        },
        {
            id: 2,
            author: 'Mike Chen',
            college: 'Stanford',
            avatar: 'M',
            time: '4h ago',
            content: 'Looking for study partners for Advanced Algorithms. Anyone interested?',
            likes: 15,
            comments: 12,
            image: null,
            isStatic: true,
            timestamp: Date.now() - 14400000 // 4 hours ago
        },
        {
            id: 3,
            author: 'Emma Davis',
            college: 'Harvard',
            avatar: 'E',
            time: '6h ago',
            content: 'Campus life is amazing! Just joined the robotics club 🤖',
            likes: 67,
            comments: 23,
            image: null,
            isStatic: true,
            timestamp: Date.now() - 21600000 // 6 hours ago
        }
    ]);

    const trendingTopics = [
        { name: 'Finals Week', posts: '1.2k' },
        { name: 'Campus Events', posts: '856' },
        { name: 'Study Groups', posts: '642' },
        { name: 'Career Fair', posts: '421' }
    ];

    // Combine and Sort Posts
    const getAllPosts = () => {
        const userPosts = (user?.posts || []).map(post => ({
            ...post,
            author: user.name || 'User',
            college: user.college || 'College',
            avatar: user.name?.charAt(0).toUpperCase() || 'U',
            time: 'Just now', // Simplified for demo
            isStatic: false,
            // Ensure timestamp exists
            timestamp: post.createdAt || Date.now()
        }));

        const allPosts = [...userPosts, ...staticPosts];

        // Sort by timestamp descending (newest first)
        return allPosts.sort((a, b) => b.timestamp - a.timestamp);
    };

    const posts = getAllPosts();

    // Long Press Logic
    const [longPressTimer, setLongPressTimer] = useState(null);

    const handleTouchStart = (postId) => {
        const timer = setTimeout(() => {
            initiateDelete(postId);
        }, 800); // 800ms for long press
        setLongPressTimer(timer);
    };

    const handleTouchEnd = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
        }
    };

    // For mouse users (click and hold)
    const handleMouseDown = (postId) => {
        const timer = setTimeout(() => {
            initiateDelete(postId);
        }, 800);
        setLongPressTimer(timer);
    };

    const handleMouseUp = () => {
        if (longPressTimer) {
            clearTimeout(longPressTimer);
            setLongPressTimer(null);
        }
    };

    const initiateDelete = (postId) => {
        // Vibrate if supported
        if (navigator.vibrate) navigator.vibrate(50);

        setDeletedPostId(postId);
        setShowUndo(true);

        // Auto confirm delete after 3 seconds
        const timer = setTimeout(() => {
            confirmDelete(postId);
        }, 3000);
        setUndoTimer(timer);
    };

    const handleUndo = () => {
        if (undoTimer) clearTimeout(undoTimer);
        setDeletedPostId(null);
        setShowUndo(false);
    };

    const confirmDelete = (postId) => {
        const postToDelete = posts.find(p => p.id === postId);
        if (postToDelete && !postToDelete.isStatic) {
            deletePost(postId);
        } else {
            console.log('Cannot delete static posts in this demo implementation, effectively hidden');
            // For static posts, we'd remove them from local state if we wanted full persistence simulation
        }
        setShowUndo(false);
        setDeletedPostId(null);
    };

    return (
        <div className="feed-container">
            <div className="feed-main">
                <div className="feed-header">
                    <h1>Homepage</h1>
                    <p>See what's happening in your college community</p>
                </div>

                {/* Stories Row */}
                {userStoriesList.length > 0 && (
                    <div className="stories-row">
                        {userStoriesList.map((group) => (
                            <div key={group.user.id} className="story-item" onClick={() => viewUserStories(group.user.id)}>
                                <StoryRing hasStory={true} isViewed={false}>
                                    <div className="story-avatar">
                                        {/* Use the latest story as thumbnail if no user avatar */}
                                        {group.stories[0].mediaType === 'image' ? (
                                            <img src={group.stories[0].mediaUrl} alt="Story" />
                                        ) : (
                                            <video src={group.stories[0].mediaUrl} />
                                        )}
                                    </div>
                                </StoryRing>
                                <span className="story-label">{group.user.username}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="create-post">
                    <div className="post-avatar">{user?.name?.charAt(0).toUpperCase() || 'U'}</div>
                    <input
                        type="text"
                        placeholder="What's on your mind?"
                        className="post-input"
                        onClick={() => setIsCreatePostOpen(true)}
                        readOnly // Prevent typing here, use modal
                    />
                    <button className="post-btn" onClick={() => setIsCreatePostOpen(true)}>Post</button>
                </div>

                <div className="posts-list">
                    {posts.filter(p => p.id !== deletedPostId).map(post => (
                        <div
                            key={post.id}
                            className="post-card"
                            onTouchStart={() => handleTouchStart(post.id)}
                            onTouchEnd={handleTouchEnd}
                            onMouseDown={() => handleMouseDown(post.id)}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                        >
                            <div className="post-header">
                                <div className="post-author">
                                    <div className="post-avatar">{post.avatar}</div>
                                    <div className="post-info">
                                        <div className="author-name">{post.author}</div>
                                        <div className="post-meta">
                                            {post.college} • {post.time}
                                        </div>
                                    </div>
                                </div>
                                <button className="post-options">⋯</button>
                            </div>

                            <div className="post-content">
                                {post.content}
                                {post.mediaType === 'image' && post.media && (
                                    <img src={post.media} alt="Post content" className="post-image" />
                                )}
                                {post.mediaType === 'video' && post.media && (
                                    <video src={post.media} controls className="post-video" />
                                )}
                            </div>

                            <div className="post-actions">
                                <div className="action-item">
                                    <button className="action-btn">❤️</button>
                                    <span className="action-count">{post.likes}</span>
                                </div>
                                <div className="action-item">
                                    <button className="action-btn">💬</button>
                                    <span className="action-count">{post.comments}</span>
                                </div>
                                <div className="action-item">
                                    <button className="action-btn">🔗</button>
                                    <span className="action-text">Share</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <aside className="feed-sidebar">
                <div className="trending-card">
                    <div className="trending-header">
                        <div className="trending-icon">🔥</div>
                        <h3>Trending Posts</h3>
                    </div>
                    <p className="trending-subtitle">See what's trending inside your college</p>

                    <div className="trending-list">
                        {trendingTopics.map((topic, index) => (
                            <div key={index} className="trending-item">
                                <div className="trending-name">{topic.name}</div>
                                <div className="trending-count">{topic.posts} posts</div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="suggestions-card">
                    <h3>Suggested Connections</h3>
                    <div className="suggestion-item">
                        <div className="suggestion-avatar">J</div>
                        <div className="suggestion-info">
                            <div className="suggestion-name">John Doe</div>
                            <div className="suggestion-college">Computer Science</div>
                        </div>
                        <button className="connect-btn sidebar-connect-btn">Add</button>
                    </div>
                    <div className="suggestion-item">
                        <div className="suggestion-avatar">A</div>
                        <div className="suggestion-info">
                            <div className="suggestion-name">Alice Smith</div>
                            <div className="suggestion-college">Engineering</div>
                        </div>
                        <button className="connect-btn sidebar-connect-btn">Add</button>
                    </div>
                </div>
            </aside>

            {/* Create Post Modal */}
            <CreatePostModal
                isOpen={isCreatePostOpen}
                onClose={() => setIsCreatePostOpen(false)}
            />

            {/* Undo Toast */}
            {showUndo && (
                <div className="undo-toast">
                    <span>Post deleted</span>
                    <button onClick={handleUndo}>Undo</button>
                </div>
            )}
        </div>
    );
};

export default Feed;
