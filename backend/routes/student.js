const router    = require('express').Router();
const multer    = require('multer');
const multerS3  = require('multer-s3');
const s3        = require('../config/s3');
const db        = require('../config/db');
const { isAuthenticated, hasRole } = require('../middleware/authMiddleware');

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.S3_BUCKET,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: (req, file, cb) => {
      cb(null, `resumes/${req.session.user.id}-${Date.now()}-${file.originalname}`);
    },
  }),
  fileFilter: (_req, file, cb) =>
    file.mimetype === 'application/pdf'
      ? cb(null, true)
      : cb(new Error('Only PDF files are allowed'), false),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// GET /api/student/profile
router.get('/profile', isAuthenticated, hasRole('student'), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT u.id,u.name,u.email,s.* FROM users u
       JOIN students s ON s.user_id=u.id WHERE u.id=?`,
      [req.session.user.id]
    );
    if (!rows.length) return res.status(404).json({ message: 'Profile not found.' });
    res.json(rows[0]);
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// PUT /api/student/profile
router.put('/profile', isAuthenticated, hasRole('student'), async (req, res) => {
  const { name, college_id, branch, cgpa, year, phone, skills, bio, linkedin, github } = req.body;
  try {
    await db.query('UPDATE users SET name=? WHERE id=?', [name, req.session.user.id]);
    await db.query(
      `UPDATE students SET college_id=?,branch=?,cgpa=?,year=?,phone=?,skills=?,bio=?,linkedin=?,github=?
       WHERE user_id=?`,
      [college_id, branch, cgpa||null, year||null, phone, skills, bio, linkedin, github, req.session.user.id]
    );
    req.session.user.name = name;
    res.json({ message: 'Profile updated.' });
  } catch (err) { console.error(err); res.status(500).json({ message: 'Server error.' }); }
});

// POST /api/student/resume
router.post('/resume', isAuthenticated, hasRole('student'), upload.single('resume'), async (req, res) => {
  try {
    const url = req.file.location;
    await db.query('UPDATE students SET resume_url=? WHERE user_id=?', [url, req.session.user.id]);
    res.json({ message: 'Resume uploaded.', resume_url: url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Resume upload failed. Check EC2 IAM role / S3 permissions.' });
  }
});

// GET /api/student/jobs
router.get('/jobs', isAuthenticated, hasRole('student'), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT j.*, c.company_name, c.industry,
        (SELECT COUNT(*) FROM applications a
         JOIN students st ON a.student_id=st.id
         WHERE a.job_id=j.id AND st.user_id=?) AS applied
       FROM jobs j JOIN companies c ON j.company_id=c.id
       WHERE j.status='open' ORDER BY j.created_at DESC`,
      [req.session.user.id]
    );
    res.json(rows);
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

// POST /api/student/jobs/:id/apply
router.post('/jobs/:id/apply', isAuthenticated, hasRole('student'), async (req, res) => {
  try {
    const [st] = await db.query('SELECT id FROM students WHERE user_id=?', [req.session.user.id]);
    if (!st.length) return res.status(404).json({ message: 'Complete your profile first.' });
    await db.query('INSERT INTO applications (student_id,job_id) VALUES (?,?)', [st[0].id, req.params.id]);
    res.json({ message: 'Application submitted!' });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY')
      return res.status(409).json({ message: 'Already applied to this job.' });
    res.status(500).json({ message: 'Server error.' });
  }
});

// GET /api/student/applications
router.get('/applications', isAuthenticated, hasRole('student'), async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT a.id,a.status,a.applied_at,j.title,j.description,c.company_name,c.industry
       FROM applications a
       JOIN jobs j ON a.job_id=j.id
       JOIN companies c ON j.company_id=c.id
       JOIN students s ON a.student_id=s.id
       WHERE s.user_id=? ORDER BY a.applied_at DESC`,
      [req.session.user.id]
    );
    res.json(rows);
  } catch { res.status(500).json({ message: 'Server error.' }); }
});

module.exports = router;
