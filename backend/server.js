require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const session = require('express-session');

const app = express();

// ── CORS ─────────────────────────────────────────────────────────────────────
// FIX: was broken in previous build — origin must be a proper URL string
app.use(cors({
  origin:      process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods:     ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Session ───────────────────────────────────────────────────────────────────
app.use(session({
  secret:            process.env.SESSION_SECRET || 'campus-secret',
  resave:            false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure:   false,   // set true once HTTPS (nginx + certbot) is configured
    maxAge:   24 * 60 * 60 * 1000,
  },
}));

// ── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/student', require('./routes/student'));
app.use('/api/faculty', require('./routes/faculty'));
app.use('/api/company', require('./routes/company'));
app.use('/api/admin',   require('./routes/admin'));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Campus backend running on port ${PORT}`));
