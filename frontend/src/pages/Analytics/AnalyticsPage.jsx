import React, { useEffect, useRef, useState } from 'react';
import { analyticsService } from '../../services/analyticsService';

export function AnalyticsPage() {
  const [timePeriod, setTimePeriod] = useState('30');
  const [analyticsData, setAnalyticsData] = useState(null);

  const fundCanvasRef = useRef(null);
  const monthCanvasRef = useRef(null);
  const trendCanvasRef = useRef(null);

  const trendChartInstanceRef = useRef(null);
  const fundChartInstanceRef = useRef(null);
  const monthChartInstanceRef = useRef(null);

  useEffect(() => {
    async function loadData() {
      const [monthly, statesData, trends] = await Promise.all([
        analyticsService.fetchMonthlyExpenditure(),
        analyticsService.fetchStateExpenditure(),
        analyticsService.fetchTrendRisk()
      ]);
      setAnalyticsData({ monthly, states: statesData, trends });
    }
    loadData();
  }, []);

  useEffect(() => {
    if (!analyticsData || typeof window.Chart === 'undefined') return;

    // State Expenditure Breakdown Chart (Sanctioned vs Utilized)
    if (fundChartInstanceRef.current) fundChartInstanceRef.current.destroy();
    if (fundCanvasRef.current) {
      const ctx = fundCanvasRef.current.getContext('2d');
      const states = analyticsData.states || [];
      fundChartInstanceRef.current = new window.Chart(ctx, {
        type: 'bar',
        data: {
          labels: states.map(s => s.state.length > 15 ? s.state.substring(0, 15) + '...' : s.state),
          datasets: [
            { label: 'Sanctioned (Cr)', data: states.map(s => s.sanctioned / 10000000), backgroundColor: '#0A192F' },
            { label: 'Utilized (Cr)', data: states.map(s => s.utilized / 10000000), backgroundColor: '#138808' }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'top' } }
        }
      });
    }

    // Monthly Expenditure Chart (formerly Velocity)
    if (monthChartInstanceRef.current) monthChartInstanceRef.current.destroy();
    if (monthCanvasRef.current) {
      const ctx = monthCanvasRef.current.getContext('2d');
      const months = analyticsData.monthly || [];
      monthChartInstanceRef.current = new window.Chart(ctx, {
        type: 'line',
        data: {
          labels: months.map(m => m.month),
          datasets: [{
            label: 'Sanctioned (Cr ₹)',
            data: months.map(m => m.sanctioned),
            borderColor: '#FF9933',
            backgroundColor: 'rgba(255, 153, 51, 0.1)',
            fill: true,
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'top' } }
        }
      });
    }

    return () => {
      if (fundChartInstanceRef.current) fundChartInstanceRef.current.destroy();
      if (monthChartInstanceRef.current) monthChartInstanceRef.current.destroy();
    };
  }, [analyticsData]);

  // Trend Chart
  useEffect(() => {
    if (!analyticsData || !trendCanvasRef.current || typeof window.Chart === 'undefined') return;

    if (trendChartInstanceRef.current) {
      trendChartInstanceRef.current.destroy();
    }

    const trends = analyticsData.trends || [];
    // Currently ignores timePeriod dropdown and shows backend data
    let labels = trends.map(t => t.label);
    let anomalyData = trends.map(t => t.anomalyRate);
    let delayData = trends.map(t => t.delayRate);

    const ctx = trendCanvasRef.current.getContext('2d');
    trendChartInstanceRef.current = new window.Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'AI Flagged Anomaly Rate (%)',
            data: anomalyData,
            borderColor: '#DC2626',
            backgroundColor: 'transparent',
            tension: 0.4,
            borderWidth: 2
          },
          {
            label: 'Project Delay Rate (%)',
            data: delayData,
            borderColor: '#F59E0B',
            backgroundColor: 'transparent',
            tension: 0.4,
            borderWidth: 2,
            borderDash: [5, 5]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { position: 'top' },
          tooltip: {
            mode: 'index',
            intersect: false,
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: { display: true, text: 'Risk Percentage (%)' }
          }
        }
      }
    });

    return () => {
      if (trendChartInstanceRef.current) trendChartInstanceRef.current.destroy();
    };
  }, [timePeriod, analyticsData]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* SECTION 1: FUND UTILIZATION */}
      <section className="view-section active" id="view-fund-utilization">
        <div className="section-header">
          <h2 className="section-title">
            <i className="fa-solid fa-indian-rupee-sign"></i> Fund Utilization Analytics
          </h2>
        </div>

        <div className="chart-grid">
          <div className="dashboard-card">
            <h3 className="section-title">
              <i className="fa-solid fa-chart-bar"></i> Sanctioned vs Utilized (Cr ₹)
            </h3>
            <div className="chart-container">
              <canvas ref={fundCanvasRef} id="fundComparisonChart"></canvas>
            </div>
          </div>

          <div className="dashboard-card">
            <h3 className="section-title">
              <i className="fa-solid fa-chart-area"></i> Monthly Expenditure Velocity
            </h3>
            <div className="chart-container">
              <canvas ref={monthCanvasRef} id="monthlyExpenditureChart"></canvas>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: NATIONAL RISK TREND */}
      <section className="view-section active" id="view-analytics">
        <div className="section-header">
          <h2 className="section-title">
            <i className="fa-solid fa-chart-line"></i> National MPLADS Risk Trend
          </h2>
          <div className="time-btn-group">
            <button
              className={`time-btn ${timePeriod === '30' ? 'active' : ''}`}
              onClick={() => setTimePeriod('30')}
            >
              30 Days
            </button>
            <button
              className={`time-btn ${timePeriod === '90' ? 'active' : ''}`}
              onClick={() => setTimePeriod('90')}
            >
              90 Days
            </button>
            <button
              className={`time-btn ${timePeriod === '180' ? 'active' : ''}`}
              onClick={() => setTimePeriod('180')}
            >
              6 Months
            </button>
            <button
              className={`time-btn ${timePeriod === '365' ? 'active' : ''}`}
              onClick={() => setTimePeriod('365')}
            >
              1 Year
            </button>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="chart-container" style={{ height: '350px' }}>
            <canvas ref={trendCanvasRef} id="trendChart"></canvas>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AnalyticsPage;
