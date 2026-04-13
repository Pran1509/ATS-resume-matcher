# 🎯 ATS Resume Matcher

> Match your resume to any job description, get an ATS compatibility score, and auto-optimize your resume to beat the bots.

![ATS Resume Matcher](https://img.shields.io/badge/ATS-Resume%20Matcher-6366f1?style=for-the-badge)
![Claude AI](https://img.shields.io/badge/Powered%20by-Claude%20AI-orange?style=for-the-badge)
![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)

---

## ✨ Features

- **📊 ATS Score** — Get a real-time compatibility score (0–100) between your resume and a job description
- **🔍 Keyword Analysis** — See which keywords are present, missing, or partially matched
- **🤖 AI Optimization** — One-click to rewrite your resume to be fully ATS-friendly
- **📋 Section Breakdown** — Detailed scoring for Skills, Experience, Education, and Keywords
- **💡 Actionable Tips** — Specific suggestions to improve your resume for each job
- **📥 Export** — Download your optimized resume as plain text ready to paste

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- An Anthropic API key ([get one here](https://console.anthropic.com))

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ats-resume-matcher.git
cd ats-resume-matcher

# Install dependencies
npm install

# Set up your API key
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS |
| AI Backend | Anthropic Claude API (claude-sonnet-4-20250514) |
| Build | Vite |

---

## 📁 Project Structure

```
ats-resume-matcher/
├── src/
│   ├── App.jsx              # Main application component
│   ├── main.jsx             # Entry point
│   ├── components/
│   │   ├── ResumeInput.jsx  # Resume paste/upload area
│   │   ├── JobInput.jsx     # Job description input
│   │   ├── ScoreCard.jsx    # ATS score display
│   │   ├── KeywordGrid.jsx  # Keyword match visualization
│   │   ├── OptimizedResume.jsx # AI-rewritten resume output
│   │   └── TipsPanel.jsx    # Improvement suggestions
│   └── utils/
│       └── atsAnalyzer.js   # Claude API integration
├── public/
├── index.html
├── .env.example
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## 🔑 Environment Variables

```env
VITE_ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

> ⚠️ **Never commit your `.env` file.** It's already in `.gitignore`.

---

## 📸 How It Works

1. **Paste your resume** in the left panel (plain text or formatted)
2. **Paste the job description** in the right panel
3. Click **Analyze** — Claude reads both and returns:
   - An ATS compatibility score
   - Matched / missing / partial keywords
   - Section-by-section breakdown
   - Specific improvement tips
4. Click **Optimize Resume** to get an AI-rewritten version tailored to the job

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make your changes, then
git commit -m "feat: add your feature"
git push origin feature/your-feature-name
# Open a pull request
```

---

## 📄 License

MIT © 2025 — see [LICENSE](LICENSE) for details.
