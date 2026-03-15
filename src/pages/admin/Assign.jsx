import { useState, useEffect } from "react";
import api from "../../services/api";
import Alert from "../../components/Alert";

export default function AdminAssign() {
  const [students, setStudents] = useState([]);
  const [faculty, setFaculty] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [form, setForm] = useState({ student_id: "", faculty_id: "", notes: "" });
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);

  const fetchAll = () => {
    api.get("/admin/students").then(r => setStudents(r.data)).catch(console.error);
    api.get("/admin/faculty").then(r => setFaculty(r.data)).catch(console.error);
    api.get("/admin/assignments").then(r => setAssignments(r.data)).catch(console.error);
  };

  useEffect(fetchAll, []);

  const handleAssign = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/admin/assignments", form);
      setAlert({ type: "success", message: "Assignment created successfully." });
      setForm({ student_id: "", faculty_id: "", notes: "" });
      fetchAll();
    } catch (err) {
      setAlert({ type: "danger", message: err.response?.data?.message || "Failed to create assignment." });
    } finally {
      setLoading(false);
    }
  };

  const removeAssignment = async (id) => {
    if (!window.confirm("Remove this assignment?")) return;
    try {
      await api.delete(`/admin/assignments/${id}`);
      setAlert({ type: "success", message: "Assignment removed." });
      fetchAll();
    } catch {
      setAlert({ type: "danger", message: "Remove failed." });
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Student–Faculty Assignments</h1>
        <p className="page-subtitle">Assign faculty mentors to students for placement guidance</p>
      </div>

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: "", message: "" })} />

      <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Form */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">New Assignment</span>
          </div>
          <div className="card-body">
            <form onSubmit={handleAssign}>
              <div className="form-group">
                <label className="form-label">Student</label>
                <select
                  className="form-control"
                  required
                  value={form.student_id}
                  onChange={e => setForm({ ...form, student_id: e.target.value })}
                >
                  <option value="">Select student…</option>
                  {students.map(s => (
                    <option key={s.student_id} value={s.student_id}>
                      {s.full_name} {s.roll_number ? `(${s.roll_number})` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Faculty</label>
                <select
                  className="form-control"
                  required
                  value={form.faculty_id}
                  onChange={e => setForm({ ...form, faculty_id: e.target.value })}
                >
                  <option value="">Select faculty…</option>
                  {faculty.map(f => (
                    <option key={f.faculty_id} value={f.faculty_id}>
                      {f.full_name} {f.department ? `· ${f.department}` : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Notes (optional)</label>
                <textarea
                  className="form-control"
                  rows={2}
                  placeholder="Any notes for this assignment…"
                  value={form.notes}
                  onChange={e => setForm({ ...form, notes: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-primary w-full" style={{ justifyContent: 'center' }} disabled={loading}>
                {loading ? "Assigning…" : "Assign"}
              </button>
            </form>
          </div>
        </div>

        {/* Assignments list */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Current Assignments ({assignments.length})</span>
          </div>
          {assignments.length === 0 ? (
            <div className="empty-state" style={{ padding: 40 }}>
              <div className="empty-icon">🔗</div>
              <p>No assignments created yet.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Roll No.</th>
                    <th>Faculty</th>
                    <th>Assigned On</th>
                    <th>Notes</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map(a => (
                    <tr key={a.assignment_id}>
                      <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{a.student_name}</td>
                      <td>{a.roll_number || "—"}</td>
                      <td>{a.faculty_name}</td>
                      <td>{new Date(a.assigned_at).toLocaleDateString()}</td>
                      <td style={{ fontSize: 12, color: 'var(--text-muted)' }}>{a.notes || "—"}</td>
                      <td>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => removeAssignment(a.assignment_id)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
