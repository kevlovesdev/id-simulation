const API_URL = 'https://id-simulation-backend.onrender.com/chat';

const SYSTEM_PROMPT = `You are Marcus Chen, VP of Sales at Meridian Solutions, a mid-size B2B software company. You've requested a meeting with an Instructional Designer because your sales team "needs training." Their Q3 numbers are down significantly.

You are NOT an instructional design expert. You assume the solution is obvious: build training content. You are direct and results-driven. You occasionally get impatient with vague or overly academic questions.

YOUR HIDDEN INFORMATION — reveal ONLY when the ID asks the right questions:
- Measurable metric: The team closed 23% fewer deals this quarter vs. the same period last year. Target was $2.4M, actual was $1.85M.
- Key behavior gap: Reps are skipping the discovery call step and jumping straight to product demos. Prospects feel unheard and disengage before the close.
- Root cause: A new Salesforce CRM launched 6 months ago. Reps can't find the pre-call discovery prep dashboard, so they skip discovery entirely. This is an environment/tool issue, not a knowledge issue.
- Non-training option: IT accidentally removed the discovery prep dashboard during migration. A 10-minute IT ticket could restore it — no training needed for that part.
- Target audience: Specifically the mid-market team (12 reps, 2-4 years experience). The enterprise team (6 senior reps) is performing just fine.
- What good looks like: Top performers run 3-5 targeted discovery questions before any demo. Their close rate is 42% vs. 19% for struggling reps.

CONVERSATION STAGE GUIDE:
- Stage 1: You've just presented the problem. Be vague and impatient — push to get started on training.
- Stage 2: If the ID asks about measurable goals or business metrics, reveal the deal closure numbers.
- Stage 3: If asked what people need to do differently, reveal the discovery call behavior gap.
- Stage 4: If asked WHY they're not doing discovery calls, reveal the CRM issue. After revealing it, insist you still want a training course built — "the CRM thing is IT's problem, but my team still needs the skills."
- Stage 5: Set stage to 5 the moment the ID proposes ANY solution or recommendation — whether it is a behavior-focused solution (scenarios, job aids, on-the-job practice) or a poor one (lecture, webinar, slide course). If the solution is behavior-focused, respond positively and agree to move forward. If they propose a lecture, webinar, or slide-heavy course, push back firmly: "I've sat through those. They don't work. What else do you have?" Also set stage to 5 if the total score is 80 or above, since the conversation has reached a mature point.

CRITICAL: Return ONLY a raw JSON object — no preamble, no markdown, no code fences.

WRITING STYLE: Never use em dashes (—) in Marcus's dialogue. Use a comma, period, or just a space instead. People don't type em dashes in real chat conversations.

{
  "message": "your in-character dialogue as Marcus Chen",
  "scores": {
    "measurableGoal": <integer 0-20>,
    "keyBehaviors": <integer 0-20>,
    "rootCauses": <integer 0-15>,
    "questionedTraining": <integer 0-15>,
    "targetAudience": <integer 0-15>,
    "behaviorFocus": <integer 0-15>
  },
  "stage": <integer 1-5>,
  "feedback": "<one sharp coaching sentence: what the ID just did well or exactly what they should ask/say next>",
  "prompts": [
    "<short suggested question or response the learner could send — 8 to 14 words max>",
    "<second option with a different angle>",
    "<third option — could be a redirect, pushback, or follow-up>"
  ]
}

Scores are CUMULATIVE — only increase, never decrease. Award partial credit for close attempts. Be honest. Total possible is 100 (measurableGoal 20 + keyBehaviors 20 + rootCauses 15 + questionedTraining 15 + targetAudience 15 + behaviorFocus 15). The prompts should feel like natural ID responses — some probing, some pushing back, some proposing next steps.`;

const OPENING_MESSAGE = "Look, I'll cut straight to it. My sales team isn't hitting their numbers. Q3 was rough. I've already put together a list of topics I want covered: objection handling, product knowledge, competitive positioning, closing techniques. I just need you to build the training. Can we get started on that?";

const OPENING_PROMPTS = [
  "Before we jump in — what specific outcome are you trying to move?",
  "Can you tell me more about what 'not hitting numbers' looks like in practice?",
  "Who exactly on the team is struggling, and who isn't?"
];

