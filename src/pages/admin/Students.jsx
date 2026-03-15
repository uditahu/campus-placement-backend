import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import api from "../../services/api";
import Alert from "../../components/Alert";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(true);

  const fetchStudents = useCallback((q = "") => {
    setLoading(true);
    api.get(`/admin/students?search=${encodeURIComponent(q)}`)
      .then(r => setStudents(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // FIXED: Load students on mount with empty search
  useEffect(() => { fetchStudents(""); }, [fetchStudents]);

  const deleteStudent = async (id) => {
    if (!window.confirm("Delete this student? This cannot be undone.")) return;
    try {
      await api.delete(`/admin/students/${id}`);
      setAlert({ type: "success", message: "Student deleted successfully." });
      fetchStudents(search);
    } catch {
      setAlert({ type: "danger", message: "Delete failed." });
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">All Students</h1>
        <p className="page-subtitle">{students.length} student{students.length !== 1 ? 's' : ''} registered</p>
      </div>

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: "", message: "" })} />

      <div className="search-bar" style={{ marginBottom: 20 }}>
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Search by name, roll number, department…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => e.key === "Enter" && fetchStudents(search)}
          />
        </div>
        <button className="btn btn-primary" onClick={() => fetchStudents(search)}>Search</button>
        {search && (
          <button className="btn btn-outline" onClick={() => { setSearch(""); fetchStudents(""); }}>Clear</button>
        )}
      </div>

      <div className="card">
        {loading ? (
          <div className="spinner" />
        ) : students.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🎓</div>
            <p>No students found.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Roll No.</th>
                  <th>Department</th>
                  <th>CGPA</th>
                  <th>Resume</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.student_id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{s.full_name}</td>
                    <td style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{s.email}</td>
                    <td>{s.roll_number || "—"}</td>
                    <td>{s.department || "—"}</td>
                    <td>{s.cgpa || "—"}</td>
                    <td>
                      {s.resume_s3_key
                        ? <span className="badge badge-active">✓ Uploaded</span>
                        : <span className="badge badge-closed">None</span>
                      }
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Link to={`/admin/students/${s.student_id}/edit`} className="btn btn-outline btn-sm">
                          Edit
                        </Link>
                        <button className="btn btn-danger btn-sm" onClick={() => deleteStudent(s.student_id)}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
