import { useState, useEffect, useCallback, useRef } from 'react';
import '../styles/guide.css';

const NAV_SECTIONS = [
  { group: 'Overview', items: [{ id: 'intro', num: '→', label: 'Why This Matters' }] },
  {
    group: 'Setup',
    items: [
      { id: 'phase1', num: '1', label: 'Accounts & Tools' },
      { id: 'phase2', num: '2', label: 'Build the Backend' },
      { id: 'phase3', num: '3', label: 'Build the Frontend' },
    ],
  },
  {
    group: 'Deploy',
    items: [
      { id: 'phase4', num: '4', label: 'Push to GitHub' },
      { id: 'phase5', num: '5', label: 'Deploy to Render' },
      { id: 'phase6', num: '6', label: 'GitHub Pages' },
    ],
  },
  {
    group: 'Reference',
    items: [
      { id: 'cors', num: '!', label: 'CORS Explained' },
      { id: 'engineers', num: '💬', label: 'Talking to Engineers' },
      { id: 'files', num: '📁', label: 'File Reference' },
    ],
  },
];

function NavItem({ id, num, label, active, onClick }) {
  return (
    <div className={`nav-item${active ? ' active' : ''}`} onClick={() => onClick(id)}>
      <span className="nav-num">{num}</span>
      {label}
    </div>
  );
}

