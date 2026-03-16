const router = require('express').Router();
const db     = require('../config/db');
const { isAuthenticated, hasRole } = require('../middleware/authMiddleware');

router.get('/profile', isAuthenticated, hasRole('faculty'), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT u.id,u.name,u.email,f.* FROM users u
       JOIN faculty f ON f.user_id=u.id WHERE u.id=?`,
      [req.session.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Not found.' });
    res.json(rows[0]);
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

router.put('/profile', isAuthenticated, hasRole('faculty'), async (req, res) => {
  const { name, employee_id, department, position, phone } = req.body;
  try {
    await db.query('UPDATE users SET name=? WHERE id=?', [name, req.session.user.id]);
    await db.query(
      'UPDATE faculty SET employee_id=?,department=?,position=?,phone=? WHERE user_id=?',
      [employee_id, department, position, phone, req.session.user.id]
    );
    res.json({ message: 'Profile updated.' });
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// Students assigned to this faculty by admin
router.get('/students', isAuthenticated, hasRole('faculty'), async (req, res) => {
  try {
    const [f] = await db.query('SELECT id FROM faculty WHERE user_id=?', [req.session.user.id]);
    if (!f.length) return res.status(404).json({ message: 'Faculty profile not found.' });
    const [rows] = await db.query(
      `SELECT u.name,u.email,s.college_id,s.branch,s.cgpa,s.resume_url,s.skills,s.phone,s.year
       FROM assignments a
       JOIN students s ON a.student_id=s.id
       JOIN users u ON s.user_id=u.id
       WHERE a.faculty_id=? ORDER BY u.name`,
      [f[0].id]
    );
    res.json(rows);
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// All students (read-only access for faculty)
router.get('/all-students', isAuthenticated, hasRole('faculty'), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT u.name,u.email,s.college_id,s.branch,s.cgpa,s.resume_url,s.skills,s.year,
        (SELECT COUNT(*) FROM applications a WHERE a.student_id=s.id) AS applications_count
       FROM students s JOIN users u ON s.user_id=u.id ORDER BY u.name`
    );
    res.json(rows);
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

module.exports = router;
