const router = require('express').Router();
const bcrypt = require('bcrypt');
const db     = require('../config/db');
const { isAuthenticated, hasRole } = require('../middleware/authMiddleware');

// GET /api/admin/stats
router.get('/stats', isAuthenticated, hasRole('admin'), async (req, res) => {
  try {
    const [[{ students }]]    = await db.query('SELECT COUNT(*) AS students FROM students');
    const [[{ faculty }]]     = await db.query('SELECT COUNT(*) AS faculty FROM faculty');
    const [[{ companies }]]   = await db.query('SELECT COUNT(*) AS companies FROM companies');
    const [[{ jobs }]]        = await db.query('SELECT COUNT(*) AS jobs FROM jobs WHERE status="open"');
    const [[{ applications }]]= await db.query('SELECT COUNT(*) AS applications FROM applications');
    res.json({ students, faculty, companies, jobs, applications });
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// GET /api/admin/users
router.get('/users', isAuthenticated, hasRole('admin'), async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id,name,email,role,created_at FROM users ORDER BY created_at DESC'
    );
    res.json(rows);
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// DELETE /api/admin/users/:id
router.delete('/users/:id', isAuthenticated, hasRole('admin'), async (req, res) => {
  try {
    await db.query('DELETE FROM users WHERE id=?', [req.params.id]);
    res.json({ message: 'User deleted.' });
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// GET /api/admin/students
router.get('/students', isAuthenticated, hasRole('admin'), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT u.id,u.name,u.email,s.id AS student_id,s.college_id,s.branch,s.cgpa,
        s.resume_url,s.year,s.skills,
        (SELECT COUNT(*) FROM applications a WHERE a.student_id=s.id) AS applications_count
       FROM users u JOIN students s ON s.user_id=u.id ORDER BY u.name`
    );
    res.json(rows);
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// GET /api/admin/faculty
router.get('/faculty', isAuthenticated, hasRole('admin'), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT u.id,u.name,u.email,f.id AS faculty_id,f.employee_id,f.department,f.position,
        (SELECT COUNT(*) FROM assignments a WHERE a.faculty_id=f.id) AS assigned_students
       FROM users u JOIN faculty f ON f.user_id=u.id ORDER BY u.name`
    );
    res.json(rows);
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// GET /api/admin/companies
router.get('/companies', isAuthenticated, hasRole('admin'), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT u.id,u.name,u.email,c.id AS company_id,c.company_name,c.industry,c.website,
        (SELECT COUNT(*) FROM jobs j WHERE j.company_id=c.id) AS jobs_posted
       FROM users u JOIN companies c ON c.user_id=u.id ORDER BY c.company_name`
    );
    res.json(rows);
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// POST /api/admin/assign
router.post('/assign', isAuthenticated, hasRole('admin'), async (req, res) => {
  const { faculty_id, student_id } = req.body;
  try {
    await db.query(
      'INSERT IGNORE INTO assignments (faculty_id,student_id) VALUES (?,?)',
      [faculty_id, student_id]
    );
    res.json({ message: 'Student assigned to faculty.' });
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// POST /api/admin/create-user
router.post('/create-user', isAuthenticated, hasRole('admin'), async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const [r]  = await db.query(
      'INSERT INTO users (name,email,password,role) VALUES (?,?,?,?)',
      [name, email, hash, role]
    );
    const uid = r.insertId;
    if (role==='student')  await db.query('INSERT INTO students (user_id) VALUES (?)', [uid]);
    if (role==='faculty')  await db.query('INSERT INTO faculty (user_id) VALUES (?)', [uid]);
    if (role==='company')  await db.query('INSERT INTO companies (user_id,company_name) VALUES (?,?)', [uid, name]);
    res.status(201).json({ message: 'User created.' });
  } catch (err) {
    if (err.code==='ER_DUP_ENTRY') return res.status(409).json({ message: 'Email already exists.' });
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
