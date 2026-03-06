
import React, { useState, useCallback, useEffect, useRef } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { Role, Message, ChatSession } from './types';
import { streamMessageFromModel, Model } from './services/geminiService';



const App: React.FC = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedModel, setSelectedModel] = useState<Model>(Model.DEEPSEEK_R1);
  const [isThinking, setIsThinking] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize sidebar state based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarCollapsed(true);
      }
    };

    // Set initial state
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleModelChange = useCallback((model: Model) => {
    setSelectedModel(model);
  }, []);

  const handleThinkingChange = useCallback((thinking: boolean) => {
    setIsThinking(thinking);
  }, []);

  const handleSearchingChange = useCallback((searching: boolean) => {
    setIsSearching(searching);
  }, []);

  const activeSession = sessions.find(s => s.id === activeSessionId) || null;

  const handleNewChat = useCallback(() => {
    const newId = Date.now().toString();
    const newSession: ChatSession = {
      id: newId,
      title: 'Nowa rozmowa',
      messages: [],
      updatedAt: Date.now(),
    };
    setSessions(prev => [newSession, ...prev]);
    setActiveSessionId(newId);
  }, []);

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      // Do not nullify abortControllerRef.current here, otherwise the loop won't see the signal
    }
    setIsProcessing(false);
  };

  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isProcessing) return;

    // Initialize abort controller
    abortControllerRef.current = new AbortController();

    let currentSessionId = activeSessionId;
    
    // If no session exists or active session is null, create one
    if (!currentSessionId) {
      const newId = Date.now().toString();
      const newSession: ChatSession = {
        id: newId,
        title: text.length > 30 ? text.substring(0, 30) + '...' : text,
        messages: [],
        updatedAt: Date.now(),
      };
      setSessions(prev => [newSession, ...prev]);
      setActiveSessionId(newId);
      currentSessionId = newId;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      content: text,
      timestamp: Date.now(),
    };

    // Optimistically add user message
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return {
          ...s,
          title: s.messages.length === 0 ? (text.length > 40 ? text.substring(0, 40) + '...' : text) : s.title,
          messages: [...s.messages, userMessage],
          updatedAt: Date.now()
        };
      }
      return s;
    }));

    setIsProcessing(true);

    // Create placeholder for AI response
    const aiMessageId = (Date.now() + 1).toString();
    const modelMessage: Message = {
      id: aiMessageId,
      role: Role.MODEL,
      content: '', // Start empty
      reasoning: undefined,
      timestamp: Date.now(),
    };

    // Add placeholder AI message
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return {
          ...s,
          messages: [...s.messages, modelMessage],
          updatedAt: Date.now()
        };
      }
      return s;
    }));

    try {
      const history = sessions.find(s => s.id === currentSessionId)?.messages || [];
      const stream = streamMessageFromModel(selectedModel, history, text, isThinking);
      
      let fullContent = '';
      
      for await (const chunk of stream) {
        if (abortControllerRef.current?.signal.aborted) break;

        // Split chunk into characters for smooth "letter by letter" streaming effect
        const chars = chunk.split('');
        for (const char of chars) {
            if (abortControllerRef.current?.signal.aborted) break;

            fullContent += char;

            // Logic to parse <think> tags
            let displayContent = fullContent;
            let reasoningContent = undefined;

            if (fullContent.startsWith('<think>')) {
                const thinkEndIndex = fullContent.indexOf('</think>');
                if (thinkEndIndex !== -1) {
                    reasoningContent = fullContent.substring(7, thinkEndIndex);
                    displayContent = fullContent.substring(thinkEndIndex + 8).trimStart();
                } else {
                    reasoningContent = fullContent.substring(7);
                    displayContent = '';
                }
            }
            
            setSessions(prev => prev.map(s => {
              if (s.id === currentSessionId) {
                // Find the message to update
                const updatedMessages = s.messages.map(msg => {
                  if (msg.id === aiMessageId) {
                    return { 
                        ...msg, 
                        content: displayContent,
                        reasoning: reasoningContent 
                    };
                  }
                  return msg;
                });
                
                return {
                  ...s,
                  messages: updatedMessages,
                  updatedAt: Date.now()
                };
              }
              return s;
            }));
            
            // Artificial delay to simulate typing
            await new Promise(resolve => setTimeout(resolve, 10));
        }
      }

    } catch (error) {
      console.error("Error calling Gemini:", error);
      // Update message to show error if needed, or leave partial content
      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
           // If content is empty, show error message
           const updatedMessages = s.messages.map(msg => {
             if (msg.id === aiMessageId && msg.content === '') {
               return { ...msg, content: "Wystąpił błąd podczas generowania odpowiedzi." };
             }
             return msg;
           });
           return { ...s, messages: updatedMessages };
        }
        return s;
      }));
    } finally {
      setIsProcessing(false);
      abortControllerRef.current = null;
    }
  };

  const handleSelectChat = (id: string) => {
    setActiveSessionId(id);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="flex h-screen bg-white dark:bg-[#131314] overflow-hidden">
      <Sidebar 
        sessions={sessions}
        activeSessionId={activeSessionId || ''}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        isCollapsed={isSidebarCollapsed}
        toggleSidebar={toggleSidebar}
      />

      <ChatArea 
        session={activeSession}
        onSendMessage={handleSendMessage}
        onStop={handleStop}
        isProcessing={isProcessing}
        onToggleSidebar={toggleSidebar}
        onThinkingChange={handleThinkingChange}
        selectedModel={selectedModel}
        onModelChange={handleModelChange}
        isThinking={isThinking}
        isSearching={isSearching}
        onSearchingChange={handleSearchingChange}
      />
    </div>
  );
};

export default App;
