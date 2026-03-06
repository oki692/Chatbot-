
import React, { useState, useRef, useEffect, useCallback, createContext, useContext, ReactNode } from "react";
import { cn } from "../utils/cn";

// Interface for PromptInput props
interface PromptInputProps {
  value: string;
  onValueChange: (value: string) => void;
  isLoading: boolean;
  onSubmit: () => void;
  onStop?: () => void; // Added onStop prop
  className?: string;
  children?: ReactNode;
}

interface PromptInputContextType {
  value: string;
  onValueChange: (value: string) => void;
  isLoading: boolean;
  onSubmit: () => void;
  onStop?: () => void; // Added onStop to context
  textareaRef: React.RefObject<HTMLTextAreaElement>;
}

const PromptInputContext = createContext<PromptInputContextType | undefined>(undefined);

function usePromptInput() {
  const context = useContext(PromptInputContext);
  if (!context) throw new Error("usePromptInput must be used within a PromptInput");
  return context;
}

export function PromptInput({
  value,
  onValueChange,
  isLoading,
  onSubmit,
  onStop,
  className,
  children,
}: PromptInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <PromptInputContext.Provider value={{ value, onValueChange, isLoading, onSubmit, onStop, textareaRef }}>
      <div
        className={cn(
          "relative bg-white dark:bg-[#2a2a2a] transition-all duration-200 ease-out",
          "rounded-[26px] border border-[#f2f2f2] dark:border-[#2a2a2a] shadow-[0_4px_12px_rgba(0,0,0,0.05)]",
          className,
        )}
        onFocusCapture={() => setIsFocused(true)}
        onBlurCapture={() => setIsFocused(false)}
      >
        {children}
      </div>
    </PromptInputContext.Provider>
  );
}

export function PromptInputTextarea({ placeholder, className }: { placeholder?: string; className?: string }) {
  const { value, onValueChange, isLoading, onSubmit, textareaRef } = usePromptInput();
  
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
    }
  }, [textareaRef]);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading) onSubmit();
    }
  };

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onValueChange(e.target.value)}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      disabled={isLoading} 
      className={cn(
        "w-full resize-none border-0 bg-transparent px-4 py-3 text-gray-900 dark:text-[#f5f5f4] placeholder-[#65686c] focus:outline-none text-[16px] leading-[22px] font-medium caret-[#4D88FF]",
        "min-h-[52px] max-h-[200px] focus:ring-0 focus:border-0",
        className,
      )}
      rows={1}
    />
  );
}

export function PromptInputActions({ className, children }: { className?: string; children?: ReactNode }) {
  return (
    <div className={cn("flex items-center justify-between px-3 pb-3 pt-1", className)}>
      {children}
    </div>
  );
}

const SendIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 5.25L12 18.75" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.75 12L12 5.25L5.25 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const StopIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M8.7587 3H15.2413C16.0463 2.99999 16.7106 2.99998 17.2518 3.0442C17.8139 3.09012 18.3306 3.18868 18.816 3.43598C19.5686 3.81947 20.1805 4.43139 20.564 5.18404C20.8113 5.66938 20.9099 6.18608 20.9558 6.74818C21 7.28937 21 7.95372 21 8.75868V15.2413C21 16.0463 21 16.7106 20.9558 17.2518C20.9099 17.8139 20.8113 18.3306 20.564 18.816C20.1805 19.5686 19.5686 20.1805 18.816 20.564C18.3306 20.8113 17.8139 20.9099 17.2518 20.9558C16.7106 21 16.0463 21 15.2413 21H8.75868C7.95372 21 7.28937 21 6.74818 20.9558C6.18608 20.9099 5.66938 20.8113 5.18404 20.564C4.43139 20.1805 3.81947 19.5686 3.43598 18.816C3.18868 18.3306 3.09012 17.8139 3.0442 17.2518C2.99998 16.7106 2.99999 16.0463 3 15.2413V8.75868C2.99999 7.95373 2.99998 7.28936 3.0442 6.74818C3.09012 6.18608 3.18868 5.66938 3.43598 5.18404C3.81947 4.43139 4.43139 3.81947 5.18404 3.43598C5.66938 3.18868 6.18608 3.09012 6.74818 3.0442C7.28936 2.99998 7.95375 2.99999 8.7587 3Z" fill="currentColor" />
  </svg>
);

export function PromptSubmitButton({ className }: { className?: string }) {
  const { value, isLoading, onSubmit, onStop } = usePromptInput();
  const hasValue = value.trim().length > 0;

  // Wspólne style dla przycisku (niebieskie koło)
  const buttonClass = cn(
    "flex h-9 w-9 items-center justify-center rounded-full transition-colors",
    "bg-[#4D88FF] text-white hover:bg-[#3b76e6]",
    "disabled:bg-[#4D88FF]/50 disabled:cursor-not-allowed",
    className
  );

  if (isLoading) {
    return (
      <button
        type="button"
        onClick={onStop}
        className={buttonClass}
      >
        <StopIcon className="h-4 w-4" /> {/* Rozmiar ikony dopasowany do wnętrza przycisku */}
        <span className="sr-only">Stop</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onSubmit}
      disabled={!hasValue}
      className={buttonClass}
    >
      <SendIcon className="h-5 w-5" />
      <span className="sr-only">Send</span>
    </button>
  );
}
