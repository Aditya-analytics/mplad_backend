import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useDashboard } from '../../hooks/useDashboard';
import { useProjects } from '../../hooks/useProjects';
import { LeafletMap } from '../../components/common/LeafletMap';
import { formatCurrency } from '../../utils/formatCurrency';
import { ROUTES } from '../../constants/routes';

const STATE_DATA = [
  { name: "Maharashtra", works: 2480, sanctioned: "₹640 Cr", utilization: 82.4, delayed: 142, anomalies: 68, risk: "HIGH", color: "var(--risk-high)", bg: "var(--risk-high-bg)" },
  { name: "Uttar Pradesh", works: 3820, sanctioned: "₹980 Cr", utilization: 76.1, delayed: 284, anomalies: 124, risk: "CRITICAL", color: "var(--risk-critical)", bg: "var(--risk-critical-bg)" },
  { name: "Karnataka", works: 1940, sanctioned: "₹510 Cr", utilization: 84.8, delayed: 88, anomalies: 34, risk: "MODERATE", color: "var(--risk-moderate)", bg: "var(--risk-moderate-bg)" },
  { name: "Rajasthan", works: 1760, sanctioned: "₹450 Cr", utilization: 89.2, delayed: 46, anomalies: 18, risk: "LOW", color: "var(--risk-low)", bg: "var(--risk-low-bg)" },
  { name: "Tamil Nadu", works: 2150, sanctioned: "₹580 Cr", utilization: 88.5, delayed: 62, anomalies: 22, risk: "LOW", color: "var(--risk-low)", bg: "var(--risk-low-bg)" },
  { name: "West Bengal", works: 2310, sanctioned: "₹610 Cr", utilization: 79.4, delayed: 154, anomalies: 76, risk: "HIGH", color: "var(--risk-high)", bg: "var(--risk-high-bg)" },
  { name: "Gujarat", works: 1680, sanctioned: "₹440 Cr", utilization: 86.7, delayed: 52, anomalies: 24, risk: "MODERATE", color: "var(--risk-moderate)", bg: "var(--risk-moderate-bg)" },
  { name: "Madhya Pradesh", works: 2200, sanctioned: "₹570 Cr", utilization: 81.2, delayed: 110, anomalies: 52, risk: "MODERATE", color: "var(--risk-moderate)", bg: "var(--risk-moderate-bg)" }
];