let messages = [];
let currentScores = { measurableGoal:0, keyBehaviors:0, rootCauses:0, questionedTraining:0, targetAudience:0, behaviorFocus:0 };
const maxScores =   { measurableGoal:20, keyBehaviors:20, rootCauses:15, questionedTraining:15, targetAudience:15, behaviorFocus:15 };
let currentStage = 1;
let isWaiting = false;
let panelVisible = true;

let hintsVisible = false;

function setPanelVisible(visible) {
  panelVisible = visible;
  document.getElementById('scorePanel').classList.toggle('hidden', !visible);
  document.getElementById('toggleBtn').classList.toggle('active', visible);
}

window.onload = () => {
  const isMobile = window.matchMedia('(max-width: 700px)').matches;
  setPanelVisible(!isMobile);
  addMessage('ai', OPENING_MESSAGE, OPENING_PROMPTS);
  document.getElementById('userInput').focus();

  // Swipe-down to dismiss on mobile
  const panel = document.getElementById('scorePanel');
  let touchStartY = 0;
  panel.addEventListener('touchstart', e => {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });
  panel.addEventListener('touchend', e => {
    if (e.changedTouches[0].clientY - touchStartY > 60) {
      setPanelVisible(false);
    }
  }, { passive: true });
};

// ── HINTS TOGGLE ───────────────────────────────────────
function toggleHints() {
  hintsVisible = !hintsVisible;
  document.getElementById('hintsBtn').classList.toggle('active', hintsVisible);
  document.querySelectorAll('.prompts').forEach(el => {
    el.classList.toggle('visible', hintsVisible);
  });
}

// ── PANEL TOGGLE ───────────────────────────────────────
function togglePanel() {
  setPanelVisible(!panelVisible);
}

// ── RESET ──────────────────────────────────────────────
function resetSim() {
  messages = [];
  currentScores = { measurableGoal:0, keyBehaviors:0, rootCauses:0, questionedTraining:0, targetAudience:0, behaviorFocus:0 };
  currentStage = 1;
  isWaiting = false;
  hintsVisible = false;
  document.getElementById('hintsBtn').classList.remove('active');

  const container = document.getElementById('messages');
  const typing = document.getElementById('typing');
  while (container.firstChild && container.firstChild !== typing) container.removeChild(container.firstChild);

  document.getElementById('totalScore').textContent = '0';
  document.getElementById('totalBar').style.width = '0%';
  for (const key of Object.keys(currentScores)) {
    const pts = document.getElementById(`pts-${key}`);
    pts.textContent = `0 / ${maxScores[key]}`;
    pts.classList.remove('earned');
    const bar = document.getElementById(`bar-${key}`);
    bar.style.width = '0%';
    bar.classList.remove('full');
  }

  for (let i = 1; i <= 5; i++) {
    const dot = document.getElementById(`sd-${i}`);
    const item = document.getElementById(`si-${i}`);
    dot.className = 'stage-dot';
    dot.textContent = i;
    item.className = 'stage-item';
  }
  document.getElementById('sd-1').classList.add('active');
  document.getElementById('si-1').classList.add('current');

  document.getElementById('feedbackBox').textContent = 'Marcus has opened the conversation. Don\'t accept "we need training" at face value — start digging.';

  const input = document.getElementById('userInput');
  input.value = '';
  input.style.height = '46px';
  document.getElementById('sendBtn').disabled = false;

  addMessage('ai', OPENING_MESSAGE, OPENING_PROMPTS);
  input.focus();
}

// ── ADD MESSAGE ────────────────────────────────────────
function addMessage(role, text, prompts) {
  const container = document.getElementById('messages');
  const typing = document.getElementById('typing');

  const wrap = document.createElement('div');
  wrap.className = `msg ${role}`;

  const label = document.createElement('div');
  label.className = 'msg-label';
  label.textContent = role === 'ai' ? 'Marcus Chen · VP of Sales' : 'You · Instructional Designer';

  const bubble = document.createElement('div');
  bubble.className = 'msg-bubble';
  bubble.textContent = text;

  wrap.appendChild(label);
  wrap.appendChild(bubble);

  if (role === 'ai' && prompts && prompts.length) {
    const promptsEl = document.createElement('div');
    promptsEl.className = 'prompts' + (hintsVisible ? ' visible' : '');
    prompts.forEach(p => {
      const chip = document.createElement('button');
      chip.className = 'prompt-chip';
      chip.textContent = p;
      chip.onclick = () => usePrompt(p);
      promptsEl.appendChild(chip);
    });
    wrap.appendChild(promptsEl);
  }

  container.insertBefore(wrap, typing);
  container.scrollTop = container.scrollHeight;
}

