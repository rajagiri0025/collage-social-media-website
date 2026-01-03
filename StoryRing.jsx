import './StoryRing.css';

const StoryRing = ({ hasStory, isViewed, children, onClick, size }) => {
    const style = size ? { width: `${size}px`, height: `${size}px` } : {};

    return (
        <div
            className={`story-ring-wrapper ${hasStory ? 'has-story' : ''} ${isViewed ? 'viewed' : ''}`}
            onClick={onClick}
            style={style}
        >
            <div className="story-ring-inner">
                {children}
            </div>
        </div>
    );
};

export default StoryRing;
