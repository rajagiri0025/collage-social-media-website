import { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../context/AuthContext';
import './CreatePostModal.css';

const CreatePostModal = ({ isOpen, onClose }) => {
    const { createPost } = useAuth();
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [mediaType, setMediaType] = useState(null);
    const [caption, setCaption] = useState('');
    const [isPosting, setIsPosting] = useState(false);

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Check if it's image or video
        const type = file.type.startsWith('image/') ? 'image' : 'video';
        setMediaType(type);
        setSelectedFile(file);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handlePost = async () => {
        if (!selectedFile || !preview) {
            alert('Please select an image or video');
            return;
        }

        setIsPosting(true);

        const result = createPost({
            media: preview,
            mediaType: mediaType,
            caption: caption,
            likes: 0,
            comments: 0
        });

        setIsPosting(false);

        if (result.success) {
            // Reset form
            setSelectedFile(null);
            setPreview(null);
            setMediaType(null);
            setCaption('');
            onClose();
        } else {
            alert(result.message || 'Failed to create post');
        }
    };

    const handleClose = () => {
        setSelectedFile(null);
        setPreview(null);
        setMediaType(null);
        setCaption('');
        onClose();
    };

    if (!isOpen) return null;

    return createPortal(
        <div className="create-post-overlay" onClick={handleClose}>
            <div className="create-post-modal" onClick={(e) => e.stopPropagation()}>
                <div className="create-post-header">
                    <button className="create-post-close" onClick={handleClose}>✕</button>
                    <h2>Create New Post</h2>
                    <button
                        className="create-post-share"
                        onClick={handlePost}
                        disabled={!selectedFile || isPosting}
                    >
                        {isPosting ? 'Posting...' : 'Share'}
                    </button>
                </div>

                <div className="create-post-content">
                    {!preview ? (
                        <div className="create-post-upload">
                            <div className="upload-icon">📷</div>
                            <h3>Select photos or videos</h3>
                            <label htmlFor="file-upload" className="upload-button">
                                Select from computer
                            </label>
                            <input
                                type="file"
                                id="file-upload"
                                accept="image/*,video/*"
                                onChange={handleFileSelect}
                                style={{ display: 'none' }}
                            />
                        </div>
                    ) : (
                        <div className="create-post-preview">
                            <div className="preview-media">
                                {mediaType === 'image' ? (
                                    <img src={preview} alt="Preview" />
                                ) : (
                                    <video src={preview} controls />
                                )}
                            </div>
                            <div className="preview-caption">
                                <textarea
                                    placeholder="Write a caption..."
                                    value={caption}
                                    onChange={(e) => setCaption(e.target.value)}
                                    maxLength={2200}
                                />
                                <div className="caption-count">{caption.length}/2200</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default CreatePostModal;
