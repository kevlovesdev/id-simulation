import { useRef, useCallback } from 'react';

export default function ChatInput({ onSend, disabled }) {
  const textareaRef = useRef(null);

  const autoResize = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = Math.min(el.scrollHeight, 120) + 'px';
  }, []);

  const handleSend = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    const text = el.value.trim();
    if (!text || disabled) return;
    onSend(text);
    el.value = '';
    el.style.height = '46px';
  }, [onSend, disabled]);

  const handleKey = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  return (
    <div className="input-area">
      <div className="input-hint">Press Enter to send · Shift+Enter for a new line</div>
      <div className="input-row">
        <textarea
          ref={textareaRef}
          className="chat-textarea"
          placeholder="Ask Marcus a question or respond to him…"
          onKeyDown={handleKey}
          onInput={autoResize}
        />
        <button
          className="send-btn"
          onClick={handleSend}
          disabled={disabled}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13"/>
            <polygon points="22 2 15 22 11 13 2 9 22 2"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
