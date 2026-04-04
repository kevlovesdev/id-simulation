export default function TypingIndicator({ visible }) {
  return (
    <div className={`typing-indicator${visible ? ' active' : ''}`}>
      <div className="tdot" />
      <div className="tdot" />
      <div className="tdot" />
    </div>
  );
}
