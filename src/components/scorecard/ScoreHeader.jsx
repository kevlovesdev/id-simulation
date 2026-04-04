export default function ScoreHeader({ totalScore }) {
  return (
    <div className="score-header">
      <div className="score-header-label">Action Mapping Scorecard</div>
      <div className="total-row">
        <span className="score-number">{totalScore}</span>
        <span className="score-denom">/100</span>
      </div>
      <div className="total-bar-outer">
        <div className="total-bar-fill" style={{ width: `${totalScore}%` }} />
      </div>
    </div>
  );
}
