# 🎯 ResumeAI — Professional ATS Resume Platform

> Beat the ATS, land the interview. AI-powered resume analysis, builder, and optimizer.

![Version](https://img.shields.io/badge/version-3.0.0-brightgreen?style=for-the-badge)
![Firebase](https://img.shields.io/badge/auth-Firebase-orange?style=for-the-badge)
![Claude AI](https://img.shields.io/badge/AI-Claude-blue?style=for-the-badge)

---

## ✨ Features

- **🔐 Google Login** — Sign in with Google via Firebase Auth
- **🌙 Dark / Light / System Theme** — Toggle from any page
- **📊 ATS Score Analyzer** — Real-time compatibility score with keyword breakdown
- **🤖 AI Resume Optimizer** — One-click AI rewrite with missing keywords added
- **📝 Resume Builder** — Word-style editor with 4 templates and 5 sample resumes
- **✉️ Cover Letter Generator** — AI writes tailored cover letters in 4 tones
- **📁 PDF & DOCX Upload** — Every character, space, and dot preserved
- **💾 Download** — Export as .docx or .txt
- **🆓 2 Free Uses** — Guests can analyze 2 resumes before login required

---

## 🚀 Quick Start

```bash
git clone https://github.com/YOUR_USERNAME/ATS-resume-matcher.git
cd ATS-resume-matcher
npm install
cp .env.example .env
# Add your VITE_ANTHROPIC_API_KEY to .env
npm run dev
```

---

## 🔑 Environment Variables

```env
VITE_ANTHROPIC_API_KEY=sk-ant-...
```

---

## 🛠 Tech Stack

| | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS + CSS Variables |
| Auth | Firebase Google Auth |
| Database | Cloud Firestore |
| AI | Anthropic Claude API |
| File Parsing | PDF.js + Mammoth.js |
| Routing | React Router v6 |

---

## 📁 Project Structure

```
src/
├── pages/
│   ├── LandingPage.jsx     # Hero + features
│   ├── LoginPage.jsx       # Google sign-in
│   ├── DashboardPage.jsx   # User dashboard
│   ├── ATSPage.jsx         # ATS analyzer
│   ├── BuilderPage.jsx     # Resume builder
│   └── CoverLetterPage.jsx # Cover letter generator
├── components/
│   └── ui/
│       ├── Navbar.jsx
│       └── ThemeSwitcher.jsx
├── hooks/
│   ├── useAuth.jsx
│   └── useTheme.jsx
├── utils/
│   ├── firebase.js
│   ├── atsAnalyzer.js
│   └── fileParser.js
└── data/
    └── sampleResumes.js
```

## 📄 License

MIT © 2025