export function DashboardPage() {
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const onSelectWork = outletContext?.onSelectWork;

  const { summary } = useDashboard();
  const { projects } = useProjects();

  // State selection for region details
  const [selectedState, setSelectedState] = useState(STATE_DATA[0]);

  // Hero search
  const [heroSearch, setHeroSearch] = useState('');
  const [heroResults, setHeroResults] = useState([]);
  const [showHeroDropdown, setShowHeroDropdown] = useState(false);
  const heroSearchWrapperRef = useRef(null);

  // Table filters
  const [tableSearch, setTableSearch] = useState('');
  const [stateFilter, setStateFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');

  // Animated counters
  const [counts, setCounts] = useState({ total: 0, delayed: 0, anomalies: 0 });

  useEffect(() => {
    const totalTarget = summary?.totalProjects || 18642;
    const delayedTarget = summary?.delayedProjects || 1284;
    const anomaliesTarget = summary?.flaggedAnomalies || 638;

    let step = 0;
    const steps = 30;
    const interval = setInterval(() => {
      step++;
      const progress = step / steps;
      setCounts({
        total: Math.floor(totalTarget * progress),
        delayed: Math.floor(delayedTarget * progress),
        anomalies: Math.floor(anomaliesTarget * progress),
      });
      if (step >= steps) {
        setCounts({ total: totalTarget, delayed: delayedTarget, anomalies: anomaliesTarget });
        clearInterval(interval);
      }
    }, 25);

    return () => clearInterval(interval);
  }, [summary]);

  // Handle Hero Search
  useEffect(() => {
    if (!heroSearch.trim()) {
      setHeroResults([]);
      setShowHeroDropdown(false);
      return;
    }
    const q = heroSearch.toLowerCase();
    const matches = projects.filter(
      (p) =>
        (p.projectName && p.projectName.toLowerCase().includes(q)) ||
        (p.id && p.id.toLowerCase().includes(q)) ||
        (p.district && p.district.toLowerCase().includes(q)) ||
        (p.state && p.state.toLowerCase().includes(q))
    ).slice(0, 6);

    setHeroResults(matches);
    setShowHeroDropdown(true);
  }, [heroSearch, projects]);

  useEffect(() => {
    function handleClickOutside(e) {
      if (heroSearchWrapperRef.current && !heroSearchWrapperRef.current.contains(e.target)) {
        setShowHeroDropdown(false);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  // Filtered Table Data
  const filteredWorks = projects.filter((w) => {
    const matchesSearch =
      !tableSearch ||
      (w.projectName && w.projectName.toLowerCase().includes(tableSearch.toLowerCase())) ||
      (w.id && w.id.toLowerCase().includes(tableSearch.toLowerCase())) ||
      (w.district && w.district.toLowerCase().includes(tableSearch.toLowerCase())) ||
      (w.state && w.state.toLowerCase().includes(tableSearch.toLowerCase()));

    const matchesState = stateFilter === 'ALL' || (w.state && w.state.toLowerCase() === stateFilter.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || (w.riskLevel && w.riskLevel.toUpperCase() === riskFilter.toUpperCase());

    return matchesSearch && matchesState && matchesRisk;
  });

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,Work ID,Project Description,State,District,Sanctioned,Spent,Progress,Delay,Risk Score,Risk Level\n';
    filteredWorks.forEach((w) => {
      const sanctioned = typeof w.sanctionedAmount === 'number' ? formatCurrency(w.sanctionedAmount) : (w.sanctioned || '');
      const spent = typeof w.utilizedAmount === 'number' ? formatCurrency(w.utilizedAmount) : (w.spent || '');
      const progress = w.physicalProgress !== undefined ? w.physicalProgress : (w.progress || 0);
      const delay = w.delayDays !== undefined ? w.delayDays : (w.delay || 0);
      const score = w.riskScore !== undefined ? w.riskScore : (w.score || 0);
      const risk = w.riskLevel || w.risk || 'MODERATE';

      csvContent += `"${w.id}","${w.projectName || w.title}","${w.state}","${w.district}","${sanctioned}","${spent}","${progress}%","${delay} days","${score}","${risk}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'MPLADS_AI_Anomaly_Report_2026.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleInspectStateWorks = (stateName) => {
    setStateFilter(stateName);
    const tableEl = document.getElementById('worksRegistryTableCard');
    if (tableEl) {
      tableEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="view-section active" id="view-overview">
      {/* HERO BANNER */}
      <div className="hero-banner">
        <i className="fa-solid fa-archway hero-bg-pattern"></i>
        <div className="hero-content">
          <div className="hero-tag">
            <i className="fa-solid fa-wand-magic-sparkles"></i> AI GOVERNANCE SYSTEM
          </div>
          <h1 className="hero-title">AI-Powered Intelligence for Transparent MPLADS Implementation</h1>
          <p className="hero-subtitle">
            Monitor fund allocations in real-time, detect financial anomalies, predict completion delays, and prevent duplicate works across all 543 Parliamentary constituencies.
          </p>

          <div className="hero-search-wrapper" ref={heroSearchWrapperRef}>
            <div className="hero-search-bar">
              <i className="fa-solid fa-magnifying-glass"></i>
              <input
                type="text"
                className="hero-search-input"
                id="heroSearchInput"
                placeholder="Search works, districts, MPs, sanctions or alerts (e.g. Pune, Hospital)..."
                value={heroSearch}
                onChange={(e) => setHeroSearch(e.target.value)}
                onFocus={() => { if (heroSearch.trim()) setShowHeroDropdown(true); }}
              />
              <button
                className="hero-search-btn"
                id="heroSearchBtn"
                onClick={() => {
                  if (heroResults.length > 0 && onSelectWork) {
                    onSelectWork(heroResults[0]);
                  }
                }}
              >
                Run Intelligence Search
              </button>
            </div>

            <div className={`search-results-dropdown ${showHeroDropdown ? 'show' : ''}`} id="heroSearchResults">
              <div className="search-result-group">Works & Locations</div>
              {heroResults.length === 0 ? (
                <div style={{ padding: '0.75rem 1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  No matching works found
                </div>
              ) : (
                heroResults.map((m) => (
                  <div
                    key={m.id}
                    className="search-result-item"
                    onClick={() => {
                      setShowHeroDropdown(false);
                      setHeroSearch('');
                      if (onSelectWork) onSelectWork(m);
                    }}
                  >
                    <div>
                      <div className="sri-title">{m.projectName || m.title}</div>
                      <div className="sri-sub">{m.id} · {m.district}, {m.state}</div>
                    </div>
                    <span className={`badge-risk ${(m.riskLevel || m.risk || 'moderate').toLowerCase()}`}>
                      {m.riskLevel || m.risk}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* KPI CARDS */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon navy"><i className="fa-solid fa-folder-open"></i></div>
            <span className="kpi-trend neutral"><i className="fa-solid fa-minus"></i> Active</span>
          </div>
          <div className="kpi-number">{counts.total.toLocaleString()}</div>
          <div className="kpi-label">Total Works Monitored</div>
          <div className="kpi-subtext"><i className="fa-solid fa-circle-info"></i> Across 28 States & 8 UTs</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon green"><i className="fa-solid fa-vault"></i></div>
            <span className="kpi-trend down"><i className="fa-solid fa-arrow-up"></i> 80.5%</span>
          </div>
          <div className="kpi-number">₹3,917 Cr</div>
          <div className="kpi-label">Funds Utilized</div>
          <div className="kpi-subtext"><i className="fa-solid fa-coins"></i> Total Sanctioned: ₹4,862 Cr</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon saffron"><i className="fa-solid fa-hourglass-half"></i></div>
            <span className="kpi-trend up"><i className="fa-solid fa-arrow-up"></i> 6.8%</span>
          </div>
          <div className="kpi-number">{counts.delayed.toLocaleString()}</div>
          <div className="kpi-label">Delayed Projects</div>
          <div className="kpi-subtext"><i className="fa-solid fa-clock"></i> &gt; 60 days past schedule</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top">
            <div className="kpi-icon red"><i className="fa-solid fa-triangle-exclamation"></i></div>
            <span className="kpi-trend up"><i className="fa-solid fa-arrow-up"></i> 427</span>
          </div>
          <div className="kpi-number">{counts.anomalies.toLocaleString()}</div>
          <div className="kpi-label">AI Anomalies Flagged</div>
          <div className="kpi-subtext" style={{ color: 'var(--risk-critical)', fontWeight: 600 }}>
            <i className="fa-solid fa-triangle-exclamation"></i> ₹84.6 Cr Financial Exposure
          </div>
        </div>
      </div>

      {/* STATE SCROLLER */}
      <div className="section-header">
        <h2 className="section-title"><i className="fa-solid fa-map-pin"></i> State-wise Governance Overview</h2>
        <span
          style={{ fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' }}
          onClick={() => {
            const mapEl = document.getElementById('geospatialMapCard');
            if (mapEl) mapEl.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          View Full Map <i className="fa-solid fa-arrow-right"></i>
        </span>
      </div>

      <div className="state-scroll-container" id="stateCardsScroller">
        {STATE_DATA.map((st) => (
          <div
            key={st.name}
            className={`state-card ${selectedState.name === st.name ? 'active' : ''}`}
            onClick={() => setSelectedState(st)}
          >
            <div className="state-card-header">
              <span className="state-name">{st.name}</span>
              <span className="state-risk-tag" style={{ background: st.bg, color: st.color }}>
                {st.risk}
              </span>
            </div>
            <div className="state-metric-row"><span>Total Works</span><span className="state-metric-val">{st.works.toLocaleString()}</span></div>
            <div className="state-metric-row"><span>Utilization</span><span className="state-metric-val">{st.utilization}%</span></div>
            <div className="state-metric-row"><span>Anomalies</span><span className="state-metric-val" style={{ color: 'var(--risk-critical)' }}>{st.anomalies}</span></div>
            <div className="progress-bar-sm">
              <div className="progress-fill" style={{ width: `${st.utilization}%`, background: st.color }}></div>
            </div>
          </div>
        ))}
      </div>

      {/* MAP & REGION INTELLIGENCE */}
      <div className="grid-2-1" id="geospatialMapCard">
        <div className="dashboard-card">
          <LeafletMap
            onSelectLocation={(loc) => {
              const matched = STATE_DATA.find((s) => loc.name.includes(s.name));
              if (matched) setSelectedState(matched);
            }}
          />
        </div>

        {/* Region Detail Side Card */}
        <div className="dashboard-card">
          <div className="region-detail-box" id="regionInfoBox">
            <div>
              <div className="region-detail-header">
                <div className="rd-state-name" id="rdStateName">{selectedState.name}</div>
                <span
                  className="rd-badge"
                  id="rdRiskBadge"
                  style={{ background: selectedState.bg, color: selectedState.color }}
                >
                  {selectedState.risk} RISK REGION
                </span>
              </div>
              <div className="stat-list">
                <div className="stat-item">
                  <span className="stat-label"><i className="fa-solid fa-cubes"></i> Total Works:</span>
                  <span className="stat-value" id="rdTotalWorks">{selectedState.works.toLocaleString()}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label"><i className="fa-solid fa-indian-rupee-sign"></i> Sanctioned:</span>
                  <span className="stat-value" id="rdSanctioned">{selectedState.sanctioned}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label"><i className="fa-solid fa-chart-line"></i> Utilization Rate:</span>
                  <span className="stat-value" id="rdUtilization">{selectedState.utilization}%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label"><i className="fa-solid fa-hourglass"></i> Delayed Works:</span>
                  <span className="stat-value" id="rdDelayed" style={{ color: 'var(--risk-high)' }}>{selectedState.delayed}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label"><i className="fa-solid fa-bug"></i> Active Anomalies:</span>
                  <span className="stat-value" id="rdAnomalies" style={{ color: 'var(--risk-critical)' }}>{selectedState.anomalies}</span>
                </div>
              </div>
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
              onClick={() => handleInspectStateWorks(selectedState.name)}
            >
              Inspect State Works
            </button>
          </div>
        </div>
      </div>

      {/* AI RISK ENGINE BREAKDOWN */}
      <div className="grid-1-2">
        <div className="dashboard-card">
          <h3 className="section-title"><i className="fa-solid fa-brain"></i> National AI Risk Index</h3>
          <div className="risk-gauge-container">
            <div className="gauge-circle">
              <div className="gauge-inner">
                <div className="gauge-score">72</div>
                <div className="gauge-max">/ 100 RISK</div>
              </div>
            </div>
            <span className="badge-risk critical" style={{ fontSize: '0.85rem' }}>HIGH COMPLIANCE RISK</span>

            <div className="risk-subbars">
              <div className="subbar-item">
                <div className="subbar-header">
                  <span>Financial Deviation</span>
                  <span style={{ fontWeight: 700 }}>81%</span>
                </div>
                <div className="progress-bar-sm"><div className="progress-fill" style={{ width: '81%', background: 'var(--risk-critical)' }}></div></div>
              </div>
              <div className="subbar-item">
                <div className="subbar-header">
                  <span>Execution Delay</span>
                  <span style={{ fontWeight: 700 }}>67%</span>
                </div>
                <div className="progress-bar-sm"><div className="progress-fill" style={{ width: '67%', background: 'var(--risk-high)' }}></div></div>
              </div>
              <div className="subbar-item">
                <div className="subbar-header">
                  <span>Duplicate Work Risk</span>
                  <span style={{ fontWeight: 700 }}>76%</span>
                </div>
                <div className="progress-bar-sm"><div className="progress-fill" style={{ width: '76%', background: 'var(--risk-high)' }}></div></div>
              </div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="section-title"><i className="fa-solid fa-diagram-project"></i> AI Fraud &amp; Anomaly Pipeline Architecture</h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
            Automated machine learning inference loop filtering MPLADS expenditure receipts against spatial and physical work logs.
          </p>

          <div className="ai-pipeline-steps">
            <div className="pipeline-card">
              <h4>1. Ingestion</h4>
              <p>PFMS, District Portal &amp; Geo-tag photos ingestion.</p>
            </div>
            <div className="pipeline-card">
              <h4>2. Spatial Match</h4>
              <p>Cross-references GPS coordinates for duplicate assets.</p>
            </div>
            <div className="pipeline-card">
              <h4>3. Cost Benchmarking</h4>
              <p>Standardizes DSR cost estimates against actual bills.</p>
            </div>
            <div className="pipeline-card">
              <h4>4. Risk Scoring</h4>
              <p>Random Forest &amp; Isolation Forest scoring.</p>
            </div>
            <div className="pipeline-card">
              <h4>5. Action Trigger</h4>
              <p>Generates real-time alerts for District Magistrates.</p>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', background: 'var(--ash-bg)', padding: '1rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--navy-primary)' }}>
                <i className="fa-solid fa-shield-virus" style={{ marginRight: '0.3rem' }}></i> Active Early Warnings
              </span>
              <span className="badge-risk high">4 CRITICAL PATTERNS</span>
            </div>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              System flagged 12 high-value road construction projects in Eastern UP showing identical vendor billing sequences within 48 hours.
            </p>
          </div>
        </div>
      </div>

      {/* ANOMALY & FLAGGED WORKS TABLE */}
      <div className="dashboard-card" id="worksRegistryTableCard">
        <div className="section-header">
          <h3 className="section-title"><i className="fa-solid fa-table-list"></i> High Risk &amp; Flagged Works Registry</h3>
          <button className="btn-primary" onClick={handleExportCSV}>
            <i className="fa-solid fa-file-csv"></i> Export CSV Report
          </button>
        </div>

        <div className="table-controls">
          <div className="table-search-box">
            <i className="fa-solid fa-magnifying-glass table-search-icon"></i>
            <input
              type="text"
              className="table-search-input"
              id="tableSearchInput"
              placeholder="Filter works table by ID, name, district..."
              value={tableSearch}
              onChange={(e) => setTableSearch(e.target.value)}
            />
          </div>
          <div className="filter-group">
            <select
              className="select-filter"
              id="stateFilterSelect"
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
              id="riskFilterSelect"
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
            >
              <option value="ALL">All Risk Levels</option>
              <option value="CRITICAL">Critical</option>
              <option value="HIGH">High</option>
              <option value="MODERATE">Moderate</option>
              <option value="LOW">Low</option>
            </select>
          </div>
        </div>

        <div className="table-wrapper">
          <table className="custom-table" id="worksTable">
            <thead>
              <tr>
                <th>Work ID</th>
                <th>Project Description</th>
                <th>State &amp; District</th>
                <th>Sanctioned</th>
                <th>Spent</th>
                <th>Progress</th>
                <th>Delay</th>
                <th>Risk Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody id="worksTableBody">
              {filteredWorks.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No works found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredWorks.map((w) => {
                  const sanctioned = typeof w.sanctionedAmount === 'number' ? formatCurrency(w.sanctionedAmount) : (w.sanctioned || '₹2.40 Cr');
                  const spent = typeof w.utilizedAmount === 'number' ? formatCurrency(w.utilizedAmount) : (w.spent || '₹2.10 Cr');
                  const progress = w.physicalProgress !== undefined ? w.physicalProgress : (w.progress || 45);
                  const delay = w.delayDays !== undefined ? w.delayDays : (w.delay || 0);
                  const score = w.riskScore !== undefined ? w.riskScore : (w.score || 75);
                  const risk = (w.riskLevel || w.risk || 'MODERATE').toLowerCase();

                  return (
                    <tr
                      key={w.id}
                      onClick={() => {
                        if (onSelectWork) onSelectWork(w);
                      }}
                    >
                      <td style={{ fontWeight: 700, color: 'var(--navy-primary)' }}>{w.id}</td>
                      <td>{w.projectName || w.title}</td>
                      <td>{w.state} ({w.district})</td>
                      <td>{sanctioned}</td>
                      <td>{spent}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span>{progress}%</span>
                          <div className="progress-bar-sm" style={{ width: '50px' }}>
                            <div className="progress-fill" style={{ width: `${progress}%`, background: 'var(--navy-primary)' }}></div>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: delay > 60 ? 'var(--risk-critical)' : 'var(--text-main)', fontWeight: 600 }}>
                        +{delay}d
                      </td>
                      <td>
                        <span className={`badge-risk ${risk}`}>
                          {score} / 100
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-action-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onSelectWork) onSelectWork(w);
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

export default DashboardPage;
