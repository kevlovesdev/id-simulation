import { useEffect, useCallback } from 'react';
import { useSimulation } from '../hooks/useSimulation';
import ChatHeader from '../components/chat/ChatHeader';
import ChatMessages from '../components/chat/ChatMessages';
import ChatInput from '../components/chat/ChatInput';
import ScoreCard from '../components/scorecard/ScoreCard';
import '../styles/chat.css';
import '../styles/scorecard.css';

export default function SimulationPage() {
  const {
    displayMessages,
    scores,
    totalScore,
    stage,
    isWaiting,
    panelVisible,
    hintsVisible,
    feedbackText,
    send,
    reset,
    togglePanel,
    toggleHints,
    setPanelVisible,
  } = useSimulation();

  // On mount: hide panel by default on mobile
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 700px)').matches;
    if (isMobile) setPanelVisible(false);
  }, [setPanelVisible]);

  const handleUsePrompt = useCallback((text) => {
    if (!isWaiting) send(text);
  }, [isWaiting, send]);

  return (
    <div className="simulation-layout">
      <div className="chat-panel">
        <ChatHeader
          hintsActive={hintsVisible}
          panelActive={panelVisible}
          onToggleHints={toggleHints}
          onReset={reset}
          onTogglePanel={togglePanel}
        />
        <ChatMessages
          messages={displayMessages}
          hintsVisible={hintsVisible}
          isWaiting={isWaiting}
          onUsePrompt={handleUsePrompt}
        />
        <ChatInput onSend={send} disabled={isWaiting} />
      </div>

      <ScoreCard
        visible={panelVisible}
        totalScore={totalScore}
        scores={scores}
        stage={stage}
        feedbackText={feedbackText}
        onHide={() => setPanelVisible(false)}
      />
    </div>
  );
}
