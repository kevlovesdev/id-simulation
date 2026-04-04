import { MAX_SCORES } from '../../constants/simulation';

export default function CriteriaBar({ criterionKey, label, desc, value }) {
  const max = MAX_SCORES[criterionKey];
  const pct = (value / max) * 100;
  const isFull = pct >= 100;
  const hasEarned = value > 0;

  return (
    <div className="criterion">
      <div className="crit-header">
        <span className="crit-name">{label}</span>
        <span className={`crit-pts${hasEarned ? ' earned' : ''}`}>
          {value} / {max}
        </span>
      </div>
      <div className="crit-desc">{desc}</div>
      <div className="crit-bar-outer">
        <div
          className={`crit-bar-fill${isFull ? ' full' : ''}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
