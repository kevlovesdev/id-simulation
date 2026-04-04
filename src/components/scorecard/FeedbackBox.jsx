export default function FeedbackBox({ text }) {
  return (
    <div className="feedback-section">
      <div className="section-label" style={{ marginBottom: '8px' }}>Coaching Note</div>
      <div className="feedback-box">{text}</div>
    </div>
  );
}
