import React, { useState } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useProjects } from '../../hooks/useProjects';
import { formatCurrency } from '../../utils/formatCurrency';

export function ProjectsPage() {
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const onSelectWork = outletContext?.onSelectWork;

  const { projects } = useProjects();
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');

  const filteredProjects = projects.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !search ||
      (p.projectName && p.projectName.toLowerCase().includes(q)) ||
      (p.id && p.id.toLowerCase().includes(q)) ||
      (p.district && p.district.toLowerCase().includes(q)) ||
      (p.state && p.state.toLowerCase().includes(q));

    const matchesState = stateFilter === 'ALL' || (p.state && p.state.toLowerCase() === stateFilter.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || (p.riskLevel && p.riskLevel.toUpperCase() === riskFilter.toUpperCase());

    return matchesSearch && matchesState && matchesRisk;
  });

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,Work ID,Title,State,Constituency,Sanctioned,Spent,Risk Level,Status\n';
    filteredProjects.forEach((p) => {
      const sanctioned = typeof p.sanctionedAmount === 'number' ? formatCurrency(p.sanctionedAmount) : (p.sanctioned || '');
      const spent = typeof p.utilizedAmount === 'number' ? formatCurrency(p.utilizedAmount) : (p.spent || '');
      csvContent += `"${p.id}","${p.projectName}","${p.state}","${p.constituency || p.district}","${sanctioned}","${spent}","${p.riskLevel || 'MODERATE'}","${p.status || 'ACTIVE'}"\n`;
    });
    const link = document.createElement('a');
    link.href = encodeURI(csvContent);
    link.download = 'MPLADS_Comprehensive_Works_Registry.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="view-section active" id="view-works-monitoring">
      <div className="section-header">
        <h2 className="section-title">
          <i className="fa-solid fa-list-check"></i> Comprehensive Works Registry
        </h2>
        <button className="btn-primary" onClick={handleExportCSV}>
          <i className="fa-solid fa-file-csv"></i> Export CSV Report
        </button>
      </div>

      <div className="dashboard-card">
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.2rem' }}>
          Master index of all sanctioned constituency projects under MPLADS nationwide.
        </p>

        <div className="table-controls">
          <div className="table-search-box">
            <i className="fa-solid fa-magnifying-glass table-search-icon"></i>
            <input
              type="text"
              className="table-search-input"
              placeholder="Search works by ID, title, MP, district..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <select
              className="select-filter"
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
            >
              <option value="ALL">All States</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="West Bengal">West Bengal</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
            </select>

            <select
              className="select-filter"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CRITICAL">Critical Risk</option>
              <option value="HIGH">High Risk</option>
              <option value="MODERATE">Moderate Risk</option>
              <option value="LOW">Low Risk</option>
            </select>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="custom-table" id="fullWorksTable">
            <thead>
              <tr>
                <th>Work ID</th>
                <th>Title</th>
                <th>State &amp; District</th>
                <th>MP Constituency</th>
                <th>Sanctioned Budget</th>
                <th>Risk &amp; Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No works found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProjects.map((p) => {
                  const sanctioned = typeof p.sanctionedAmount === 'number' ? formatCurrency(p.sanctionedAmount) : (p.sanctioned || '₹2.40 Cr');
                  const risk = (p.riskLevel || 'MODERATE').toLowerCase();

                  return (
                    <tr
                      key={p.id}
                      onClick={() => {
                        if (onSelectWork) onSelectWork(p);
                      }}
                    >
                      <td style={{ fontWeight: 700, color: 'var(--navy-primary)' }}>{p.id}</td>
                      <td>{p.projectName}</td>
                      <td>{p.state} ({p.district})</td>
                      <td>{p.constituency || `${p.district} Central`}</td>
                      <td style={{ fontWeight: 600 }}>{sanctioned}</td>
                      <td>
                        <span className={`badge-risk ${risk}`}>
                          {p.riskLevel || p.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-action-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSelectWork) onSelectWork(p);
                          }}
                        >
                          Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

export default ProjectsPage;
