import { Link } from 'react-router-dom';

export default function ChatHeader({ hintsActive, panelActive, onToggleHints, onReset, onTogglePanel }) {
  return (
    <div className="chat-header">
      <div className="chat-header-bar">
        <span className="scenario-label">Instructional Design Simulation</span>
        <div className="header-actions">

          {/* Hints */}
          <button
            className={`hdr-btn${hintsActive ? ' active' : ''}`}
            title="Hints"
            onClick={onToggleHints}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="16" x2="12" y2="12"/>
              <line x1="12" y1="8" x2="12.01" y2="8"/>
            </svg>
          </button>

          {/* Reset */}
          <button className="hdr-btn" title="Reset" onClick={onReset}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 1 0 .49-3.66"/>
            </svg>
          </button>

          {/* Guide link */}
          <Link className="hdr-btn" title="Guide" to="/guide" target="_blank" rel="noopener noreferrer">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </Link>

          {/* Scorecard toggle */}
          <button
            className={`hdr-btn${panelActive ? ' active' : ''}`}
            title="Scorecard"
            onClick={onTogglePanel}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2"/>
              <line x1="15" y1="3" x2="15" y2="21"/>
            </svg>
          </button>

        </div>
      </div>

      <div className="chat-header-body">
        <h1>Stakeholder Needs Analysis</h1>
        <p>Apply Cathy Moore's Action Mapping. Uncover the real performance problem before proposing any solution.</p>
        <div className="stakeholder-badge">
          <span className="live-dot" />
          Marcus Chen · VP of Sales · Meridian Solutions
        </div>
      </div>
    </div>
  );
}
