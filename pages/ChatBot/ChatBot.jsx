import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, MessageCircle } from 'lucide-react';
import styles from './ChatBot.module.css';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', content: 'Hello! I\'m your AI assistant. How can I help you improve your academic performance today?' }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const formatBotResponse = (text) => {
        if (!text) return text;

        let formatted = text;

        formatted = formatted.replace(/^### (.*$)/gm, '<h3>$1</h3>');
        formatted = formatted.replace(/^## (.*$)/gm, '<h2>$1</h2>');
        formatted = formatted.replace(/^# (.*$)/gm, '<h1>$1</h1>');
        formatted = formatted.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        formatted = formatted.replace(/\*(.*?)\*/g, '<em>$1</em>');
        formatted = formatted.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');
        formatted = formatted.replace(/`([^`]+)`/g, '<code>$1</code>');
        formatted = formatted.replace(/^\d+\.\s(.+)$/gm, '<li>$1</li>');
        formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ol>$1</ol>');
        formatted = formatted.replace(/^[-*]\s(.+)$/gm, '<li>$1</li>');
        if (!formatted.includes('<ol>')) {
            formatted = formatted.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
        }

        const paragraphs = formatted.split('\n\n').filter(p => p.trim());
        formatted = paragraphs.map(p => {
            if (p.startsWith('<h') || p.startsWith('<ol>') || p.startsWith('<ul>') || p.startsWith('<pre>')) {
                return p;
            }
            if (p.trim().startsWith('<li>')) {
                return p;
            }
            return `<p>${p}</p>`;
        }).join('');

        return formatted;
    };

    const FormattedMessage = ({ content }) => {
        return (
            <div
                className={styles.formattedContent}
                dangerouslySetInnerHTML={{ __html: formatBotResponse(content) }}
            />
        );
    };

    const sendMessage = async () => {
        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage.trim();
        setInputMessage('');

        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);
        setIsTyping(true);

        try {
            const apiMessages = messages
                .filter(msg => msg.role !== 'bot')
                .map(msg => ({ role: msg.role, content: msg.content }));

            apiMessages.push({ role: 'user', content: userMessage });

            const response = await fetch('http://localhost:3000/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    message: userMessage,
                    conversation: apiMessages
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success) {
                let botResponse;

                if (data.response) {
                    botResponse = data.response.result ||
                        data.response.content ||
                        data.response.message ||
                        data.response.text ||
                        data.response.reply ||
                        data.response.output ||
                        (typeof data.response === 'string' ? data.response : null);
                }

                if (!botResponse) {
                    botResponse = data.result || data.message || data.content || data.text || data.reply;
                }

                if (!botResponse) {
                    botResponse = 'I received your message but couldn\'t format a proper response.';
                }

                setTimeout(() => {
                    setMessages(prev => [...prev, { role: 'bot', content: botResponse }]);
                    setIsTyping(false);
                }, 1000);
            } else {
                setTimeout(() => {
                    setMessages(prev => [...prev, { role: 'bot', content: data.error || 'Sorry, I encountered an error. Please try again.' }]);
                    setIsTyping(false);
                }, 1000);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setTimeout(() => {
                setMessages(prev => [...prev, { role: 'bot', content: 'Sorry, I\'m having trouble connecting. Please try again later.' }]);
                setIsTyping(false);
            }, 1000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <>
            {/* Toggle Button */}
            <button
                className={styles.toggleButton}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? 'Close chat' : 'Open chat'}
            >
                {isOpen ? (
                    <X size={24} />
                ) : (
                    <Bot size={24} />
                )}
                {!isOpen && <span className={styles.togglePulse}></span>}
            </button>

            {/* Chat Window */}
            <div className={`${styles.chatContainer} ${isOpen ? styles.chatOpen : styles.chatClosed}`}>
                <div className={styles.chatWrapper}>
                    {/* Header */}
                    <div className={styles.chatHeader}>
                        <div className={styles.headerContent}>
                            <div className={styles.headerLeft}>
                                <div className={styles.botAvatar}>
                                    <Bot size={20} />
                                    <span className={styles.onlineIndicator}></span>
                                </div>
                                <div className={styles.headerText}>
                                    <h1>AI Study Assistant</h1>
                                    <p>Always here to help</p>
                                </div>
                            </div>
                            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className={styles.messagesContainer}>
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                className={`${styles.message} ${message.role === "user" ? styles.messageUser : styles.messageBot}`}
                            >
                                <div className={`${styles.messageWrapper} ${message.role === "user" ? styles.messageWrapperUser : styles.messageWrapperBot}`}>
                                    <div className={`${styles.messageAvatar} ${message.role === "user" ? styles.avatarUser : styles.avatarBot}`}>
                                        {message.role === "user" ? "👤" : <Bot size={16} />}
                                    </div>
                                    <div className={styles.messageContentWrapper}>
                                        <div className={`${styles.messageContent} ${message.role === "user" ? styles.contentUser : styles.contentBot}`}>
                                            {message.role === "bot" ? (
                                                <FormattedMessage content={message.content} />
                                            ) : (
                                                <p>{message.content}</p>
                                            )}
                                        </div>
                                        <span className={`${styles.messageTime} ${message.role === "user" ? styles.timeUser : styles.timeBot}`}>
                                            {new Date().toLocaleTimeString([], {
                                                hour: "2-digit",
                                                minute: "2-digit"
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* Typing Indicator */}
                        {isTyping && (
                            <div className={`${styles.message} ${styles.messageBot}`}>
                                <div className={`${styles.messageWrapper} ${styles.messageWrapperBot}`}>
                                    <div className={`${styles.messageAvatar} ${styles.avatarBot}`}>
                                        <Bot size={16} />
                                    </div>
                                    <div className={styles.typingIndicator}>
                                        <div className={styles.typingDots}>
                                            <div className={styles.typingDot}></div>
                                            <div className={styles.typingDot}></div>
                                            <div className={styles.typingDot}></div>
                                        </div>
                                        <span>AI is thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <div className={styles.inputSection}>
                        <div className={styles.inputWrapper}>
                            <div className={styles.inputContainer}>
                                <textarea
                                    value={inputMessage}
                                    onChange={(e) => setInputMessage(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Ask me anything..."
                                    className={styles.messageInput}
                                    rows="1"
                                    disabled={isLoading}
                                />
                                <MessageCircle className={styles.inputIcon} size={16} />
                            </div>
                            <button
                                onClick={sendMessage}
                                disabled={!inputMessage.trim() || isLoading}
                                className={styles.sendButton}
                            >
                                {isLoading ? (
                                    <div className={styles.loadingSpinner}></div>
                                ) : (
                                    <Send size={18} />
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ChatBot;
