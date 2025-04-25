import React from 'react';

interface MessageBubbleProps {
  type: string;
  content: string | string[];
  isSentByUser: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  type,
  content,
  isSentByUser,
}) => {
  const messageContainerStyle = {
    display: 'flex', // Ensure flex container
    justifyContent: isSentByUser ? 'flex-end' : 'flex-start', // Align bubble left or right
    marginBottom: '10px',
  };

  const bubbleStyleText = {
    backgroundColor: isSentByUser ? '#DCF8C6' : '#FFF',
    border: isSentByUser ? 'none' : '1px solid #ccc',
    padding: '10px',
    borderRadius: '10px',
    maxWidth: '80%',
    overflowWrap: 'break-word' as const, // Ensure long text wraps
  };

  const bubbleStyleImg = {
    maxWidth: '60%',
    borderRadius: '10px',
    cursor: 'pointer',
  };

  const bubbleStyleVideo = { maxWidth: '60%', borderRadius: '10px' };

  const bubbleStyleAudio = { maxWidth: '60%' };

  const handleImageClick = () => {
    alert('Open image');
  };

  if (type === 'text' || type === 'long_text') {
    return (
      <div style={messageContainerStyle}>
        <div style={bubbleStyleText}>{content}</div>
      </div>
    );
  } else if (type === 'image') {
    return (
      <div style={messageContainerStyle}>
        <img
          src={content as string}
          alt="Image"
          style={bubbleStyleImg}
          onClick={handleImageClick}
        />
      </div>
    );
  } else if (type === 'images') {
    const images = content as string[]; //.slice(0, 4); // Limit to 4 images
    return (
      <div style={messageContainerStyle}>
        <div
          style={{
            position: 'relative',
            width: '11rem',
            height: `${7 * images.length + 3}rem`,
          }}
        >
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Image ${index + 1}`}
              style={{
                width: '10rem',
                height: '10rem',
                borderRadius: '5px',
                cursor: 'pointer',
                border: '1px solid #ccc',
                objectFit: 'cover',
                position: 'absolute',
                top: `${index * 7}rem`,
                right: `${index % 2 ? 0 : 5}rem`,
              }}
              onClick={handleImageClick}
            />
          ))}
        </div>
      </div>
    );
  } else if (type === 'video') {
    return (
      <div style={messageContainerStyle}>
        <video controls style={bubbleStyleVideo}>
          <source src={content as string} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  } else if (type === 'audio') {
    return (
      <div style={messageContainerStyle}>
        <audio controls style={bubbleStyleAudio}>
          <source src={content as string} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }

  return null;
};

export default MessageBubble;
