const router = require('express').Router();
const db     = require('../config/db');
const { isAuthenticated, hasRole } = require('../middleware/authMiddleware');

router.get('/profile', isAuthenticated, hasRole('company'), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT u.id,u.name,u.email,c.* FROM users u
       JOIN companies c ON c.user_id=u.id WHERE u.id=?`,
      [req.session.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Not found.' });
    res.json(rows[0]);
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

router.put('/profile', isAuthenticated, hasRole('company'), async (req, res) => {
  const { name, company_name, industry, website, description, phone } = req.body;
  try {
    await db.query('UPDATE users SET name=? WHERE id=?', [name, req.session.user.id]);
    await db.query(
      'UPDATE companies SET company_name=?,industry=?,website=?,description=?,phone=? WHERE user_id=?',
      [company_name, industry, website, description, phone, req.session.user.id]
    );
    res.json({ message: 'Profile updated.' });
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// GET /api/company/jobs
router.get('/jobs', isAuthenticated, hasRole('company'), async (req, res) => {
  try {
    const [c] = await db.query('SELECT id FROM companies WHERE user_id=?', [req.session.user.id]);
    if (!c.length) return res.status(404).json({ message: 'Company not found.' });
    const [rows] = await db.query(
      `SELECT j.*,(SELECT COUNT(*) FROM applications a WHERE a.job_id=j.id) AS applicants_count
       FROM jobs j WHERE j.company_id=? ORDER BY j.created_at DESC`,
      [c[0].id]
    );
    res.json(rows);
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// POST /api/company/jobs
router.post('/jobs', isAuthenticated, hasRole('company'), async (req, res) => {
  const { title, description, vacancies, criteria, min_cgpa, deadline } = req.body;
  if (!title) return res.status(400).json({ message: 'Job title is required.' });
  try {
    const [c] = await db.query('SELECT id FROM companies WHERE user_id=?', [req.session.user.id]);
    if (!c.length) return res.status(404).json({ message: 'Company not found.' });
    await db.query(
      'INSERT INTO jobs (company_id,title,description,vacancies,criteria,min_cgpa,deadline) VALUES (?,?,?,?,?,?,?)',
      [c[0].id, title, description, vacancies||1, criteria, min_cgpa||0, deadline||null]
    );
    res.status(201).json({ message: 'Job posted successfully.' });
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// PUT /api/company/jobs/:id
router.put('/jobs/:id', isAuthenticated, hasRole('company'), async (req, res) => {
  const { title, description, vacancies, criteria, min_cgpa, deadline, status } = req.body;
  try {
    await db.query(
      'UPDATE jobs SET title=?,description=?,vacancies=?,criteria=?,min_cgpa=?,deadline=?,status=? WHERE id=?',
      [title, description, vacancies, criteria, min_cgpa, deadline, status, req.params.id]
    );
    res.json({ message: 'Job updated.' });
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// DELETE /api/company/jobs/:id
router.delete('/jobs/:id', isAuthenticated, hasRole('company'), async (req, res) => {
  try {
    await db.query('DELETE FROM jobs WHERE id=?', [req.params.id]);
    res.json({ message: 'Job deleted.' });
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// GET /api/company/jobs/:id/applicants
router.get('/jobs/:id/applicants', isAuthenticated, hasRole('company'), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT a.id AS app_id,a.status,a.applied_at,
        u.name,u.email,s.college_id,s.branch,s.cgpa,s.resume_url,s.skills,s.phone
       FROM applications a
       JOIN students s ON a.student_id=s.id
       JOIN users u ON s.user_id=u.id
       WHERE a.job_id=? ORDER BY a.applied_at DESC`,
      [req.params.id]
    );
    res.json(rows);
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// PUT /api/company/applications/:id/status
router.put('/applications/:id/status', isAuthenticated, hasRole('company'), async (req, res) => {
  const { status } = req.body;
  if (!['applied','shortlisted','rejected','selected'].includes(status))
    return res.status(400).json({ message: 'Invalid status.' });
  try {
    await db.query('UPDATE applications SET status=? WHERE id=?', [status, req.params.id]);
    res.json({ message: 'Status updated.' });
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

module.exports = router;
