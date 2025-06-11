// pre-portal/src/components/GeminiChatbot/GeminiChatbot.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import './GeminiChatbot.css'; // Import the CSS

const GeminiChatbot = () => {
    // ... (all your existing state and useEffect hooks remain the same) ...
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
        if (storedHistory.length === 0) { // If no history, start fresh
            setCurrentChatId(Date.now());
            setShowWelcome(true);
            setCurrentMessages([]);
        }
    }, []); // Load once on mount

    useEffect(() => {
        // Only save if there's data or if it was explicitly cleared
        if (chatHistoryData.length > 0 || localStorage.getItem('chatHistory') !== null) {
            localStorage.setItem('chatHistory', JSON.stringify(chatHistoryData));
        }
    }, [chatHistoryData]);


    // --- FORMATTING FUNCTIONS ---
    const escapeHtml = (unsafe) => {
        if (typeof unsafe !== 'string') return ''; // Handle non-string inputs gracefully
        return unsafe
            .replace(/&/g, "&") // Must be first
            .replace(/</g, "<")
            .replace(/>/g, ">")
            
            .replace(/'/g, "'");
    };
    
    const processInlineFormatting = (text) => {
        let escapedText = escapeHtml(String(text || '')); // Ensure text is a string
        return escapedText
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/_(.*?)_/g, '<u>$1</u>')
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\n/g, '<br />');
    };
    
    const formatBotContent = (content) => {
        content = String(content || ''); // Ensure content is a string
        let paragraphsHtml = [];
        let tempContent = content;

        // Regex to find code blocks first to preserve them
        const codeBlockRegex = /```([a-z]*\n)?([\s\S]*?)```/g;
        let lastIndex = 0;
        let match;

        while ((match = codeBlockRegex.exec(tempContent)) !== null) {
            // Process text before the code block
            const beforeCode = tempContent.substring(lastIndex, match.index);
            if (beforeCode.trim()) {
                 paragraphsHtml.push(...beforeCode.split('\n\n').filter(p => p.trim()).map(p => `<p>${processInlineFormatting(p)}</p>`));
            }

            // Process the code block
            const lang = match[1] ? match[1].trim() : '';
            const codeContent = match[2].trim();
            const escapedCodeContent = escapeHtml(codeContent);
            paragraphsHtml.push(`<pre><code class="language-${lang}">${escapedCodeContent}</code></pre>`);
            lastIndex = codeBlockRegex.lastIndex;
        }
        
        // Process text after the last code block
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
            // Update title based on the first user message if not already set
            if (!chat.title) {
                const firstUserMsg = chat.messages.find(m => m.sender === 'user');
                if (firstUserMsg) {
                    chat.title = firstUserMsg.message.substring(0, 30) + (firstUserMsg.message.length > 30 ? "..." : "");
                } else if (chat.messages.length > 0) { // Fallback if first message isn't user (e.g. initial bot message)
                     chat.title = chat.messages[0].message.substring(0, 30) + (chat.messages[0].message.length > 30 ? "..." : "");
                }
            }
            return historyCopy;
        });
    }, [saveToHistory]); 
    

    const handleSendMessage = async () => {
        const messageText = userInput.trim();
        if (!messageText || isTyping) return;

        let interactionChatId = currentChatId;
        // If it's a brand new chat (welcome message is showing), assign a new ID for this interaction
        if (showWelcome) { 
            interactionChatId = Date.now(); 
            setCurrentChatId(interactionChatId); // Set this as the active chat
        }
        
        addMessageToDisplay(messageText, 'user');
        // Save user message to history storage for the current/new interactionChatId
        if (saveToHistory) {
            saveMessageToHistoryStorage(messageText, 'user', interactionChatId);
        }
        
        setUserInput('');
        if (userInputRef.current) userInputRef.current.style.height = 'auto';
        setIsTyping(true);

        try {
            // Find the chat to send to API, ensuring it includes the message just added
            const chatForApi = 
                chatHistoryData.find(c => c.id === interactionChatId) || // Existing chat
                { id: interactionChatId, messages: [{message: messageText, sender: 'user', timestamp: Date.now()}] }; // New chat case


            // Construct history for API call, excluding the very last user message if it's identical to messageText
            // to prevent sending it twice if saveMessageToHistoryStorage updated chatHistoryData immediately.
            const historyForApiCall = chatForApi.messages
                .filter((msg, index, arr) => !(msg.sender === 'user' && msg.message === messageText && index === arr.length - 1))
                .map(msg => ({ 
                    role: msg.sender, // Send 'user' or 'bot' as role
                    message: msg.message
                }));
            
            // Append the current user's message if it wasn't part of the stored history yet
            // This ensures the current question is always part of the context for the API
            if (!historyForApiCall.find(h => h.role === 'user' && h.message === messageText)) {
                // This logic might be redundant if saveMessageToHistoryStorage runs synchronously
                // and chatForApi already includes the latest user message. Test this part.
            }

            // --- FETCH URL ---
            // const backendUrl = 'http://localhost:8080/api/ask'; // For local dev if backend on 8080
            const backendUrl = '/api/ask'; // For production or if proxy is set up

            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    question: messageText,
                    chatHistory: historyForApiCall // Send history with {role, message}
                })
            });

            setIsTyping(false);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ error: 'Server error or non-JSON response' }));
                throw new Error(errorData.error || `Request failed: ${response.status}`);
            }

            const data = await response.json();
            addMessageToDisplay(data.answer, 'bot');
            // Save bot's response to history storage for the current/new interactionChatId
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
        setCurrentChatId(newId); // Set new ID for the fresh chat session
        setCurrentMessages([]);   // Clear messages on display
        setShowWelcome(true);     // Show welcome message
        if (userInputRef.current) userInputRef.current.value = ''; // Clear input field
        setUserInput(''); // Clear state for input field
        if (userInputRef.current) userInputRef.current.style.height = 'auto'; // Reset height
        if (window.innerWidth < 768) setIsSidebarActive(false);
    };

    const loadChat = (chatId) => {
        const chat = chatHistoryData.find(c => c.id === chatId);
        if (chat) {
            setCurrentChatId(chat.id);
            setCurrentMessages(chat.messages || []); // Load messages, ensure it's an array
            setShowWelcome(false);
             if (userInputRef.current) userInputRef.current.value = ''; // Clear input on load
            setUserInput('');
            if (userInputRef.current) userInputRef.current.style.height = 'auto';
        }
        if (window.innerWidth < 768) setIsSidebarActive(false);
    };

    const handleDeleteChat = (e, chatId) => {
        e.stopPropagation(); // Prevent chat from loading when clicking delete
        setChatHistoryData(prev => prev.filter(c => c.id !== chatId));
        if (currentChatId === chatId) { // If deleting the active chat
            handleNewChat(); // Start a new chat session
        }
    };

    const handleStartRename = (e, chat) => {
        e.stopPropagation();
        setIsRenamingId(chat.id);
        // Set initial renaming text to current title or first message snippet
        setRenamingText(chat.title || (chat.messages && chat.messages.length > 0 ? chat.messages[0].message.substring(0, 30) + (chat.messages[0].message.length > 30 ? '...' : '') : 'New chat'));
    };
    
    const handleRenameConfirm = (chatIdToRename) => {
        const trimmedText = renamingText.trim();
        if (!trimmedText) { // If user clears text, revert or set to default
            const oldChat = chatHistoryData.find(c => c.id === chatIdToRename);
            setRenamingText(oldChat?.title || (oldChat?.messages && oldChat.messages.length > 0 ? oldChat.messages[0].message.substring(0,30) : 'New Chat'));
            setIsRenamingId(null); // Exit renaming mode
            return;
        }
        setChatHistoryData(prev => prev.map(c =>
            c.id === chatIdToRename ? { ...c, title: trimmedText } : c
        ));
        setIsRenamingId(null);
        setRenamingText(''); // Clear renaming text state
    };

    // --- AUTO-SCROLL & COPY ---
    useEffect(() => { // Auto-scroll chatbox to bottom
        if (chatboxRef.current) {
            chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
        }
    }, [currentMessages, isTyping]); // Trigger on new messages or typing indicator

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
            // Fallback for older browsers or insecure contexts (http)
            console.warn('Clipboard API not available. Manual copy might be needed.');
            // You could implement a textarea-based fallback here if essential
        }
    };
    
    // --- JSX Rendering ---
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
                            + New chat
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
                                <div key={chat.id} className="chat-item" onClick={() => !isRenamingId && loadChat(chat.id)}>
                                    {isRenamingId === chat.id ? (
                                        <input
                                            type="text"
                                            className="rename-input"
                                            value={renamingText}
                                            onChange={(e) => setRenamingText(e.target.value)}
                                            onBlur={() => handleRenameConfirm(chat.id)}
                                            onKeyDown={(e) => {
                                                if(e.key === 'Enter') handleRenameConfirm(chat.id); 
                                                if(e.key === 'Escape') {setIsRenamingId(null); setRenamingText('');} // Cancel on Escape
                                            }}
                                            autoFocus
                                            onClick={(e) => e.stopPropagation()} // Prevent chat load when clicking input
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
                    </div>
                </div>

                <div className="main">
                    <div id="chatbox" ref={chatboxRef}>
                        {showWelcome && (
                            <div className="welcome-message">
                                <h2>Welcome to Gemini</h2>
                                <p>Start a new chat or select from your history</p>
                                <p>Ask me anything!</p>
                            </div>
                        )}
                        {currentMessages.map((msg, index) => (
                            // Use a more robust key, like timestamp + index if timestamps can be identical for rapid messages
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
                             <div className="message-container bot-message-container" id="typing-indicator">
                                <div className="avatar bot-avatar">G</div>
                                <div className="typing-indicator">
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                    <div className="typing-dot"></div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="input-area">
                        <textarea
                            ref={userInputRef}
                            id="userInput" // Keep ID if CSS targets it, or remove if not
                            placeholder="Type your message..."
                            autoComplete="off"
                            rows="1"
                            value={userInput}
                            onChange={handleUserInputChange}
                            onKeyDown={handleUserInputKeyDown}
                            disabled={isTyping} // Disable input while bot is typing
                        />
                        <button 
                            id="sendButton" // Keep ID if CSS targets it
                            onClick={handleSendMessage} 
                            disabled={isTyping || !userInput.trim()} // Disable if typing or input is empty
                        >
                            {isTyping ? 'Sending...' : 'Send'}
                        </button>
                    </div>
                </div>
                <button ref={mobileMenuBtnRef} className="mobile-menu-btn" onClick={toggleMobileMenu}>☰</button>
            </div>
        </div>
    );
};

export default GeminiChatbot;