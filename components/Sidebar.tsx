
import React from 'react';
import { MessageSquare, MoreHorizontal, LayoutGrid } from 'lucide-react';
import { ChatSession } from '../types';

interface SidebarProps {
  sessions: ChatSession[];
  activeSessionId: string | null;
  onNewChat: () => void;
  onSelectChat: (id: string) => void;
  isCollapsed: boolean;
  toggleSidebar: () => void;
}

const SidebarToggleIcon = ({ size = 24, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M8 5.4541C8 5.42548 8.00155 5.39716 8.00391 5.36914C7.55522 5.37527 7.18036 5.38745 6.85449 5.41406C6.32513 5.45732 5.99243 5.53344 5.74121 5.6416L5.6377 5.69043C5.14381 5.94215 4.73058 6.32494 4.44238 6.79492L4.32715 7.00098C4.19296 7.26434 4.10023 7.61261 4.05078 8.21777C4.00041 8.83458 4 9.62723 4 10.7637V13.2363C4 14.3728 4.00039 15.1654 4.05078 15.7822C4.10023 16.3871 4.19298 16.7347 4.32715 16.998L4.44238 17.2041C4.73056 17.6741 5.14377 18.0568 5.6377 18.3086L5.74121 18.3574C5.99244 18.4656 6.32506 18.5417 6.85449 18.585C7.17941 18.6115 7.55304 18.6228 8 18.6289V5.4541ZM22 13.2363C22 14.3396 22.001 15.2273 21.9424 15.9443C21.8903 16.5821 21.7876 17.1524 21.5605 17.6816L21.4551 17.9063C20.9758 18.8468 20.211 19.6115 19.2705 20.0908C18.6783 20.3925 18.0373 20.5186 17.3086 20.5781C16.5914 20.6367 15.7032 20.6357 14.5996 20.6357H9.40039C9.27572 20.6357 9.15341 20.6339 9.03418 20.6338C9.02282 20.6342 9.01146 20.6357 9 20.6357C8.98557 20.6357 8.97131 20.6334 8.95703 20.6328C8.05556 20.632 7.31 20.6287 6.69141 20.5781C6.05356 20.526 5.48347 20.4235 4.9541 20.1963L4.73047 20.0908C3.84834 19.6413 3.12017 18.9412 2.6377 18.0801L2.54492 17.9063C2.24315 17.3139 2.11717 16.6732 2.05762 15.9443C1.99905 15.2273 2 14.3396 2 13.2363V10.7637C2 9.66008 1.99903 8.77186 2.05762 8.05469C2.11716 7.32598 2.24327 6.68595 2.54492 6.09375L2.6377 5.91895C3.12017 5.05789 3.8484 4.35763 4.73047 3.9082L4.9541 3.80274C5.48344 3.57561 6.05359 3.47301 6.69141 3.4209C7.40857 3.36231 8.29681 3.36328 9.40039 3.36328H14.5996C15.7032 3.36328 16.5914 3.36231 17.3086 3.4209C18.0373 3.48044 18.6773 3.60656 19.2695 3.9082L19.4443 4.00195C20.3052 4.48442 21.0057 5.21184 21.4551 6.09375L21.5605 6.31738C21.7877 6.84672 21.8903 7.41688 21.9424 8.05469C22.001 8.77186 22 9.66008 22 10.7637V13.2363ZM10 18.6357H14.5996C15.7361 18.6357 16.5287 18.6353 17.1455 18.585C17.7507 18.5355 18.0989 18.4428 18.3623 18.3086L18.5684 18.1934C19.0383 17.9051 19.4211 17.492 19.6729 16.998L19.7217 16.8945C19.8298 16.6434 19.906 16.3112 19.9492 15.7822C19.9996 15.1654 20 14.3728 20 13.2363V10.7637C20 9.62722 19.9996 8.83458 19.9492 8.21777C19.906 7.68841 19.8299 7.35572 19.7217 7.10449L19.6729 7.00098C19.4211 6.50707 19.0383 6.09385 18.5684 5.80567L18.3623 5.69043C18.0989 5.55623 17.7507 5.46351 17.1455 5.41406C16.5287 5.36369 15.736 5.36328 14.5996 5.36328H9.99609C9.99879 5.39319 10 5.42349 10 5.4541V18.6357Z" />
  </svg>
)

const NewChatIcon = ({ size = 24, className }: { size?: number, className?: string }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} xmlns="http://www.w3.org/2000/svg">
    <path d="M12 4.5C7.5271 4.5 4 7.91095 4 12C4 13.6958 4.5996 15.263 5.62036 16.5254C5.80473 16.7534 5.87973 17.0509 5.82551 17.339C5.72928 17.8505 5.60336 18.3503 5.45668 18.8401C6.08722 18.743 6.69878 18.6098 7.2983 18.4395C7.54758 18.3687 7.81461 18.3975 8.04312 18.5197C9.20727 19.1423 10.5566 19.5 12 19.5C16.4729 19.5 20 16.0891 20 12C20 7.91095 16.4729 4.5 12 4.5ZM2 12C2 6.70021 6.53177 2.5 12 2.5C17.4682 2.5 22 6.70021 22 12C22 17.2998 17.4682 21.5 12 21.5C10.3694 21.5 8.82593 21.1286 7.46141 20.4675C6.36717 20.7507 5.2423 20.9253 4.06155 20.9981C3.72191 21.019 3.39493 20.8658 3.19366 20.5915C2.9924 20.3171 2.94448 19.9592 3.06647 19.6415C3.35663 18.8859 3.6004 18.1448 3.77047 17.399C2.65693 15.8695 2 14.0088 2 12ZM12 8C12.5523 8 13 8.44772 13 9V11H15C15.5523 11 16 11.4477 16 12C16 12.5523 15.5523 13 15 13H13V15C13 15.5523 12.5523 16 12 16C11.4477 16 11 15.5523 11 15V13H9C8.44772 13 8 12.5523 8 12C8 11.4477 8.44772 11 9 11H11V9C11 8.44772 11.4477 8 12 8Z" fill="currentColor" />
  </svg>
)

