## HireSmart

AI-powered resume screening & hiring workflow assistance.

### Core Capabilities
- Resume upload & parsing
- Job description ingestion
- Skill extraction & similarity scoring
- Candidate categorization
- Modern SaaS landing & authentication (JWT + email verification + password reset)

---
## Monorepo Components
| Area | Tech | Path |
|------|------|------|
| Legacy NLP Service | Flask / Python | `main.py`, `app/` |
| Web Frontend | React + Vite + Tailwind | `src/` |
| Auth/API Backend | Node.js (Express + MongoDB) | `server/` |

---
## Quick Start (Auth + Frontend)
### 1. Environment
Create `.env` in project root (Node server uses it):
```
MONGODB_URI=mongodb://localhost:27017/hiresmart
PORT=4000
JWT_SECRET=change_this_secret
CLIENT_ORIGIN=http://localhost:5173
SMTP_HOST=sandbox.smtp.mailtrap.io
SMTP_PORT=2525
SMTP_USER=your_user
SMTP_PASS=your_pass
MAIL_FROM="HireSmart <no-reply@hiresmart.ai>"
```

### 2. Install deps
```
npm install
```

### 3. Run services (separate terminals)
```
npm run server:dev   # Node auth/API (http://localhost:4000)
npm run dev          # Frontend (http://localhost:5173)
```

### 4. Signup Flow
1. Visit http://localhost:5173/auth/signup
2. Create account → check server console for [DEV] verification link (if using Mailtrap stub)
3. Open link to verify → log in → redirected to dashboard.

### 5. Password Reset
1. Click "Forgot Password" on login
2. Submit email → check console for [DEV] reset link
3. Set new password → login again.

---
## Python (NLP) Service (Optional Legacy)
If you still need the original scoring endpoint:
```
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
python -m spacy download en_core_web_sm
python main.py
```
Runs at http://127.0.0.1:5000

---
## Folder Structure (Key)
```
server/          # Node auth + API (Express, JWT, email)
src/             # React app (landing + auth + dashboard placeholder)
app/             # Python NLP utilities (legacy)
build/           # Production build output (frontend)
```

---
## Auth Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/auth/signup | Create user & send verification email |
| GET | /api/auth/verify-email?token= | Verify email token |
| POST | /api/auth/login | Login & receive JWT |
| POST | /api/auth/password-reset/request | Request reset link |
| POST | /api/auth/password-reset/confirm | Confirm new password |
| GET | /api/auth/me | Current user (auth header) |

Auth uses Bearer JWT: `Authorization: Bearer <token>`

---
## Environment Variables (Summary)
| Name | Purpose | Required | Default |
|------|---------|----------|---------|
| MONGODB_URI | Mongo connection | Yes | mongodb://localhost:27017/hiresmart |
| PORT | Node server port | No | 4000 |
| JWT_SECRET | JWT signing secret | Yes | devsecret (NOT for prod) |
| CLIENT_ORIGIN | Allowed CORS origin | Yes | http://localhost:5173 |
| SMTP_HOST | SMTP server | No | sandbox.smtp.mailtrap.io |
| SMTP_PORT | SMTP port | No | 2525 |
| SMTP_USER | SMTP auth user | No | user |
| SMTP_PASS | SMTP auth pass | No | pass |
| MAIL_FROM | From header | No | hiresmart@app.local |

---
## Roadmap (Next)
- Replace alert-based debug flows with production email service
- Add role-based authorization for future team features
- Integrate dashboard with resume screening results
- Add integration tests for auth flows

---
## License
MIT

## Contact
Krishang Darji – krishangdarji@gmail.com – [GitHub](https://github.com/krishang2205)
