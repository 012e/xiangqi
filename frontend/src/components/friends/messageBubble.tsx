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
  const alignmentClass = isSentByUser ? 'justify-end' : 'justify-start';
  const bubbleTextClass = isSentByUser
    ? 'bg-muted-foreground text-foreground p-2 rounded-lg max-w-[80%] break-words'
    : 'bg-background text-foreground border p-2 rounded-lg max-w-[80%] break-words';

  const handleImageClick = () => {
    alert('Open image');
  };

  if (type === 'text' || type === 'long_text') {
    return (
      <div className={`flex ${alignmentClass} mb-2`}>
        <div className={bubbleTextClass}>{content}</div>
      </div>
    );
  } else if (type === 'image') {
    return (
      <div className={`flex ${alignmentClass} mb-2`} >
        <img
          src={content as string}
          alt="Image not found"
          className="max-w-[60%] rounded-lg cursor-pointer"
          onClick={handleImageClick}
        />
      </div>
    );
  } else if (type === 'images') {
    const images = content as string[];
    return (
      <div className={`flex ${alignmentClass} mb-2`}>
        <div
          className="relative"
          style={{
            width: '11rem',
            height: `${7 * images.length + 3}rem`,
          }}
        >
          {images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={`Image ${index + 1}`}
              className="w-40 h-40 rounded cursor-pointer border border-muted-foreground object-cover absolute"
              style={{
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
      <div className={`flex ${alignmentClass} mb-2`}>
        <video controls className="max-w-[60%] rounded-lg">
          <source src={content as string} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  } else if (type === 'audio') {
    return (
      <div className={`flex ${alignmentClass} mb-2`}>
        <audio controls className="max-w-[60%]">
          <source src={content as string} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>
    );
  }

  return null;
};

export default MessageBubble;
