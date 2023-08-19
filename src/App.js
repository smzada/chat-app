import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [messages, setMessages] = useState([]);
  const [newName, setNewName] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [selectedMessage, setSelectedMessage] = useState(null);
  
  const chatMessagesRef = useRef(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatMessagesRef.current.scrollTop = chatMessagesRef.current.scrollHeight;
  };

  const handleSendMessage = () => {
    if (newName.trim() !== '' && newMessage.trim() !== '') {
      const updatedMessages = [...messages];
      if (selectedMessage !== null) {
        addReplyToMessage(updatedMessages, selectedMessage, newName, newMessage);
      } else {
        updatedMessages.push(createNewMessage(newName, newMessage));
      }
  
      const sortedMessages = updatedMessages.sort((a, b) => {
        const aHasReply = hasNestedReply(a, selectedMessage);
        const bHasReply = hasNestedReply(b, selectedMessage);
  
        if (aHasReply && !bHasReply) return 1; 
        if (!aHasReply && bHasReply) return -1;
        return 0;
      });
  
      setMessages(sortedMessages);
      setNewName('');
      setNewMessage('');
      setSelectedMessage(null);
  
      document.activeElement.blur();
      scrollToBottom();
    }
  };
  
  const hasNestedReply = (message, targetReplyId) => {
    if (message.id === targetReplyId) return true;
    for (const reply of message.replies) {
      if (hasNestedReply(reply, targetReplyId)) return true;
    }
    return false;
  };
  
  const addReplyToMessage = (messages, messageId, user, content) => {
    const updatedMessages = [...messages];
    for (let i = 0; i < updatedMessages.length; i++) {
      if (updatedMessages[i].id === messageId) {
        updatedMessages[i].replies.unshift({
          id: Date.now(),
          user: user,
          timestamp: Date.now(),
          content: content,
          replies: [],
        });
        setMessages(updatedMessages);
        return true;
      }
      if (addReplyToMessage(updatedMessages[i].replies, messageId, user, content)) {
        setMessages(updatedMessages);
        return true;
      }
    }
    return false;
  };

  const createNewMessage = (user, content) => {
    return {
      id: Date.now(),
      user: user,
      timestamp: Date.now(),
      content: content,
      replies: [],
    };
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
  
    const formattedHours = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
    const formattedMinutes = String(minutes).padStart(2, '0');
  
    return `${formattedHours}:${formattedMinutes} ${ampm}`;
  };
  
  const handleMessageClick = (messageId) => {
    setSelectedMessage(selectedMessage === messageId ? null : messageId);
  };

  const renderReplies = (replies) => (
    <div className="replies">
      {replies.slice().reverse().map((reply) => (
        <div
          key={reply.id}
          onClick={(event) => handleReplyClick(event, reply.id)} 
          className={`message ${reply.user === 'user' ? 'user-reply' : ''} ${selectedMessage === reply.id ? 'selected-message' : ''}`}
        >
          <div className="message-content">
            <div className="message-header">
              <div className="user-info">{reply.user}</div>
              <div className="message-timestamp">{formatTimestamp(reply.timestamp)}</div>
            </div>
            {reply.content}
          </div>
          {reply.replies.length > 0 && (
            <div className="nested-replies">
              {renderReplies(reply.replies)}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const handleReplyClick = (event, messageId) => {
    event.stopPropagation();
    setSelectedMessage(selectedMessage === messageId ? null : messageId);
  };
  
  return (
  <div className="App">
    <div className="chat-container">
      <div className="chat-messages" ref={chatMessagesRef}>
        {messages.map((message) => (
          <div
            key={message.id}
            onClick={() => handleMessageClick(message.id)} 
            className={`message ${
              message.user === 'user' ? 'user-message' : ''
            } ${selectedMessage === message.id ? 'selected-message' : ''}`}
          >
            <div className="message-content">
              <div className="message-header">
                <div className="user-info">{message.user}</div>
                <div className="message-timestamp">
                  {formatTimestamp(message.timestamp)}
                </div>
              </div>
              {message.content}
            </div>
            {renderReplies(message.replies)}
          </div>
        ))}
      </div>
        <div className="message-input">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Enter your name..."
            className="name-input"
            style={{ width: "40%", marginRight: "5px" }}  
          />
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                handleSendMessage();
              }
            }}
            placeholder="Enter your message..."
            className="text-input"
            style={{ width: "70%" }}
          />
          <button onClick={handleSendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default App;