const Sidebar: React.FC<SidebarProps> = ({ 
  sessions, 
  activeSessionId, 
  onNewChat, 
  onSelectChat, 
  isCollapsed, 
  toggleSidebar 
}) => {
  // Common Content for Expanded Sidebar (Used in both Mobile Overlay and Desktop Expanded)
  const ExpandedContent = () => (
    <>
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
           <div className="text-[#4D88FF] font-bold text-xl flex items-center gap-2">
             <svg height="1em" style={{flex:"none", width: "auto"}} viewBox="0 0 57 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M55.6128 3.47119C55.0175 3.17944 54.7611 3.73535 54.413 4.01782C54.2939 4.10889 54.1932 4.22729 54.0924 4.33667C53.2223 5.26587 52.2057 5.87646 50.8776 5.80347C48.9359 5.69409 47.2781 6.30469 45.8126 7.78979C45.5012 5.9585 44.4663 4.86499 42.8909 4.16357C42.0667 3.79907 41.2332 3.43457 40.6561 2.64185C40.2532 2.07715 40.1432 1.44849 39.9418 0.828857C39.8135 0.455322 39.6853 0.0725098 39.2548 0.00878906C38.7877 -0.0639648 38.6045 0.327637 38.4213 0.655762C37.6886 1.99512 37.4047 3.47119 37.4321 4.96533C37.4962 8.32739 38.9159 11.0059 41.7369 12.9102C42.0575 13.1289 42.1399 13.3474 42.0392 13.6665C41.8468 14.3225 41.6178 14.9602 41.4164 15.6162C41.2881 16.0354 41.0957 16.1265 40.647 15.9441C39.0991 15.2974 37.7618 14.3406 36.5803 13.1836C34.5745 11.2429 32.761 9.10181 30.4988 7.42529C29.9675 7.03345 29.4363 6.66919 28.8867 6.32275C26.5786 4.08154 29.189 2.24097 29.7935 2.02246C30.4254 1.79468 30.0133 1.01099 27.9708 1.02026C25.9283 1.0293 24.0599 1.71265 21.6786 2.62378C21.3306 2.7605 20.9641 2.8606 20.5886 2.94263C18.4271 2.53271 16.1831 2.44141 13.8384 2.70581C9.42371 3.19775 5.89758 5.28418 3.30554 8.84668C0.191406 13.1289 -0.54126 17.9941 0.356323 23.0691C1.29968 28.4172 4.02905 32.8452 8.22388 36.3076C12.5745 39.8972 17.5845 41.6558 23.2997 41.3186C26.771 41.1182 30.6361 40.6536 34.9958 36.9636C36.0948 37.5103 37.2489 37.7288 39.1632 37.8928C40.6378 38.0295 42.0575 37.8201 43.1565 37.5923C44.8784 37.2278 44.7594 35.6333 44.1366 35.3418C39.09 32.9912 40.1981 33.9478 39.1907 33.1733C41.7552 30.1394 45.6204 26.9868 47.1316 16.7732C47.2506 15.9624 47.1499 15.4521 47.1316 14.7961C47.1224 14.3953 47.214 14.2405 47.672 14.1948C48.9359 14.0491 50.1632 13.7029 51.2898 13.0833C54.5596 11.2976 55.8784 8.36377 56.1898 4.84692C56.2357 4.30933 56.1807 3.75342 55.6128 3.47119ZM27.119 35.123C22.2281 31.2783 19.856 30.0117 18.8759 30.0664C17.96 30.1211 18.1249 31.1689 18.3263 31.8523C18.537 32.5264 18.8118 32.9912 19.1964 33.5833C19.462 33.9751 19.6453 34.5581 18.9309 34.9956C17.3555 35.9705 14.6169 34.6675 14.4886 34.6038C11.3014 32.7268 8.63611 30.2485 6.75842 26.8594C4.94495 23.5974 3.89172 20.0989 3.71765 16.3633C3.67188 15.4614 3.9375 15.1423 4.83508 14.9785C6.0166 14.7598 7.23474 14.7141 8.41626 14.8872C13.408 15.6162 17.6577 17.8484 21.2206 21.3835C23.2539 23.397 24.7926 25.8025 26.3772 28.1531C28.0624 30.6494 29.8759 33.0276 32.184 34.9773C32.9991 35.6606 33.6494 36.1799 34.2722 36.5627C32.3947 36.7722 29.2622 36.8179 27.119 35.123ZM29.4637 20.0442C29.4637 19.6433 29.7843 19.3245 30.1874 19.3245C30.2789 19.3245 30.3613 19.3425 30.4346 19.3699C30.5354 19.4065 30.627 19.4612 30.7002 19.543C30.8285 19.6707 30.9017 19.8528 30.9017 20.0442C30.9017 20.4451 30.5812 20.7639 30.1782 20.7639C29.7751 20.7639 29.4637 20.4451 29.4637 20.0442ZM36.7452 23.7798C36.2781 23.9712 35.811 24.135 35.3622 24.1533C34.6661 24.1897 33.9059 23.9072 33.4938 23.561C32.8527 23.0234 32.3947 22.7229 32.2023 21.7844C32.1199 21.3835 32.1656 20.7639 32.239 20.4087C32.4038 19.6433 32.2206 19.1514 31.6803 18.7048C31.2406 18.3403 30.6819 18.2402 30.0682 18.2402C29.8392 18.2402 29.6287 18.1399 29.4729 18.0579C29.2164 17.9304 29.0059 17.6116 29.2073 17.2197C29.2714 17.0923 29.5829 16.7825 29.6561 16.7278C30.4896 16.2539 31.4513 16.4089 32.3397 16.7642C33.1641 17.1013 33.7869 17.7209 34.6844 18.5955C35.6003 19.6523 35.7651 19.9441 36.2872 20.7366C36.6995 21.3562 37.075 21.9939 37.3314 22.7229C37.4871 23.1785 37.2856 23.552 36.7452 23.7798Z" fillRule="nonzero" fill="#4D6BFE"/>
             </svg>
           </div>
        </div>
        <button 
          onClick={toggleSidebar} 
          className="p-2 hover:bg-gray-200 dark:hover:bg-[#2c2c2e] rounded-lg text-gray-500 dark:text-[#8A8A8D] focus:outline-none focus:ring-0 focus:border-none active:outline-none"
          style={{ WebkitTapHighlightColor: 'transparent' }}
        >
          <SidebarToggleIcon size={20} />
        </button>
      </div>

      <button 
        onClick={() => { onNewChat(); if (window.innerWidth < 768) toggleSidebar(); }}
        className="w-full bg-white border-0 text-gray-900 hover:bg-gray-100 dark:bg-[#2c2c2e] dark:border-0 dark:text-white dark:hover:bg-[#3a3a3c] rounded-[1rem] py-3 px-4 flex items-center gap-2 mb-6 transition-colors"
      >
        <NewChatIcon size={20} />
        <span className="text-sm font-medium">Nowa rozmowa</span>
      </button>

      <div className="flex-1 overflow-y-auto space-y-6">
        <section>
          <h3 className="text-[11px] font-bold text-gray-500 dark:text-[#8A8A8D] uppercase px-3 mb-2">Dzisiaj</h3>
          <div className="space-y-1">
            {sessions.filter(s => Date.now() - s.updatedAt < 86400000).map(session => (
              <button
                key={session.id}
                onClick={() => { onSelectChat(session.id); if (window.innerWidth < 768) toggleSidebar(); }}
                className={`w-full group px-3 py-2.5 rounded-[1rem] text-left text-sm flex items-center justify-between transition-colors ${
                  activeSessionId === session.id 
                    ? 'bg-[#f2f2f2] text-black dark:bg-[#2c2c2e] dark:text-white' 
                    : 'text-gray-700 hover:bg-gray-200 dark:text-[#8A8A8D] dark:hover:bg-[#212121]'
                }`}
              >
                <span className="truncate flex-1">{session.title}</span>
                <MoreHorizontal size={14} className="opacity-0 group-hover:opacity-100 text-gray-500 dark:text-[#8A8A8D]" />
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="text-[11px] font-bold text-gray-500 dark:text-[#8A8A8D] uppercase px-3 mb-2">7 dni</h3>
          <div className="space-y-1">
             {sessions.filter(s => {
               const diff = Date.now() - s.updatedAt;
               return diff >= 86400000 && diff < 86400000 * 7;
             }).map(session => (
              <button
                key={session.id}
                onClick={() => { onSelectChat(session.id); if (window.innerWidth < 768) toggleSidebar(); }}
                className={`w-full group px-3 py-2.5 rounded-[1rem] text-left text-sm flex items-center justify-between transition-colors ${
                  activeSessionId === session.id 
                    ? 'bg-[#f2f2f2] text-black dark:bg-[#2c2c2e] dark:text-white' 
                    : 'text-gray-700 hover:bg-gray-200 dark:text-[#8A8A8D] dark:hover:bg-[#212121]'
                }`}
              >
                <span className="truncate flex-1">{session.title}</span>
                <MoreHorizontal size={14} className="opacity-0 group-hover:opacity-100 text-gray-500 dark:text-[#8A8A8D]" />
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-[#2c2c2e]">
        <div className="flex items-center justify-between px-3 py-2 hover:bg-gray-200 dark:hover:bg-[#212121] rounded-[1rem] cursor-pointer">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#E91E63] flex items-center justify-center text-xs font-bold text-white">
              O
            </div>
            <span className="text-sm font-medium text-gray-900 dark:text-white">Oki</span>
          </div>
          <MoreHorizontal size={16} className="text-gray-500 dark:text-[#8A8A8D]" />
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* MOBILE OVERLAY IMPLEMENTATION */}
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 z-40 bg-black/60 md:hidden transition-opacity duration-300 ${
          !isCollapsed ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleSidebar}
      />
      
      {/* Mobile Drawer */}
      <div className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-[#f9fafb] dark:bg-[#1b1b1c] border-r border-gray-200 dark:border-[#2c2c2e] flex flex-col p-3 transition-transform duration-300 md:hidden ${
        isCollapsed ? '-translate-x-full' : 'translate-x-0'
      }`}>
        <ExpandedContent />
      </div>

      {/* DESKTOP IMPLEMENTATION (Hidden on Mobile) */}
      <div 
        className={`hidden md:flex flex-col h-screen bg-[#f9fafb] dark:bg-[#1b1b1c] border-r border-gray-200 dark:border-[#2c2c2e] transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-16' : 'w-[260px]'
        }`}
      >
        <div className={`flex flex-col h-full w-[260px] p-3 transition-opacity duration-300 ${isCollapsed ? 'opacity-0 pointer-events-none absolute' : 'opacity-100'}`}>
          <ExpandedContent />
        </div>
        
        <div className={`flex flex-col items-center py-3 space-y-4 w-16 h-full transition-opacity duration-300 ${isCollapsed ? 'opacity-100' : 'opacity-0 pointer-events-none absolute'}`}>
          <button 
            onClick={toggleSidebar} 
            className="p-2 hover:bg-gray-200 dark:hover:bg-[#2c2c2e] rounded-lg text-gray-500 dark:text-[#8A8A8D] focus:outline-none focus:ring-0 focus:border-none active:outline-none"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <SidebarToggleIcon size={20} />
          </button>
          <button 
            onClick={onNewChat} 
            className="p-2 hover:bg-gray-200 dark:hover:bg-[#2c2c2e] rounded-lg text-gray-500 dark:text-[#8A8A8D] focus:outline-none focus:ring-0 focus:border-none active:outline-none"
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <NewChatIcon size={20} />
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