function usePrompt(text) {
  if (isWaiting) return;
  document.getElementById('userInput').value = text;
  sendMessage();
}

// ── TYPING ─────────────────────────────────────────────
function showTyping() { document.getElementById('typing').classList.add('active'); document.getElementById('messages').scrollTop = 99999; }
function hideTyping()  { document.getElementById('typing').classList.remove('active'); }

// ── SCORE UPDATES ──────────────────────────────────────
function updateScores(incoming) {
  let total = 0;
  for (const key of Object.keys(currentScores)) {
    if (incoming[key] !== undefined && incoming[key] > currentScores[key]) {
      currentScores[key] = Math.min(incoming[key], maxScores[key]);
    }
    total += currentScores[key];
  }
  total = Math.min(total, 100);
  document.getElementById('totalScore').textContent = total;
  document.getElementById('totalBar').style.width = `${total}%`;

  // Auto-advance to stage 5 when solution-related scores are awarded
  if (currentStage < 5 && currentScores.behaviorFocus > 0) updateStage(5);
  for (const [key, val] of Object.entries(currentScores)) {
    const max = maxScores[key];
    const pct = (val / max) * 100;
    const ptsEl = document.getElementById(`pts-${key}`);
    ptsEl.textContent = `${val} / ${max}`;
    if (val > 0) ptsEl.classList.add('earned'); else ptsEl.classList.remove('earned');
    const barEl = document.getElementById(`bar-${key}`);
    barEl.style.width = `${pct}%`;
    if (pct >= 100) barEl.classList.add('full'); else barEl.classList.remove('full');
  }
}

function updateStage(stage) {
  if (stage < 1 || stage > 5 || stage <= currentStage) return;
  currentStage = stage;
  for (let i = 1; i <= 5; i++) {
    const dot = document.getElementById(`sd-${i}`);
    const item = document.getElementById(`si-${i}`);
    dot.className = 'stage-dot';
    item.className = 'stage-item';
    if (i < stage)       { dot.classList.add('done'); dot.textContent = '✓'; }
    else if (i === stage) {
      // Stage 5 is the final stage — mark it done immediately
      if (stage === 5) { dot.classList.add('done'); dot.textContent = '✓'; item.classList.add('current'); }
      else             { dot.classList.add('active'); item.classList.add('current'); dot.textContent = i; }
    }
    else dot.textContent = i;
  }
}

function updateFeedback(text) { if (text) document.getElementById('feedbackBox').textContent = text; }

// ── SEND ───────────────────────────────────────────────
async function sendMessage() {
  if (isWaiting) return;
  const input = document.getElementById('userInput');
  const sendBtn = document.getElementById('sendBtn');
  const text = input.value.trim();
  if (!text) return;

  isWaiting = true;
  input.value = '';
  input.style.height = '46px';
  sendBtn.disabled = true;

  addMessage('user', text);
  messages.push({ role: 'user', content: text });
  showTyping();

  const payload = [
    { role: 'system', content: SYSTEM_PROMPT },
    { role: 'assistant', content: JSON.stringify({
        message: OPENING_MESSAGE,
        scores: { measurableGoal:0, keyBehaviors:0, rootCauses:0, questionedTraining:0, targetAudience:0, behaviorFocus:0 },
        stage: 1, feedback: "", prompts: OPENING_PROMPTS
      })
    },
    ...messages
  ];

  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: payload })
    });
    const data = await res.json();
    const aiRaw = data.choices[0].message.content;

    let parsed;
    try { parsed = JSON.parse(aiRaw.replace(/```json|```/g, '').trim()); }
    catch (_) { parsed = { message: aiRaw, scores: currentScores, stage: currentStage, feedback: null, prompts: [] }; }

    hideTyping();
    addMessage('ai', parsed.message, parsed.prompts || []);
    if (parsed.stage)    updateStage(parsed.stage);
    if (parsed.scores)   updateScores(parsed.scores);
    if (parsed.feedback) updateFeedback(parsed.feedback);

    messages.push({ role: 'assistant', content: aiRaw });

  } catch (err) {
    hideTyping();
    addMessage('ai', "Can't reach the server. Make sure node server.js is running on port 3000.");
  }

  isWaiting = false;
  sendBtn.disabled = false;
  input.focus();
}

function handleKey(e) { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }
function autoResize(el) { el.style.height = 'auto'; el.style.height = Math.min(el.scrollHeight, 120) + 'px'; }