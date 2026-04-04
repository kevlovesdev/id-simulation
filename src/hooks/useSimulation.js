import { useState, useCallback, useRef } from 'react';
import { sendChat } from '../api/chat';
import {
  OPENING_MESSAGE,
  OPENING_PROMPTS,
  INITIAL_SCORES,
  INITIAL_FEEDBACK,
  MAX_SCORES,
} from '../constants/simulation';

function buildOpeningMessage() {
  return { role: 'ai', text: OPENING_MESSAGE, prompts: OPENING_PROMPTS };
}

export function useSimulation() {
  // Display messages: { role: 'ai'|'user', text, prompts? }
  const [displayMessages, setDisplayMessages] = useState([buildOpeningMessage()]);
  // API messages: { role: 'user'|'assistant', content }
  const apiMessagesRef = useRef([]);

  const [scores, setScores] = useState({ ...INITIAL_SCORES });
  const [stage, setStage] = useState(1);
  const [isWaiting, setIsWaiting] = useState(false);
  const [panelVisible, setPanelVisible] = useState(true);
  const [hintsVisible, setHintsVisible] = useState(false);
  const [feedbackText, setFeedbackText] = useState(INITIAL_FEEDBACK);

  const togglePanel = useCallback(() => setPanelVisible(v => !v), []);
  const toggleHints = useCallback(() => setHintsVisible(v => !v), []);

  const applyScores = useCallback((incoming) => {
    setScores(prev => {
      const next = { ...prev };
      for (const key of Object.keys(next)) {
        if (incoming[key] !== undefined && incoming[key] > next[key]) {
          next[key] = Math.min(incoming[key], MAX_SCORES[key]);
        }
      }
      return next;
    });
  }, []);

  const applyStage = useCallback((newStage) => {
    setStage(prev => (newStage > prev && newStage >= 1 && newStage <= 5 ? newStage : prev));
  }, []);

  const send = useCallback(async (text) => {
    if (isWaiting || !text.trim()) return;

    setIsWaiting(true);

    // Add user message to display
    setDisplayMessages(prev => [...prev, { role: 'user', text }]);

    // Build API message list
    const userMsg = { role: 'user', content: text };
    apiMessagesRef.current = [...apiMessagesRef.current, userMsg];

    try {
      const parsed = await sendChat(apiMessagesRef.current);

      // Add AI response to display
      setDisplayMessages(prev => [
        ...prev,
        { role: 'ai', text: parsed.message, prompts: parsed.prompts || [] },
      ]);

      // Store raw assistant content for API context
      apiMessagesRef.current = [
        ...apiMessagesRef.current,
        { role: 'assistant', content: JSON.stringify(parsed) },
      ];

      if (parsed.stage)   applyStage(parsed.stage);
      if (parsed.scores)  applyScores(parsed.scores);
      if (parsed.feedback) setFeedbackText(parsed.feedback);

    } catch {
      setDisplayMessages(prev => [
        ...prev,
        { role: 'ai', text: "Can't reach the server. Make sure the backend is running.", prompts: [] },
      ]);
    }

    setIsWaiting(false);
  }, [isWaiting, applyScores, applyStage]);

  const reset = useCallback(() => {
    apiMessagesRef.current = [];
    setDisplayMessages([buildOpeningMessage()]);
    setScores({ ...INITIAL_SCORES });
    setStage(1);
    setIsWaiting(false);
    setHintsVisible(false);
    setFeedbackText(INITIAL_FEEDBACK);
  }, []);

  const totalScore = Math.min(
    Object.values(scores).reduce((a, b) => a + b, 0),
    100
  );

  return {
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
  };
}
