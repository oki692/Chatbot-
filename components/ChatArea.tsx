
import React, { useState, useRef, useEffect } from 'react';
import { Atom, Globe, Plus } from 'lucide-react';
import { Message, Role, ChatSession } from '../types';
import { PromptInput, PromptInputTextarea, PromptInputActions, PromptSubmitButton } from './PromptBox';
import { UserMessageBubble, AssistantMessageBubble } from './MessageBubbles';

import { Model } from '../services/geminiService';
import { Menu } from './Menu';

interface ChatAreaProps {
  session: ChatSession | null;
  onSendMessage: (text: string) => void;
  onStop: () => void;
  isProcessing: boolean;
  onToggleSidebar?: () => void;
  selectedModel: Model;
  onModelChange: (model: Model) => void;
  isThinking: boolean;
  onThinkingChange: (thinking: boolean) => void;
  isSearching: boolean;
  onSearchingChange: (searching: boolean) => void;
}

const SidebarToggleIcon = ({ size = 24, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M3 8C3 7.44772 3.44772 7 4 7H20C20.5523 7 21 7.44772 21 8C21 8.55228 20.5523 9 20 9H4C3.44772 9 3 8.55228 3 8ZM3 16C3 15.4477 3.44772 15 4 15H14C14.5523 15 15 15.4477 15 16C15 16.5523 14.5523 17 14 17H4C3.44772 17 3 16.5523 3 16Z" fill="currentColor" />
  </svg>
)

const ChatArea: React.FC<ChatAreaProps> = ({ session, onSendMessage, onStop, isProcessing, onToggleSidebar, selectedModel, onModelChange, isThinking, onThinkingChange, isSearching, onSearchingChange }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [session?.messages, isProcessing]);

  const handleSubmit = () => {
    if (!input.trim() || isProcessing) return;
    onSendMessage(input);
    setInput('');
  };

  // Logic to determine if we are in "Empty/Welcome" state or "Chat" state
  const isEmpty = !session || (session.messages.length === 0 && !isProcessing);

  return (
    <div className="flex-1 flex flex-col h-screen bg-white dark:bg-[#131314] relative">
      
      {/* HEADER SECTION */}
      <div className="h-14 border-b border-transparent flex items-center justify-between px-4 md:justify-center md:px-6 bg-white dark:bg-[#131314] z-10 sticky top-0">
          {/* Mobile Toggle Button */}
          <button 
            onClick={onToggleSidebar} 
            className="md:hidden p-2 -ml-2 text-gray-500 dark:text-[#8A8A8D]"
          >
            <SidebarToggleIcon size={28} />
          </button>
          
          {/* Menu */}
          <div className="flex-1 flex justify-start md:justify-center ml-2 md:ml-0">
            <Menu
              selectedModel={selectedModel}
              onModelChange={onModelChange}
              isThinking={isThinking}
              onThinkingChange={onThinkingChange}
            />
          </div>
      </div>

      {/* MAIN CONTENT SECTION */}
      <div className="flex-1 overflow-y-auto">
        {isEmpty ? (
           // Welcome Screen Content
           <div className="h-full flex flex-col items-center justify-center px-4">
             <div className="flex flex-col items-center gap-6 animate-fade-in">
                <div className="text-[#4D88FF] w-12 h-12 flex items-center justify-center text-2xl">
                   <svg width="57" height="42" viewBox="0 0 57 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M55.6128 3.47119C55.0175 3.17944 54.7611 3.73535 54.413 4.01782C54.2939 4.10889 54.1932 4.22729 54.0924 4.33667C53.2223 5.26587 52.2057 5.87646 50.8776 5.80347C48.9359 5.69409 47.2781 6.30469 45.8126 7.78979C45.5012 5.9585 44.4663 4.86499 42.8909 4.16357C42.0667 3.79907 41.2332 3.43457 40.6561 2.64185C40.2532 2.07715 40.1432 1.44849 39.9418 0.828857C39.8135 0.455322 39.6853 0.0725098 39.2548 0.00878906C38.7877 -0.0639648 38.6045 0.327637 38.4213 0.655762C37.6886 1.99512 37.4047 3.47119 37.4321 4.96533C37.4962 8.32739 38.9159 11.0059 41.7369 12.9102C42.0575 13.1289 42.1399 13.3474 42.0392 13.6665C41.8468 14.3225 41.6178 14.9602 41.4164 15.6162C41.2881 16.0354 41.0957 16.1265 40.647 15.9441C39.0991 15.2974 37.7618 14.3406 36.5803 13.1836C34.5745 11.2429 32.761 9.10181 30.4988 7.42529C29.9675 7.03345 29.4363 6.66919 28.8867 6.32275C26.5786 4.08154 29.189 2.24097 29.7935 2.02246C30.4254 1.79468 30.0133 1.01099 27.9708 1.02026C25.9283 1.0293 24.0599 1.71265 21.6786 2.62378C21.3306 2.7605 20.9641 2.8606 20.5886 2.94263C18.4271 2.53271 16.1831 2.44141 13.8384 2.70581C9.42371 3.19775 5.89758 5.28418 3.30554 8.84668C0.191406 13.1289 -0.54126 17.9941 0.356323 23.0691C1.29968 28.4172 4.02905 32.8452 8.22388 36.3076C12.5745 39.8972 17.5845 41.6558 23.2997 41.3186C26.771 41.1182 30.6361 40.6536 34.9958 36.9636C36.0948 37.5103 37.2489 37.7288 39.1632 37.8928C40.6378 38.0295 42.0575 37.8201 43.1565 37.5923C44.8784 37.2278 44.7594 35.6333 44.1366 35.3418C39.09 32.9912 40.1981 33.9478 39.1907 33.1733C41.7552 30.1394 45.6204 26.9868 47.1316 16.7732C47.2506 15.9624 47.1499 15.4521 47.1316 14.7961C47.1224 14.3953 47.214 14.2405 47.672 14.1948C48.9359 14.0491 50.1632 13.7029 51.2898 13.0833C54.5596 11.2976 55.8784 8.36377 56.1898 4.84692C56.2357 4.30933 56.1807 3.75342 55.6128 3.47119ZM27.119 35.123C22.2281 31.2783 19.856 30.0117 18.8759 30.0664C17.96 30.1211 18.1249 31.1689 18.3263 31.8523C18.537 32.5264 18.8118 32.9912 19.1964 33.5833C19.462 33.9751 19.6453 34.5581 18.9309 34.9956C17.3555 35.9705 14.6169 34.6675 14.4886 34.6038C11.3014 32.7268 8.63611 30.2485 6.75842 26.8594C4.94495 23.5974 3.89172 20.0989 3.71765 16.3633C3.67188 15.4614 3.9375 15.1423 4.83508 14.9785C6.0166 14.7598 7.23474 14.7141 8.41626 14.8872C13.408 15.6162 17.6577 17.8484 21.2206 21.3835C23.2539 23.397 24.7926 25.8025 26.3772 28.1531C28.0624 30.6494 29.8759 33.0276 32.184 34.9773C32.9991 35.6606 33.6494 36.1799 34.2722 36.5627C32.3947 36.7722 29.2622 36.8179 27.119 35.123ZM29.4637 20.0442C29.4637 19.6433 29.7843 19.3245 30.1874 19.3245C30.2789 19.3245 30.3613 19.3425 30.4346 19.3699C30.5354 19.4065 30.627 19.4612 30.7002 19.543C30.8285 19.6707 30.9017 19.8528 30.9017 20.0442C30.9017 20.4451 30.5812 20.7639 30.1782 20.7639C29.7751 20.7639 29.4637 20.4451 29.4637 20.0442ZM36.7452 23.7798C36.2781 23.9712 35.811 24.135 35.3622 24.1533C34.6661 24.1897 33.9059 23.9072 33.4938 23.561C32.8527 23.0234 32.3947 22.7229 32.2023 21.7844C32.1199 21.3835 32.1656 20.7639 32.239 20.4087C32.4038 19.6433 32.2206 19.1514 31.6803 18.7048C31.2406 18.3403 30.6819 18.2402 30.0682 18.2402C29.8392 18.2402 29.6287 18.1399 29.4729 18.0579C29.2164 17.9304 29.0059 17.6116 29.2073 17.2197C29.2714 17.0923 29.5829 16.7825 29.6561 16.7278C30.4896 16.2539 31.4513 16.4089 32.3397 16.7642C33.1641 17.1013 33.7869 17.7209 34.6844 18.5955C35.6003 19.6523 35.7651 19.9441 36.2872 20.7366C36.6995 21.3562 37.075 21.9939 37.3314 22.7229C37.4871 23.1785 37.2856 23.552 36.7452 23.7798Z" fillRule="nonzero" fill="#4D6BFE"/>
                   </svg>
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white">Jak mogę ci pomóc?</h1>
             </div>
           </div>
        ) : (
           // Message List
           <div className="px-4 py-8">
             <div className="max-w-3xl mx-auto space-y-8">
               {session?.messages.map((msg, index) => {
                  return (
                    <div key={msg.id} className="w-full">
                      {msg.role === Role.USER ? (
                         <UserMessageBubble content={msg.content} index={index} />
                      ) : (
                         <AssistantMessageBubble 
                           content={msg.content} 
                           reasoning={msg.reasoning}
                           isStreaming={isProcessing && index === session.messages.length - 1} 
                         />
                      )}
                    </div>
                  );
               })}
               <div ref={messagesEndRef} />
             </div>
           </div>
        )}
      </div>

      {/* FOOTER / INPUT SECTION - Unified */}
      <div className="w-full max-w-3xl mx-auto px-4 pb-0 md:pb-0 pt-4">
        <PromptInput
          value={input}
          onValueChange={setInput}
          isLoading={isProcessing}
          onSubmit={handleSubmit}
          onStop={onStop}
        >
          <PromptInputTextarea placeholder="Wpisz wiadomość" />
          <PromptInputActions>
            <div className="flex items-center gap-2">
               {selectedModel === Model.DEEPSEEK_V3_1 && (
                 <button type="button" onClick={() => onThinkingChange(!isThinking)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors group ${isThinking ? 'bg-blue-100 border-blue-300 text-blue-700 dark:bg-[#27354d] dark:border-[#4D88FF]' : 'bg-gray-50 border-gray-200 text-blue-600 hover:bg-gray-100 dark:bg-[#1b263b] dark:border-[#27354d] dark:text-[#4D88FF] dark:hover:bg-[#253247]'}`}>
                    <Atom size={18} strokeWidth={2} className={`${isThinking ? 'text-blue-700 dark:text-[#4D88FF]' : 'text-blue-600 dark:text-[#4D88FF]'}`} />
                    <span className="text-sm font-medium">Myślenie</span>
                 </button>
               )}
               <button type="button" onClick={() => onSearchingChange(!isSearching)} className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-colors group ${isSearching ? 'bg-blue-100 border-blue-300 text-blue-700 dark:bg-[#27354d] dark:border-[#4D88FF]' : 'bg-gray-50 border-gray-200 text-blue-600 hover:bg-gray-100 dark:bg-[#1b263b] dark:border-[#27354d] dark:text-[#4D88FF] dark:hover:bg-[#253247]'}`}>
                  <Globe size={18} strokeWidth={2} className={`${isSearching ? 'text-blue-700 dark:text-[#4D88FF]' : 'text-blue-600 dark:text-[#4D88FF]'}`} />
                  <span className="text-sm font-medium">Szukaj</span>
               </button>
            </div>
            
            <div className="flex items-center gap-3">
               <button type="button" className="flex items-center justify-center w-9 h-9 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 dark:border-[#444] dark:text-white dark:hover:bg-[#3a3a3c] transition-colors">
                 <Plus size={20} />
               </button>
               <PromptSubmitButton />
            </div>
          </PromptInputActions>
        </PromptInput>
        <p className="text-center text-[10px] text-gray-400 dark:text-[#8A8A8D] mt-2 mb-2">Wygenerowane przez AI, tylko do celów informacyjnych</p>
      </div>

    </div>
  );
};

export default ChatArea;
