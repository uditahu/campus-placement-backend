const router  = require('express').Router();
const bcrypt  = require('bcrypt');
const db      = require('../config/db');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password, role, ...extras } = req.body;
  if (!name || !email || !password || !role)
    return res.status(400).json({ message: 'All fields are required.' });

  if (!['student','faculty','company'].includes(role))
    return res.status(400).json({ message: 'Invalid role.' });

  try {
    const [existing] = await db.query('SELECT id FROM users WHERE email=?', [email]);
    if (existing.length) return res.status(409).json({ message: 'Email already registered.' });

    const hash = await bcrypt.hash(password, 10);
    const [r]  = await db.query(
      'INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)',
      [name, email, hash, role]
    );
    const uid = r.insertId;

    if (role === 'student') {
      const { college_id='', branch='', year=null, phone='' } = extras;
      await db.query(
        'INSERT INTO students (user_id,college_id,branch,year,phone) VALUES (?,?,?,?,?)',
        [uid, college_id, branch, year, phone]
      );
    } else if (role === 'faculty') {
      const { employee_id='', department='', position='', phone='' } = extras;
      await db.query(
        'INSERT INTO faculty (user_id,employee_id,department,position,phone) VALUES (?,?,?,?,?)',
        [uid, employee_id, department, position, phone]
      );
    } else if (role === 'company') {
      const { company_name='', industry='', website='' } = extras;
      await db.query(
        'INSERT INTO companies (user_id,company_name,industry,website) VALUES (?,?,?,?)',
        [uid, company_name || name, industry, website]
      );
    }
    res.status(201).json({ message: 'Registration successful. Please login.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Email and password required.' });
  try {
    const [rows] = await db.query('SELECT * FROM users WHERE email=?', [email]);
    if (!rows.length) return res.status(401).json({ message: 'Invalid credentials.' });

    const user  = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match)  return res.status(401).json({ message: 'Invalid credentials.' });

    req.session.user = { id: user.id, name: user.name, email: user.email, role: user.role };
    res.json({ message: 'Login successful.', user: req.session.user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.status(500).json({ message: 'Logout failed.' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out.' });
  });
});

// GET /api/auth/me
router.get('/me', (req, res) => {
  if (req.session?.user) return res.json({ user: req.session.user });
  res.status(401).json({ message: 'Not authenticated.' });
});

module.exports = router;
