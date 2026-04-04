export default function ChatMessage({ role, text, prompts = [], hintsVisible, onUsePrompt }) {
  const label = role === 'ai'
    ? 'Marcus Chen · VP of Sales'
    : 'You · Instructional Designer';

  return (
    <div className={`msg ${role}`}>
      <div className="msg-label">{label}</div>
      <div className="msg-bubble">{text}</div>

      {role === 'ai' && prompts.length > 0 && (
        <div className={`prompts${hintsVisible ? ' visible' : ''}`}>
          {prompts.map((p, i) => (
            <button
              key={i}
              className="prompt-chip"
              onClick={() => onUsePrompt(p)}
            >
              {p}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
