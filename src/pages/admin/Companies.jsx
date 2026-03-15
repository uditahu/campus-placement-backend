import { useState, useEffect } from "react";
import api from "../../services/api";

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/admin/companies")
      .then(r => setCompanies(r.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">All Companies</h1>
        <p className="page-subtitle">{companies.length} company{companies.length !== 1 ? 'ies' : ''} registered</p>
      </div>

      <div className="card">
        {loading ? <div className="spinner" /> : companies.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🏢</div>
            <p>No companies registered yet.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Email</th>
                  <th>Industry</th>
                  <th>Website</th>
                  <th>Contact</th>
                </tr>
              </thead>
              <tbody>
                {companies.map(c => (
                  <tr key={c.company_id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.company_name}</td>
                    <td style={{ fontSize: 12.5, color: 'var(--text-muted)' }}>{c.email}</td>
                    <td>{c.industry || "—"}</td>
                    <td>
                      {c.website
                        ? <a href={c.website.startsWith('http') ? c.website : `https://${c.website}`}
                             target="_blank" rel="noreferrer"
                             style={{ color: 'var(--blue)', fontSize: 13 }}>
                            {c.website}
                          </a>
                        : "—"}
                    </td>
                    <td>{c.contact_person || "—"}</td>
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
