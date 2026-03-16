-- Campus Placement Portal — MySQL Schema
-- Run this on your RDS instance:
--   mysql -h <RDS_ENDPOINT> -u admin -p campus_db < schema.sql

CREATE DATABASE IF NOT EXISTS campus_db;
USE campus_db;

CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  email      VARCHAR(100) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  role       ENUM('student','faculty','company','admin') NOT NULL DEFAULT 'student',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS students (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  college_id VARCHAR(50),
  branch     VARCHAR(100),
  cgpa       DECIMAL(4,2),
  year       TINYINT,
  phone      VARCHAR(15),
  resume_url VARCHAR(600),
  skills     TEXT,
  bio        TEXT,
  linkedin   VARCHAR(255),
  github     VARCHAR(255),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS faculty (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  employee_id VARCHAR(50),
  department  VARCHAR(100),
  position    VARCHAR(100),
  phone       VARCHAR(15),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS companies (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  user_id      INT NOT NULL,
  company_name VARCHAR(150),
  industry     VARCHAR(100),
  website      VARCHAR(255),
  description  TEXT,
  phone        VARCHAR(15),
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS jobs (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  company_id  INT NOT NULL,
  title       VARCHAR(150) NOT NULL,
  description TEXT,
  vacancies   INT DEFAULT 1,
  criteria    TEXT,
  min_cgpa    DECIMAL(4,2) DEFAULT 0,
  deadline    DATE,
  status      ENUM('open','closed') DEFAULT 'open',
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (company_id) REFERENCES companies(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS applications (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  job_id     INT NOT NULL,
  status     ENUM('applied','shortlisted','rejected','selected') DEFAULT 'applied',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (job_id)     REFERENCES jobs(id)     ON DELETE CASCADE,
  UNIQUE KEY unique_application (student_id, job_id)
);

CREATE TABLE IF NOT EXISTS assignments (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  faculty_id  INT NOT NULL,
  student_id  INT NOT NULL,
  assigned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (faculty_id) REFERENCES faculty(id)  ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  UNIQUE KEY unique_assignment (faculty_id, student_id)
);
