import { API_URL, SYSTEM_PROMPT, OPENING_MESSAGE, OPENING_PROMPTS } from '../constants/simulation';

/**
 * Sends the conversation to the backend and returns the parsed AI response.
 * @param {Array<{role: string, content: string}>} messages - The conversation history (user + assistant turns only)
 * @returns {Promise<{message: string, scores: object, stage: number, feedback: string, prompts: string[]}>}
 */
export async function sendChat(messages) {
  const payload = [
    { role: 'system', content: SYSTEM_PROMPT },
    {
      role: 'assistant',
      content: JSON.stringify({
        message: OPENING_MESSAGE,
        scores: { measurableGoal: 0, keyBehaviors: 0, rootCauses: 0, questionedTraining: 0, targetAudience: 0, behaviorFocus: 0 },
        stage: 1,
        feedback: '',
        prompts: OPENING_PROMPTS,
      }),
    },
    ...messages,
  ];

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: payload }),
  });

  if (!res.ok) {
    throw new Error(`Server error: ${res.status}`);
  }

  const data = await res.json();
  const raw = data.choices[0].message.content;

  try {
    return JSON.parse(raw.replace(/```json|```/g, '').trim());
  } catch {
    return { message: raw, scores: null, stage: null, feedback: null, prompts: [] };
  }
}
