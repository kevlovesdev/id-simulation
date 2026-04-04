import { STAGE_NAMES } from '../../constants/simulation';

export default function StageIndicator({ currentStage }) {
  return (
    <div className="stage-section">
      <div className="section-label">Conversation Stage</div>
      <div className="stages">
        {STAGE_NAMES.map((name, i) => {
          const num = i + 1;
          const isDone = num < currentStage || (num === 5 && currentStage === 5);
          const isActive = num === currentStage && num !== 5;
          const isCurrent = num === currentStage;

          return (
            <div key={num} className={`stage-item${isCurrent ? ' current' : ''}`}>
              <div className={`stage-dot${isDone ? ' done' : isActive ? ' active' : ''}`}>
                {isDone ? '✓' : num}
              </div>
              <div className="stage-name">{name}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
