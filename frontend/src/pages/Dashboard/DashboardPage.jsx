import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext, useNavigate } from 'react-router-dom';
import { useDashboard } from '../../hooks/useDashboard';
import { useProjects } from '../../hooks/useProjects';
import { LeafletMap } from '../../components/common/LeafletMap';
import { formatCurrency } from '../../utils/formatCurrency';
import { ROUTES } from '../../constants/routes';

export function DashboardPage() {
  const navigate = useNavigate();
  const outletContext = useOutletContext();
  const onSelectWork = outletContext?.onSelectWork;

  const { summary, riskDist, stateMetrics, geospatialData, nationalRisk } = useDashboard();
  const { projects } = useProjects();

  // State selection for region details
  const [selectedState, setSelectedState] = useState(null);

  // Derive rich state objects from backend payloads for UI rendering
  const displayStates = (stateMetrics || []).map(sm => {
    const geo = (geospatialData || []).find(g => g.name === sm.state) || {};
    const riskScore = geo.riskScore || 50;
    let riskStr = "MODERATE";
    let color = "var(--risk-moderate)";
    let bg = "var(--risk-moderate-bg)";
    
    if (riskScore > 75) { riskStr = "CRITICAL"; color = "var(--risk-critical)"; bg = "var(--risk-critical-bg)"; }
    else if (riskScore > 50) { riskStr = "HIGH"; color = "var(--risk-high)"; bg = "var(--risk-high-bg)"; }
    else if (riskScore < 30) { riskStr = "LOW"; color = "var(--risk-low)"; bg = "var(--risk-low-bg)"; }
    
    return {
      name: sm.state,
      works: sm.works || 0,
      sanctioned: sm.sanctioned || "₹0 Cr", 
      utilization: sm.utilization || 0,
      delayed: sm.delayed || 0, 
      anomalies: sm.anomalies,
      risk: riskStr,
      score: riskScore,
      color,
      bg,
      lat: geo.coordinates ? geo.coordinates[1] : 0,
      lng: geo.coordinates ? geo.coordinates[0] : 0
    };
  });

  // Set initial selected state once displayStates loads
  useEffect(() => {
    if (displayStates && displayStates.length > 0 && !selectedState) {
      setSelectedState(displayStates[0]);
    }
  }, [displayStates, selectedState]);

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


  // Handle Map Selection
  const handleMapSelect = (loc) => {
    const matched = displayStates.find((s) => loc.name.includes(s.name));
    if (matched) setSelectedState(matched);
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

          <div style={{ marginTop: '1.5rem' }}>
            <button
              className="hero-search-btn"
              style={{ fontSize: '1rem', padding: '0.8rem 1.8rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
              onClick={() => {
                const tableEl = document.getElementById('worksRegistryTableCard');
                if (tableEl) tableEl.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <i className="fa-solid fa-play"></i> Start Monitoring Work
            </button>
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
          <div className="kpi-number">{summary?.totalDisbursed || '₹0 Cr'}</div>
          <div className="kpi-label">Funds Disbursed</div>
          <div className="kpi-subtext"><i className="fa-solid fa-coins"></i> Live aggregation from master DB</div>
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
            <span className="kpi-trend up"><i className="fa-solid fa-arrow-up"></i> Alert</span>
          </div>
          <div className="kpi-number">{counts.anomalies.toLocaleString()}</div>
          <div className="kpi-label">AI Anomalies Flagged</div>
          <div className="kpi-subtext" style={{ color: 'var(--risk-critical)', fontWeight: 600 }}>
            <i className="fa-solid fa-triangle-exclamation"></i> Requires Immediate Audit
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
        {displayStates.map((st) => (
          <div
            key={st.name}
            className={`state-card ${selectedState?.name === st.name ? 'active' : ''}`}
            onClick={() => setSelectedState(st)}
          >
            <div className="state-card-header">
              <span className="state-name">{st.name}</span>
              <span className="state-risk-tag" style={{ background: st.bg, color: st.color }}>
                {st.risk}
              </span>
            </div>
            <div className="state-metric-row"><span>Sanctioned</span><span className="state-metric-val">{st.sanctioned}</span></div>
            <div className="state-metric-row"><span>Utilization</span><span className="state-metric-val">{st.utilization}%</span></div>
            <div className="state-metric-row"><span>Total Works</span><span className="state-metric-val">{st.works}</span></div>
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
            locations={displayStates}
            onSelectLocation={handleMapSelect}
          />
        </div>

        {/* Region Detail Side Card */}
        <div className="dashboard-card">
          <div className="region-detail-box" id="regionInfoBox">
            <div>
              <div className="region-detail-header">
                <div className="rd-state-name" id="rdStateName">{selectedState?.name || 'Loading...'}</div>
                <span
                  className="rd-badge"
                  id="rdRiskBadge"
                  style={{ background: selectedState?.bg || '#ccc', color: selectedState?.color || '#000' }}
                >
                  {selectedState?.risk || 'UNKNOWN'} RISK REGION
                </span>
              </div>
              <div className="stat-list">
                <div className="stat-item">
                  <span className="stat-label"><i className="fa-solid fa-cubes"></i> Total Works:</span>
                  <span className="stat-value" id="rdTotalWorks">{selectedState?.works?.toLocaleString?.() || selectedState?.works || '0'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label"><i className="fa-solid fa-indian-rupee-sign"></i> Sanctioned:</span>
                  <span className="stat-value" id="rdSanctioned">{selectedState?.sanctioned || 'N/A'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label"><i className="fa-solid fa-chart-line"></i> Utilization Rate:</span>
                  <span className="stat-value" id="rdUtilization">{selectedState?.utilization || '0'}%</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label"><i className="fa-solid fa-hourglass"></i> Delayed Works:</span>
                  <span className="stat-value" id="rdDelayed" style={{ color: 'var(--risk-high)' }}>{selectedState?.delayed || '0'}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label"><i className="fa-solid fa-bug"></i> Active Anomalies:</span>
                  <span className="stat-value" id="rdAnomalies" style={{ color: 'var(--risk-critical)' }}>{selectedState?.anomalies || '0'}</span>
                </div>
              </div>
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', marginTop: '1rem' }}
              onClick={() => handleInspectStateWorks(selectedState?.name)}
              disabled={!selectedState}
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
                <div className="gauge-score">{nationalRisk?.overall_score || 0}</div>
                <div className="gauge-max">/ 100 RISK</div>
              </div>
            </div>
            <span className="badge-risk critical" style={{ fontSize: '0.85rem' }}>HIGH COMPLIANCE RISK</span>

            <div className="risk-subbars">
              <div className="subbar-item">
                <div className="subbar-header">
                  <span>Financial Deviation</span>
                  <span style={{ fontWeight: 700 }}>{nationalRisk?.financial_score || 0}%</span>
                </div>
                <div className="progress-bar-sm"><div className="progress-fill" style={{ width: `${nationalRisk?.financial_score || 0}%`, background: 'var(--risk-critical)' }}></div></div>
              </div>
              <div className="subbar-item">
                <div className="subbar-header">
                  <span>Execution Delay</span>
                  <span style={{ fontWeight: 700 }}>{nationalRisk?.delay_score || 0}%</span>
                </div>
                <div className="progress-bar-sm"><div className="progress-fill" style={{ width: `${nationalRisk?.delay_score || 0}%`, background: 'var(--risk-high)' }}></div></div>
              </div>
              <div className="subbar-item">
                <div className="subbar-header">
                  <span>Duplicate Work Risk</span>
                  <span style={{ fontWeight: 700 }}>{nationalRisk?.duplicate_score || 0}%</span>
                </div>
                <div className="progress-bar-sm"><div className="progress-fill" style={{ width: `${nationalRisk?.duplicate_score || 0}%`, background: 'var(--risk-high)' }}></div></div>
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