export default function GuidePage() {
  const [activePanel, setActivePanel] = useState('intro');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const sidebarRef = useRef(null);

  const navigate = useCallback((id) => {
    setActivePanel(id);
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Close sidebar on outside click
  useEffect(() => {
    const handler = (e) => {
      const toggle = document.getElementById('mobile-nav-toggle');
      if (sidebarOpen && sidebarRef.current && !sidebarRef.current.contains(e.target) && !toggle?.contains(e.target)) {
        setSidebarOpen(false);
      }
    };
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, [sidebarOpen]);

  return (
    <>
      <header className="topbar">
        <div className="topbar-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
          </svg>
        </div>
        <div>
          <div className="topbar-title">Secure AI Integration</div>
          <div className="topbar-sub">A guide for Instructional Designers</div>
        </div>
        <div className="topbar-badge">Field Guide v1.0</div>
      </header>

      <div className="guide-layout">
        <nav ref={sidebarRef} className={`sidebar${sidebarOpen ? ' open' : ''}`}>
          {NAV_SECTIONS.map(({ group, items }) => (
            <div key={group}>
              <div className="sidebar-group-label">{group}</div>
              {items.map(({ id, num, label }) => (
                <NavItem key={id} id={id} num={num} label={label} active={activePanel === id} onClick={navigate} />
              ))}
            </div>
          ))}
        </nav>

        <main className="guide-main">
          {/* ── INTRO ── */}
          <section className={`panel${activePanel === 'intro' ? ' active' : ''}`}>
            <div className="panel-eyebrow">Why This Matters</div>
            <h1 className="panel-title">The Problem with Embedding API Keys</h1>
            <p className="panel-lead">If you've ever built an AI-powered e-learning activity by pasting an API key directly into your HTML or JavaScript file, you've accidentally left the front door unlocked.</p>

            <div className="card">
              <div className="section-title">What is an API Key?</div>
              <p>Think of an API key like a credit card number for a service. When you use a paid AI service like Grok or ChatGPT, you're given a key that authorizes you to use it — and gets billed for every request.</p>
              <p>If someone finds your key, they can use the AI service <strong>on your bill</strong> — and you'd have no idea until you get a surprise invoice.</p>
              <div className="callout callout-danger">
                <strong>🚨 Never paste an API key directly into HTML, JavaScript, or any file that gets published to the web.</strong> It can be found by anyone who opens DevTools (right-click → Inspect) in their browser.
              </div>
            </div>

            <div className="card">
              <div className="section-title">The Solution: A Middleman Server</div>
              <p>The fix is to put your API key on a private server that <em>you</em> control. Your course or learning activity talks to your server, and your server talks to the AI. The key never reaches the learner's browser.</p>
              <div className="diagram">
                <div className="diag-box">
                  <div className="diag-box-label">Learner's Browser</div>
                  <div className="diag-box-name">Your Course / App</div>
                </div>
                <div className="diag-arrow">
                  <div className="diag-arrow-line" />
                  <div className="diag-arrow-label">sends message</div>
                </div>
                <div className="diag-box highlight">
                  <div className="diag-box-label">Your Server</div>
                  <div className="diag-box-name">API Key lives here 🔒</div>
                </div>
                <div className="diag-arrow">
                  <div className="diag-arrow-line" />
                  <div className="diag-arrow-label">forwards to AI</div>
                </div>
                <div className="diag-box">
                  <div className="diag-box-label">AI Service</div>
                  <div className="diag-box-name">Grok / ChatGPT</div>
                </div>
              </div>
              <p>The learner only ever sees your server's response — never the key itself. It works exactly like ordering food at a restaurant. You (the learner) tell the waiter (your server) what you want. The waiter calls the kitchen (the AI). You get your food. You never needed the kitchen's private phone number.</p>
            </div>

            <div className="card">
              <div className="section-title">What You'll Build</div>
              <p>In this guide you'll set up a complete secure pipeline: a backend server hosted for free on Render, a frontend HTML file hosted on GitHub Pages, and a locked-down connection between the two.</p>
              <div className="callout callout-info">
                <strong>Cost:</strong> Everything in this guide is free. Render's free tier, GitHub Pages, and a Grok API key are all you need.
              </div>
            </div>
          </section>

          {/* ── PHASE 1 ── */}
          <section className={`panel${activePanel === 'phase1' ? ' active' : ''}`}>
            <div className="panel-eyebrow">Phase 1</div>
            <h1 className="panel-title">Accounts &amp; Tools</h1>
            <p className="panel-lead">Before writing a single line of code, get these four things in place. This is a one-time setup.</p>

            <div className="card">
              <div className="section-title">1. Install Node.js</div>
              <p>Node.js is the engine that runs your backend server on your computer during development.</p>
              <ol className="steps">
                <li>Go to <strong>nodejs.org</strong> and download the LTS version (the left button).</li>
                <li>Run the installer with all default settings. Leave the "Native Tools" checkbox unchecked.</li>
                <li>Open a new PowerShell window and run <code>node -v</code> then <code>npm -v</code> — both should show version numbers.</li>
              </ol>
              <div className="callout callout-warn">
                <strong>PowerShell tip:</strong> If <code>npm</code> gives a security error, run this once:<br />
                <code>Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned</code>
              </div>
            </div>

            <div className="card">
              <div className="section-title">2. Create a GitHub Account</div>
              <p>GitHub is where your code lives online. It also powers GitHub Pages — the free hosting for your frontend. If you already have an account, you're good.</p>
              <p>Your GitHub username becomes part of your public URL: <code>https://yourusername.github.io</code></p>
            </div>

            <div className="card">
              <div className="section-title">3. Create a Render Account</div>
              <p>Render is where your backend server will live in the cloud — running 24/7 at a real URL. Sign up at <strong>render.com</strong> using your GitHub account so they're linked automatically.</p>
              <div className="callout callout-info">
                <strong>Free tier note:</strong> Render's free servers "spin down" after 15 minutes of inactivity. The first request after a sleep takes about 50 seconds. This is fine for prototypes and learning tools.
              </div>
            </div>

            <div className="card">
              <div className="section-title">4. Get Your AI API Key</div>
              <p>For this guide we used Grok (xAI). Get your key at <strong>console.x.ai</strong>. The same concept applies to any AI provider — OpenAI, Anthropic, Google, etc.</p>
              <div className="callout callout-danger">
                <strong>Treat this like a password.</strong> Never share it in chat, email, or any file that gets published. If it gets exposed, regenerate it immediately at your provider's console.
              </div>
            </div>
          </section>

          {/* ── PHASE 2 ── */}
          <section className={`panel${activePanel === 'phase2' ? ' active' : ''}`}>
            <div className="panel-eyebrow">Phase 2</div>
            <h1 className="panel-title">Build the Backend</h1>
            <p className="panel-lead">The backend is a tiny server with one job: receive messages from your course, forward them to the AI using your hidden key, and return the response.</p>

            <div className="card">
              <div className="section-title">Create Your Project Folder</div>
              <pre>{`cd C:\\Users\\YourName\nmkdir id-simulation\ncd id-simulation\nmkdir backend\ncd backend\nnpm init -y`}</pre>
              <p>The last command creates a <code>package.json</code> file — think of it as the ID card for your project.</p>
            </div>

            <div className="card">
              <div className="section-title">Install Dependencies</div>
              <pre>npm install express cors dotenv</pre>
              <table className="data-table">
                <thead><tr><th>Package</th><th>What it does</th></tr></thead>
                <tbody>
                  <tr><td><code>express</code></td><td>Creates the web server and defines your endpoint</td></tr>
                  <tr><td><code>cors</code></td><td>Controls which websites are allowed to talk to your server</td></tr>
                  <tr><td><code>dotenv</code></td><td>Reads your secret API key from the hidden <code>.env</code> file</td></tr>
                </tbody>
              </table>
            </div>

            <div className="card">
              <div className="section-title">Create Your .env File</div>
              <pre>{`GROK_API_KEY=your_actual_api_key_here\nPORT=3000`}</pre>
              <div className="callout callout-danger">
                <strong>This file must NEVER be pushed to GitHub.</strong> Always add <code>.env</code> to your <code>.gitignore</code> before running <code>git add .</code>
              </div>
            </div>

            <div className="card">
              <div className="section-title">Create server.js</div>
              <pre>{`require('dotenv').config();\nconst express = require('express');\nconst cors = require('cors');\n\nconst app = express();\napp.use(cors({ origin: 'https://yourusername.github.io' }));\napp.use(express.json());\n\napp.post('/chat', async (req, res) => {\n  const { messages } = req.body;\n  const response = await fetch('https://api.x.ai/v1/chat/completions', {\n    method: 'POST',\n    headers: {\n      'Content-Type': 'application/json',\n      'Authorization': \`Bearer \${process.env.GROK_API_KEY}\`\n    },\n    body: JSON.stringify({ model: 'grok-3-mini', messages })\n  });\n  const data = await response.json();\n  res.json(data);\n});\n\napp.listen(process.env.PORT || 3000, () =>\n  console.log('Server running'));`}</pre>
            </div>

            <div className="card">
              <div className="section-title">Test Locally</div>
              <pre>node server.js</pre>
              <p>You should see <code>Server running</code> in the terminal.</p>
              <div className="callout callout-success">
                <strong>✓ What just happened:</strong> Your server used your hidden API key to talk to Grok and returned the response. Your key never left your machine.
              </div>
            </div>
          </section>

          {/* ── PHASE 3 ── */}
          <section className={`panel${activePanel === 'phase3' ? ' active' : ''}`}>
            <div className="panel-eyebrow">Phase 3</div>
            <h1 className="panel-title">Build the Frontend</h1>
            <p className="panel-lead">The frontend is the part learners see and interact with — in our case, a chat interface.</p>

            <div className="card">
              <div className="section-title">Create the Frontend Folder</div>
              <pre>{`id-simulation/\n├── backend/\n│   ├── .env          ← secret key (never on GitHub)\n│   ├── .gitignore\n│   ├── package.json\n│   └── server.js\n└── frontend/\n    └── index.html    ← your course/activity UI`}</pre>
            </div>

            <div className="card">
              <div className="section-title">The Key Line in Your Frontend</div>
              <p>Your frontend communicates with your backend through one constant. During development it points to your local server:</p>
              <pre>{`// During local development:\nconst API_URL = 'http://localhost:3000/chat';`}</pre>
              <p>After deploying, you update this to your live Render URL:</p>
              <pre>{`// After deploying to Render:\nconst API_URL = 'https://your-app-name.onrender.com/chat';`}</pre>
            </div>

            <div className="card">
              <div className="section-title">How the Frontend Sends a Message</div>
              <pre>{`const response = await fetch(API_URL, {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ messages: conversationHistory })\n});`}</pre>
              <p>Notice: <strong>no API key anywhere in this code.</strong> The frontend only knows your server's URL — nothing about Grok or your credentials.</p>
            </div>
          </section>

          {/* ── PHASE 4 ── */}
          <section className={`panel${activePanel === 'phase4' ? ' active' : ''}`}>
            <div className="panel-eyebrow">Phase 4</div>
            <h1 className="panel-title">Push to GitHub</h1>
            <p className="panel-lead">Before deploying to the cloud, your code needs to be on GitHub. This is also where the most common mistake happens — accidentally uploading your secret key.</p>

            <div className="card">
              <div className="section-title">⚠️ The Golden Rule: .gitignore First</div>
              <p>Always — always — create your <code>.gitignore</code> file <em>before</em> running <code>git add .</code>.</p>
              <pre>{`node_modules/\n.env`}</pre>
              <div className="callout callout-warn">
                <strong>The right order matters:</strong><br />
                1. <code>git init</code><br />
                2. Create <code>.gitignore</code> with the exclusions<br />
                3. <code>git add .</code><br />
                4. <code>git commit</code>
              </div>
            </div>

            <div className="card">
              <div className="section-title">Push the Backend</div>
              <ol className="steps">
                <li>Create a new empty repo on GitHub (no README, no license).</li>
                <li>In your backend folder, initialize Git and commit your clean files.</li>
                <li>Connect to GitHub and push.</li>
              </ol>
              <pre>{`git init\ngit add .\ngit status   # verify — should only show .gitignore, package.json, server.js\ngit commit -m "initial backend commit"\ngit remote add origin https://github.com/yourusername/your-repo.git\ngit branch -M main\ngit push -u origin main`}</pre>
              <div className="callout callout-success">
                <strong>✓ Verify on GitHub:</strong> Confirm you only see <code>.gitignore</code>, <code>package-lock.json</code>, <code>package.json</code>, and <code>server.js</code>. If <code>.env</code> appears, something went wrong.
              </div>
            </div>
          </section>

          {/* ── PHASE 5 ── */}
          <section className={`panel${activePanel === 'phase5' ? ' active' : ''}`}>
            <div className="panel-eyebrow">Phase 5</div>
            <h1 className="panel-title">Deploy to Render</h1>
            <p className="panel-lead">Render takes your GitHub repo and turns it into a live, running server in the cloud.</p>

            <div className="card">
              <div className="section-title">Create a Web Service</div>
              <ol className="steps">
                <li>Log in to <strong>render.com</strong> and click <strong>New → Web Service</strong>.</li>
                <li>Connect your GitHub repo (<code>id-simulation-backend</code>).</li>
                <li>Fill in the settings below and click <strong>Deploy Web Service</strong>.</li>
              </ol>
              <table className="data-table" style={{ marginTop: '16px' }}>
                <thead><tr><th>Field</th><th>Value</th></tr></thead>
                <tbody>
                  <tr><td>Language</td><td>Node</td></tr>
                  <tr><td>Branch</td><td>main</td></tr>
                  <tr><td>Build Command</td><td><code>npm install</code></td></tr>
                  <tr><td>Start Command</td><td><code>node server.js</code></td></tr>
                  <tr><td>Instance Type</td><td>Free</td></tr>
                </tbody>
              </table>
            </div>

            <div className="card">
              <div className="section-title">Add the Environment Variable</div>
              <table className="data-table">
                <thead><tr><th>Key</th><th>Value</th></tr></thead>
                <tbody>
                  <tr><td><code>GROK_API_KEY</code></td><td>your actual API key</td></tr>
                </tbody>
              </table>
              <div className="callout callout-info">
                Render stores this securely on their servers. It never appears in your code or your GitHub repo.
              </div>
            </div>

            <div className="card">
              <div className="section-title">Confirm It's Live</div>
              <p>Watch the deploy logs. When you see <code>Server running</code>, your backend is live at:</p>
              <pre>https://id-simulation-backend.onrender.com/chat</pre>
              <p>Update the <code>API_URL</code> constant in your frontend to this URL.</p>
            </div>
          </section>

          {/* ── PHASE 6 ── */}
          <section className={`panel${activePanel === 'phase6' ? ' active' : ''}`}>
            <div className="panel-eyebrow">Phase 6</div>
            <h1 className="panel-title">Deploy Frontend to GitHub Pages</h1>
            <p className="panel-lead">GitHub Pages hosts your HTML file for free at a public URL. No server needed.</p>

            <div className="card">
              <div className="section-title">Create a Frontend Repo and Push</div>
              <ol className="steps">
                <li>Create a new empty repo on GitHub named <code>id-simulation</code>.</li>
                <li>In your frontend folder, initialize Git and push <code>index.html</code>.</li>
              </ol>
              <pre>{`cd C:\\Users\\YourName\\id-simulation\\frontend\ngit init\ngit add .\ngit commit -m "initial frontend commit"\ngit remote add origin https://github.com/yourusername/id-simulation.git\ngit branch -M main\ngit push -u origin main`}</pre>
            </div>

            <div className="card">
              <div className="section-title">Enable GitHub Pages</div>
              <ol className="steps">
                <li>Go to your repo on GitHub.</li>
                <li>Click <strong>Settings → Pages</strong> in the left sidebar.</li>
                <li>Under Source, select <strong>Deploy from a branch</strong>.</li>
                <li>Set Branch to <strong>main</strong>, folder to <strong>/ (root)</strong>.</li>
                <li>Click <strong>Save</strong>. Wait 1–2 minutes.</li>
              </ol>
              <div className="callout callout-success">
                <strong>✓ You're done!</strong> Open <code>https://yourusername.github.io/id-simulation</code> in any browser — the simulation is live, the backend is secure, and your API key is hidden.
              </div>
            </div>
          </section>

          {/* ── CORS ── */}
          <section className={`panel${activePanel === 'cors' ? ' active' : ''}`}>
            <div className="panel-eyebrow">Reference</div>
            <h1 className="panel-title">CORS Explained</h1>
            <p className="panel-lead">CORS — Cross-Origin Resource Sharing — is a browser security rule that controls which websites are allowed to talk to your server.</p>

            <div className="card">
              <div className="section-title">What is an "Origin"?</div>
              <p>An origin is a combination of a protocol, domain, and port. When your browser-based course tries to call your backend, the browser checks: "Is this origin allowed?" If not, the request is blocked.</p>
            </div>

            <div className="card">
              <div className="section-title">How to Set CORS in Your Server</div>
              <p><strong>Open (anyone can call your server — not recommended):</strong></p>
              <pre>{`app.use(cors()); // No restrictions`}</pre>
              <p><strong>Single origin (recommended):</strong></p>
              <pre>{`app.use(cors({ origin: 'https://kevlovesdev.github.io' }));`}</pre>
              <p><strong>Multiple origins:</strong></p>
              <pre>{`app.use(cors({\n  origin: [\n    'https://kevlovesdev.github.io',\n    'https://app.rise.com'\n  ]\n}));`}</pre>
            </div>

            <div className="card">
              <div className="section-title">How Broad Can a CORS URL Be?</div>
              <table className="data-table">
                <thead><tr><th>What you put in CORS</th><th>What it allows</th><th>Good idea?</th></tr></thead>
                <tbody>
                  <tr><td><code>https://rise.com</code></td><td>Any page on rise.com — including other people's courses</td><td>❌ Too broad</td></tr>
                  <tr><td><code>https://app.rise.com</code></td><td>Any page on the Rise app subdomain</td><td>⚠️ Use with caution</td></tr>
                  <tr><td><code>https://kevlovesdev.github.io</code></td><td>Only pages hosted on your personal GitHub Pages</td><td>✅ Recommended</td></tr>
                  <tr><td><code>https://yourschool.instructure.com</code></td><td>Your specific Canvas instance only</td><td>✅ Fine for org use</td></tr>
                </tbody>
              </table>
              <div className="callout callout-warn">
                <strong>Important:</strong> CORS is a browser-level protection only. Always pair it with rate limiting and key rotation for anything in production.
              </div>
            </div>
          </section>

          {/* ── ENGINEERS ── */}
          <section className={`panel${activePanel === 'engineers' ? ' active' : ''}`}>
            <div className="panel-eyebrow">Reference</div>
            <h1 className="panel-title">Talking to Software Engineers</h1>
            <p className="panel-lead">If you're working with a dev team instead of building this yourself, here's how to communicate what you need clearly and professionally.</p>

            <div className="card">
              <div className="section-title">The Vocabulary You Now Know</div>
              <table className="data-table">
                <thead><tr><th>Term</th><th>Plain English</th></tr></thead>
                <tbody>
                  <tr><td><strong>API endpoint</strong></td><td>A specific URL your app sends messages to. Like a dedicated phone line for one purpose.</td></tr>
                  <tr><td><strong>Environment variable</strong></td><td>A secret stored on the server, not in the code.</td></tr>
                  <tr><td><strong>CORS</strong></td><td>A rule that says which websites are allowed to talk to the backend.</td></tr>
                  <tr><td><strong>Backend / server</strong></td><td>Code that runs in the cloud, not in the browser. Handles secrets and data.</td></tr>
                  <tr><td><strong>Frontend / client</strong></td><td>The HTML/JS the learner sees in their browser.</td></tr>
                  <tr><td><strong>POST request</strong></td><td>A message your frontend sends to the backend containing data (like a chat message).</td></tr>
                </tbody>
              </table>
            </div>

            <div className="card">
              <div className="section-title">Script: Requesting a New AI Endpoint</div>
              <div className="script-box">
                <div className="script-label">📋 What to say</div>
                "Hi [name], I'm building an AI-powered scenario for a course and I need a backend endpoint to keep the API key secure. Specifically, I need a <strong>POST endpoint</strong> — something like <code>/chat</code> — that accepts an array of messages in the standard OpenAI message format and returns the AI's response. The API key should be stored as an <strong>environment variable</strong> on the server, not in any code. CORS should be configured to allow requests from [your URL] only."
              </div>
            </div>

            <div className="card">
              <div className="section-title">Script: Requesting a CORS Update</div>
              <div className="script-box">
                <div className="script-label">📋 What to say</div>
                "The AI interaction in [course name] is no longer working because we moved the course to [new platform/URL]. The backend's CORS policy is blocking requests from the new origin. Could you add <code>[new URL]</code> to the allowed origins list in the server's CORS configuration?"
              </div>
            </div>

            <div className="card">
              <div className="section-title">What to Include in Any Request</div>
              <ol className="steps">
                <li><strong>The frontend URL</strong> — where the course lives</li>
                <li><strong>The backend URL</strong> — the endpoint being called</li>
                <li><strong>What you expected to happen</strong> vs. what actually happened</li>
                <li><strong>When it started</strong> — did it ever work, or is it new?</li>
                <li><strong>Any error messages</strong> from the browser console (right-click → Inspect → Console tab)</li>
              </ol>
              <div className="callout callout-info">
                <strong>Pro tip:</strong> Open your browser's DevTools (F12), go to the <strong>Network</strong> tab, and trigger the AI interaction. Sharing a screenshot with an engineer will save everyone a lot of back-and-forth.
              </div>
            </div>
          </section>

          {/* ── FILES ── */}
          <section className={`panel${activePanel === 'files' ? ' active' : ''}`}>
            <div className="panel-eyebrow">Reference</div>
            <h1 className="panel-title">File Reference</h1>
            <p className="panel-lead">A quick reference for every file in your project — what it does, whether you write it, and whether it should ever go on GitHub.</p>

            <div className="card">
              <div className="section-title">Backend Files</div>
              <table className="data-table">
                <thead><tr><th>File</th><th>You wrote it?</th><th>Goes to GitHub?</th><th>What it does</th></tr></thead>
                <tbody>
                  <tr><td><code>server.js</code></td><td><span className="tag tag-green">Yes</span></td><td><span className="tag tag-green">Yes</span></td><td>Your actual server. Creates the <code>/chat</code> endpoint.</td></tr>
                  <tr><td><code>.env</code></td><td><span className="tag tag-green">Yes</span></td><td><span className="tag tag-orange">Never</span></td><td>Stores your API key locally.</td></tr>
                  <tr><td><code>.gitignore</code></td><td><span className="tag tag-green">Yes</span></td><td><span className="tag tag-green">Yes</span></td><td>Tells Git to ignore <code>.env</code> and <code>node_modules/</code>.</td></tr>
                  <tr><td><code>package.json</code></td><td><span className="tag tag-navy">Auto-generated</span></td><td><span className="tag tag-green">Yes</span></td><td>Lists your project's dependencies.</td></tr>
                  <tr><td><code>node_modules/</code></td><td><span className="tag tag-navy">Auto-generated</span></td><td><span className="tag tag-orange">Never</span></td><td>Downloaded package code. Always regenerated via <code>npm install</code>.</td></tr>
                </tbody>
              </table>
            </div>

            <div className="card">
              <div className="section-title">Frontend Files</div>
              <table className="data-table">
                <thead><tr><th>File</th><th>You wrote it?</th><th>Goes to GitHub?</th><th>What it does</th></tr></thead>
                <tbody>
                  <tr><td><code>index.html</code></td><td><span className="tag tag-green">Yes</span></td><td><span className="tag tag-green">Yes</span></td><td>Your entire course UI. Contains HTML, CSS, and JavaScript in one file.</td></tr>
                </tbody>
              </table>
              <div className="callout callout-info" style={{ marginTop: '16px' }}>
                <strong>Safe to publish:</strong> Your <code>index.html</code> contains no secrets. It only knows your backend's public URL — not the API key.
              </div>
            </div>

            <div className="card">
              <div className="section-title">The Complete Picture</div>
              <div className="diagram" style={{ flexDirection: 'column', gap: '16px', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                  <div className="diag-box" style={{ minWidth: '180px' }}>
                    <div className="diag-box-label">GitHub Repo 1</div>
                    <div className="diag-box-name">id-simulation-backend</div>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>→ auto-deploys to →</div>
                  <div className="diag-box highlight" style={{ minWidth: '180px' }}>
                    <div className="diag-box-label">Render.com</div>
                    <div className="diag-box-name">Live Backend Server 🔒</div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%' }}>
                  <div className="diag-box" style={{ minWidth: '180px' }}>
                    <div className="diag-box-label">GitHub Repo 2</div>
                    <div className="diag-box-name">id-simulation</div>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>→ auto-deploys to →</div>
                  <div className="diag-box" style={{ minWidth: '180px' }}>
                    <div className="diag-box-label">GitHub Pages</div>
                    <div className="diag-box-name">Live Frontend URL</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>

      <button
        id="mobile-nav-toggle"
        className="mobile-nav-toggle"
        onClick={() => setSidebarOpen(v => !v)}
      >
        ☰
      </button>
    </>
  );
}
