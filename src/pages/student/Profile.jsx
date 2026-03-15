import { useState, useEffect } from "react";
import api from "../../services/api";
import Alert from "../../components/Alert";

export default function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [alert, setAlert] = useState({ type: "", message: "" });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/student/profile").then(r => {
      setProfile(r.data);
      setForm(r.data);
    }).catch(console.error);
  }, []);

  const handleSave = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/student/profile", form);
      setAlert({ type: "success", message: "Profile updated successfully." });
    } catch (err) {
      setAlert({ type: "danger", message: err.response?.data?.message || "Update failed." });
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async e => {
    e.preventDefault();
    if (!file) return;
    const data = new FormData();
    data.append("resume", file);
    setUploading(true);
    try {
      await api.post("/student/upload-resume", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAlert({ type: "success", message: "Resume uploaded to S3 successfully! ✅" });
      setProfile(prev => ({ ...prev, resume_s3_key: "uploaded" }));
      setFile(null);
    } catch (err) {
      setAlert({ type: "danger", message: err.response?.data?.message || "Upload failed." });
    } finally {
      setUploading(false);
    }
  };

  if (!profile) return <div className="spinner" />;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">My Profile</h1>
        <p className="page-subtitle">Manage your personal details and resume</p>
      </div>

      <Alert type={alert.type} message={alert.message} onClose={() => setAlert({ type: "", message: "" })} />

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div className="card">
          <div className="card-header">
            <span className="card-title">Personal Details</span>
          </div>
          <div className="card-body">
            <form onSubmit={handleSave}>
              {[
                { name: "full_name", label: "Full Name" },
                { name: "roll_number", label: "Roll Number" },
                { name: "department", label: "Department" },
                { name: "cgpa", label: "CGPA", type: "number" },
                { name: "skills", label: "Skills (comma-separated)" },
                { name: "phone", label: "Phone" },
              ].map(f => (
                <div className="form-group" key={f.name}>
                  <label className="form-label">{f.label}</label>
                  <input
                    type={f.type || "text"}
                    className="form-control"
                    value={form[f.name] || ""}
                    step={f.type === "number" ? "0.01" : undefined}
                    onChange={e => setForm({ ...form, [f.name]: e.target.value })}
                  />
                </div>
              ))}
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </form>
          </div>
        </div>

        <div className="card" style={{ alignSelf: 'start' }}>
          <div className="card-header">
            <span className="card-title">Resume</span>
          </div>
          <div className="card-body">
            {profile.resume_s3_key ? (
              <div style={{ padding: '12px 16px', background: 'var(--green-light)', borderRadius: 'var(--radius-sm)', marginBottom: 16, fontSize: 13, color: 'var(--green)', fontWeight: 600 }}>
                ✅ Resume on file
              </div>
            ) : (
              <div style={{ padding: '12px 16px', background: 'var(--bg)', borderRadius: 'var(--radius-sm)', marginBottom: 16, fontSize: 13, color: 'var(--text-muted)' }}>
                📄 No resume uploaded yet
              </div>
            )}
            <form onSubmit={handleUpload}>
              <div className="form-group">
                <label className="form-label">Upload PDF Resume</label>
                <input
                  type="file"
                  className="form-control"
                  accept=".pdf"
                  onChange={e => setFile(e.target.files[0])}
                />
                <p className="text-sm text-muted" style={{ marginTop: 4 }}>PDF only, max 5MB</p>
              </div>
              <button
                type="submit"
                className="btn btn-outline w-full"
                style={{ justifyContent: 'center' }}
                disabled={!file || uploading}
              >
                {uploading ? "Uploading…" : "Upload Resume"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
