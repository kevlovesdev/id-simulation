import { useRef, useEffect } from 'react';
import ScoreHeader from './ScoreHeader';
import StageIndicator from './StageIndicator';
import CriteriaBar from './CriteriaBar';
import FeedbackBox from './FeedbackBox';
import { CRITERIA_META } from '../../constants/simulation';

export default function ScoreCard({ visible, totalScore, scores, stage, feedbackText, onHide }) {
  const panelRef = useRef(null);

  // Swipe down to dismiss on mobile
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    let touchStartY = 0;
    const onTouchStart = (e) => { touchStartY = e.touches[0].clientY; };
    const onTouchEnd = (e) => {
      if (e.changedTouches[0].clientY - touchStartY > 60) onHide();
    };

    panel.addEventListener('touchstart', onTouchStart, { passive: true });
    panel.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => {
      panel.removeEventListener('touchstart', onTouchStart);
      panel.removeEventListener('touchend', onTouchEnd);
    };
  }, [onHide]);

  return (
    <div ref={panelRef} className={`score-panel${visible ? '' : ' hidden'}`}>
      <div className="panel-drag-handle" />
      <ScoreHeader totalScore={totalScore} />
      <StageIndicator currentStage={stage} />
      <div className="criteria-section">
        <div className="section-label">Scoring Criteria</div>
        {CRITERIA_META.map(({ key, label, desc }) => (
          <CriteriaBar
            key={key}
            criterionKey={key}
            label={label}
            desc={desc}
            value={scores[key]}
          />
        ))}
      </div>
      <FeedbackBox text={feedbackText} />
    </div>
  );
}
