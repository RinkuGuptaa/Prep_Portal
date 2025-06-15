// pre-portal/src/components/GeminiChatbot/GeminiChatbot.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './GeminiChatbot.css'; // Import the CSS

const GeminiChatbot = () => {
    const [theme, setTheme] = useState('dark');
    const [isSidebarActive, setIsSidebarActive] = useState(false);
    const [saveToHistory, setSaveToHistory] = useState(() => {
        const saved = localStorage.getItem('saveChatToHistory');
        return saved !== null ? JSON.parse(saved) : true;
    });
    const [userInput, setUserInput] = useState('');
    const [currentChatId, setCurrentChatId] = useState(() => Date.now());
    const [chatHistoryData, setChatHistoryData] = useState([]);
    const [currentMessages, setCurrentMessages] = useState([]);
    const [isRenamingId, setIsRenamingId] = useState(null);
    const [renamingText, setRenamingText] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [showWelcome, setShowWelcome] = useState(true);

    const chatboxRef = useRef(null);
    const userInputRef = useRef(null);
    const sidebarRef = useRef(null);
    const mobileMenuBtnRef = useRef(null);

    // --- THEME ---
    useEffect(() => {
        const savedTheme = localStorage.getItem('theme');
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (savedTheme) setTheme(savedTheme);
        else setTheme(systemPrefersDark ? 'dark' : 'light');
    }, []);

    useEffect(() => { localStorage.setItem('theme', theme); }, [theme]);
    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    // --- SAVE TO HISTORY TOGGLE ---
    useEffect(() => { localStorage.setItem('saveChatToHistory', JSON.stringify(saveToHistory)); }, [saveToHistory]);

    // --- SIDEBAR ---
    const toggleMobileMenu = () => setIsSidebarActive(prev => !prev);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (window.innerWidth < 768 && sidebarRef.current && !sidebarRef.current.contains(event.target) && mobileMenuBtnRef.current && !mobileMenuBtnRef.current.contains(event.target)) {
                setIsSidebarActive(false);
            }
        };
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // --- USER INPUT & TEXTAREA RESIZE ---
    const handleUserInputChange = (e) => {
        setUserInput(e.target.value);
        if (userInputRef.current) {
            userInputRef.current.style.height = 'auto';
            userInputRef.current.style.height = `${userInputRef.current.scrollHeight}px`;
        }
    };

    // --- CHAT HISTORY & MESSAGES LOCAL STORAGE ---
    useEffect(() => {
        const storedHistory = JSON.parse(localStorage.getItem('chatHistory')) || [];
        setChatHistoryData(storedHistory);
        if (storedHistory.length === 0) {
            setCurrentChatId(Date.now());
            setShowWelcome(true);
            setCurrentMessages([]);
        }
    }, []);

    useEffect(() => {
        if (chatHistoryData.length > 0 || localStorage.getItem('chatHistory') !== null) {
            localStorage.setItem('chatHistory', JSON.stringify(chatHistoryData));
        }
    }, [chatHistoryData]);

    // --- FORMATTING FUNCTIONS ---
    const escapeHtml = (unsafe) => {
        if (typeof unsafe !== 'string') return '';
        return unsafe
            .replace(/&/g, "&")
            .replace(/</g, "<")
            .replace(/>/g, ">")
            .replace(/'/g, "'");
    };

    const processInlineFormatting = (text) => {
        let escapedText = escapeHtml(String(text || ''));
        return escapedText
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/_(.*?)_/g, '<u>$1</u>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br />');
    };

    const formatBotContent = (content) => {
        content = String(content || '');
        let paragraphsHtml = [];
        let tempContent = content;

        const codeBlockRegex = /```([a-z]*\n)?([\s\S]*?)```/g;
        let lastIndex = 0;
        let match;

        while ((match = codeBlockRegex.exec(tempContent)) !== null) {
            const beforeCode = tempContent.substring(lastIndex, match.index);
            if (beforeCode.trim()) {
                paragraphsHtml.push(...beforeCode.split('\n\n').filter(p => p.trim()).map(p => `<p>${processInlineFormatting(p)}</p>`));
            }

            const lang = match[1] ? match[1].trim() : '';
            const codeContent = match[2].trim();
            const escapedCodeContent = escapeHtml(codeContent);
            paragraphsHtml.push(`<pre><code class="language-${lang}">${escapedCodeContent}</code></pre>`);
            lastIndex = codeBlockRegex.lastIndex;
        }

        const afterLastCodeBlock = tempContent.substring(lastIndex);
        if (afterLastCodeBlock.trim()) {
            paragraphsHtml.push(...afterLastCodeBlock.split('\n\n').filter(p => p.trim()).map(p => {
                let processedPara = p;
                if (processedPara.match(/^#{1,3}\s/)) {
                    const level = processedPara.match(/^#+/)[0].length;
                    const headingText = processedPara.replace(/^#+\s/, '');
                    return `<h${level}>${processInlineFormatting(headingText)}</h${level}>`;
                }
                if (processedPara.startsWith('> ')) {
                    const quoteText = processedPara.substring(2);
                    return `<blockquote>${processInlineFormatting(quoteText)}</blockquote>`;
                }
                if (processedPara.match(/^[\s]*[\-\*\+]\s/) || processedPara.match(/^[\s]*\d+\.\s/)) {
                    const listItems = processedPara.split('\n').filter(item => item.trim());
                    const isOrdered = processedPara.match(/^[\s]*\d+\.\s/);
                    const listTag = isOrdered ? 'ol' : 'ul';
                    const listContent = listItems.map(item => {
                        const cleanedItem = item.replace(/^[\s]*[\-\*\+]\s|^[\s]*\d+\.\s/, '');
                        return `<li>${processInlineFormatting(cleanedItem)}</li>`;
                    }).join('');
                    return `<${listTag}>${listContent}</${listTag}>`;
                }
                return `<p>${processInlineFormatting(processedPara)}</p>`;
            }));
        }
        return paragraphsHtml.join('');
    };

    // --- MESSAGE HANDLING ---
    const addMessageToDisplay = (message, sender) => {
        if (showWelcome) setShowWelcome(false);
        setCurrentMessages(prevMessages => [...prevMessages, { message, sender, timestamp: Date.now() }]);
    };

    const saveMessageToHistoryStorage = useCallback((messageContent, senderRole, chatIdToSaveTo) => {
        if (!saveToHistory) return;
        setChatHistoryData(prevHistory => {
            const historyCopy = [...prevHistory];
            let chat = historyCopy.find(c => c.id === chatIdToSaveTo);
            if (!chat) {
                chat = { id: chatIdToSaveTo, title: null, messages: [] };
                historyCopy.unshift(chat);
            }
            chat.messages.push({ message: messageContent, sender: senderRole, timestamp: Date.now() });
            if (!chat.title) {
                const firstUserMsg = chat.messages.find(m => m.sender === 'user');
                if (firstUserMsg) {
                    chat.title = firstUserMsg.message.substring(0, 30) + (firstUserMsg.message.length > 30 ? "..." : "");
                } else if (chat.messages.length > 0) {
                    chat.title = chat.messages[0].message.substring(0, 30) + (chat.messages[0].message.length > 30 ? "..." : "");
                }
            }
            return historyCopy;
        });
    }, [saveToHistory]);

    const detectInputLanguage = (text) => {
        if (/[\u0900-\u097F]/.test(text)) return 'hi'; // Hindi
        if (/[\uAC00-\uD7AF]/.test(text)) return 'ko'; // Korean
        if (/[\u0400-\u04FF]/.test(text)) return 'ru'; // Russian
        if (/[\u0600-\u06FF]/.test(text)) return 'ar'; // Arabic
        if (/[\u0E00-\u0E7F]/.test(text)) return 'th'; // Thai
        if (/[\u0980-\u09FF]/.test(text)) return 'bn'; // Bengali
        
        // Default to English if no specific script detected
        return 'en';
    };

    const handleSendMessage = async () => {
        const messageText = userInput.trim();
        if (!messageText || isTyping) return;

        // Detect language from input
        const userLanguage = detectInputLanguage(messageText);

        let interactionChatId = currentChatId;
        if (showWelcome) {
            interactionChatId = Date.now();
            setCurrentChatId(interactionChatId);
        }

        addMessageToDisplay(messageText, 'user');
        if (saveToHistory) {
            saveMessageToHistoryStorage(messageText, 'user', interactionChatId);
        }

        setUserInput('');
        if (userInputRef.current) userInputRef.current.style.height = 'auto';
        setIsTyping(true);

        try {
            const chatForApi = 
                chatHistoryData.find(c => c.id === interactionChatId) || 
                { id: interactionChatId, messages: [{ message: messageText, sender: 'user', timestamp: Date.now() }] };

            const historyForApiCall = chatForApi.messages
                .filter((msg, index, arr) => !(msg.sender === 'user' && msg.message === messageText && index === arr.length - 1))
                .map(msg => ({
                    role: msg.sender,
                    message: msg.message
                }));

            const backendUrl = 'https://prep-portal-backend.onrender.com/api/ask';

            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: messageText,
                    chatHistory: historyForApiCall,
                    language: userLanguage // Send detected language to backend
                })
            });

            setIsTyping(false);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Server error or non-JSON response' }));
                throw new Error(errorData.error || `Request failed: ${response.status}`);
            }

            const data = await response.json();
            addMessageToDisplay(data.answer, 'bot');
            if (saveToHistory) {
                saveMessageToHistoryStorage(data.answer, 'bot', interactionChatId);
            }

        } catch (error) {
            setIsTyping(false);
            addMessageToDisplay(`Sorry, an error occurred: ${error.message}`, 'bot');
            console.error('Error sending message:', error);
        }
    };

    const handleUserInputKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // --- CHAT MANAGEMENT (NEW, LOAD, DELETE, RENAME) ---
    const handleNewChat = () => {
        const newId = Date.now();
        setCurrentChatId(newId);
        setCurrentMessages([]);
        setShowWelcome(true);
        if (userInputRef.current) userInputRef.current.value = '';
        setUserInput('');
        if (userInputRef.current) userInputRef.current.style.height = 'auto';
        if (window.innerWidth < 768) setIsSidebarActive(false);
    };

    const loadChat = (chatId) => {
        const chat = chatHistoryData.find(c => c.id === chatId);
        if (chat) {
            setCurrentChatId(chat.id);
            setCurrentMessages(chat.messages || []);
            setShowWelcome(false);
            if (userInputRef.current) userInputRef.current.value = '';
            setUserInput('');
            if (userInputRef.current) userInputRef.current.style.height = 'auto';
        }
        if (window.innerWidth < 768) setIsSidebarActive(false);
    };

    const handleDeleteChat = (e, chatId) => {
        e.stopPropagation();
        setChatHistoryData(prev => prev.filter(c => c.id !== chatId));
        if (currentChatId === chatId) {
            handleNewChat();
        }
    };

    const handleStartRename = (e, chat) => {
        e.stopPropagation();
        setIsRenamingId(chat.id);
        setRenamingText(chat.title || (chat.messages && chat.messages.length > 0 ? chat.messages[0].message.substring(0, 30) + (chat.messages[0].message.length > 30 ? '...' : '') : 'New chat'));
    };

    const handleRenameConfirm = (chatIdToRename) => {
        const trimmedText = renamingText.trim();
        if (!trimmedText) {
            const oldChat = chatHistoryData.find(c => c.id === chatIdToRename);
            setRenamingText(oldChat?.title || (oldChat?.messages && oldChat.messages.length > 0 ? oldChat.messages[0].message.substring(0, 30) : 'New Chat'));
            setIsRenamingId(null);
            return;
        }
        setChatHistoryData(prev => prev.map(c =>
            c.id === chatIdToRename ? { ...c, title: trimmedText } : c
        ));
        setIsRenamingId(null);
        setRenamingText('');
    };

    // --- AUTO-SCROLL & COPY ---
    useEffect(() => {
        if (chatboxRef.current) {
            chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
        }
    }, [currentMessages, isTyping]);

    const handleCopy = (textToCopy, buttonElement) => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                if (buttonElement) {
                    const originalText = buttonElement.textContent;
                    buttonElement.textContent = 'Copied!';
                    setTimeout(() => {
                        buttonElement.textContent = originalText;
                    }, 2000);
                }
            }).catch(err => console.error('Failed to copy text: ', err));
        } else {
            console.warn('Clipboard API not available. Manual copy might be needed.');
        }
    };

    return (
        <div className={`gemini-chatbot-page ${theme}-mode`}>
            <div className="app-container">
                <div ref={sidebarRef} className={`sidebar ${isSidebarActive ? 'active' : ''}`}>
                    <div className="sidebar-header">
                        <h3 style={{ color: 'var(--text)', margin: 0, fontSize: '1.1em' }}>Chat History</h3>
                        <button className="theme-toggle" onClick={toggleTheme} title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}>
                            {theme === 'light' ? '🌙' : '☀️'}
                        </button>
                    </div>
                    <div className="sidebar-content">
                        <button className="new-chat-btn" onClick={handleNewChat}>
                            <i className="fas fa-plus"></i> New chat
                        </button>
                        <div className="save-toggle">
                            <span>Save to history</span>
                            <label className="toggle-switch">
                                <input type="checkbox" id="saveToggle" checked={saveToHistory} onChange={(e) => setSaveToHistory(e.target.checked)} />
                                <span className="slider"></span>
                            </label>
                        </div>
                        <div className="chat-history">
                            {chatHistoryData.length === 0 && !isRenamingId && (
                                <div style={{ padding: '15px', textAlign: 'center', color: 'var(--text)', opacity: '0.7' }}>
                                    No chat history yet
                                </div>
                            )}
                            {chatHistoryData.map(chat => (
                                <div key={chat.id} className={`chat-item ${currentChatId === chat.id ? 'active-chat-item' : ''}`} onClick={() => !isRenamingId && loadChat(chat.id)}>
                                    {isRenamingId === chat.id ? (
                                        <input
                                            type="text"
                                            className="rename-input"
                                            value={renamingText}
                                            onChange={(e) => setRenamingText(e.target.value)}
                                            onBlur={() => handleRenameConfirm(chat.id)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleRenameConfirm(chat.id);
                                                if (e.key === 'Escape') { setIsRenamingId(null); setRenamingText(''); }
                                            }}
                                            autoFocus
                                            onClick={(e) => e.stopPropagation()}
                                        />
                                    ) : (
                                        <>
                                            <div className="chat-item-text">
                                                {chat.title || (chat.messages && chat.messages.length > 0 ? chat.messages[0].message.substring(0, 30) + (chat.messages[0].message.length > 30 ? '...' : '') : 'New chat')}
                                            </div>
                                            <div className="chat-item-actions">
                                                <button className="chat-action-btn" title="Rename chat" onClick={(e) => handleStartRename(e, chat)}>✏️</button>
                                                <button className="chat-action-btn" title="Delete chat" onClick={(e) => handleDeleteChat(e, chat.id)}>🗑️</button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="about-section">
                            <div className="about-content">
                                Prep-Portal Chatbot v1.0<br />
                                A simple AI assistant interface
                            </div>
                            <div className="developer-info">
                                <span>Developed by </span>
                                <a href="https://www.linkedin.com/in/rinku-gupta-384b07283?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
                                    target="_blank" rel="noopener noreferrer" title="View developer's LinkedIn">
                                    <i className="fab fa-linkedin linkedin-icon"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="main">
                    <div id="chatbox" ref={chatboxRef}>
                        {showWelcome && (
                            <div className="welcome-message">
                                <h2>Welcome to Prep-Portal!</h2>
                                <p>Start a new chat or select from your history.</p>
                                <p>Ask me anything!</p>
                            </div>
                        )}
                        {currentMessages.map((msg, index) => (
                            <div key={`${msg.timestamp}-${index}`} className={`message-container ${msg.sender}-message-container`}>
                                <div className={`avatar ${msg.sender}-avatar`}>
                                    {msg.sender === 'user' ? 'Y' : 'G'}
                                </div>
                                <div className={`message ${msg.sender}-message`}>
                                    {msg.sender === 'bot' ? (
                                        <>
                                            <div dangerouslySetInnerHTML={{ __html: formatBotContent(msg.message) }} />
                                            <button className="copy-btn" onClick={(e) => handleCopy(msg.message, e.currentTarget)}>Copy</button>
                                        </>
                                    ) : (
                                        <div dangerouslySetInnerHTML={{ __html: processInlineFormatting(msg.message) }} />
                                    )}
                                </div>
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message-container bot-message-container">
                                <div className="avatar bot-avatar">G</div>
                                <div className="message bot-message">
                                    
                                    <div className="typing-indicator">
                                        <div className="typing-dot"></div>
                                        <div className="typing-dot"></div>
                                        <div className="typing-dot"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="input-area-wrapper">
                        <div className="input-area">
                            <textarea
                                ref={userInputRef}
                                id="userInput"
                                placeholder="Type your message..."
                                autoComplete="off"
                                rows="1"
                                value={userInput}
                                onChange={handleUserInputChange}
                                onKeyDown={handleUserInputKeyDown}
                                disabled={isTyping}
                            />
                            <button
                                id="sendButton"
                                onClick={handleSendMessage}
                                disabled={isTyping || !userInput.trim()}
                            >
                                <i className="fas fa-paper-plane"></i>
                            </button>
                        </div>
                        <div className="save-toggle">
                            <span>Save to history</span>
                            <label className="toggle-switch">
                                <input type="checkbox" id="saveToggle" checked={saveToHistory} onChange={(e) => setSaveToHistory(e.target.checked)} />
                                <span className="slider"></span>
                            </label>
                        </div>
                    </div>
                </div>
                <button ref={mobileMenuBtnRef} className="mobile-menu-btn" onClick={toggleMobileMenu}><i className="fas fa-bars"></i></button>
            </div>
        </div>
    );
};

export default GeminiChatbot;