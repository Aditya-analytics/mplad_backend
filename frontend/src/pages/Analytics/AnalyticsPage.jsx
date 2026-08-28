import React, { useEffect, useRef, useState } from 'react';

export function AnalyticsPage() {
  const [timePeriod, setTimePeriod] = useState('30');

  const fundCanvasRef = useRef(null);
  const monthCanvasRef = useRef(null);
  const trendCanvasRef = useRef(null);

  const trendChartInstanceRef = useRef(null);

  useEffect(() => {
    if (typeof window.Chart === 'undefined') return;

    // Fund Comparison Chart
    let fundChart;
    if (fundCanvasRef.current) {
      const ctx = fundCanvasRef.current.getContext('2d');
      fundChart = new window.Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['MH', 'UP', 'KA', 'RJ', 'TN', 'WB', 'GJ'],
          datasets: [
            { label: 'Sanctioned (Cr)', data: [640, 980, 510, 450, 580, 610, 440], backgroundColor: '#0A192F' },
            { label: 'Utilized (Cr)', data: [527, 745, 432, 401, 513, 484, 381], backgroundColor: '#138808' }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { position: 'top' } }
        }
      });
    }

    // Monthly Velocity Chart
    let monthChart;
    if (monthCanvasRef.current) {
      const ctx = monthCanvasRef.current.getContext('2d');
      monthChart = new window.Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Q1 2025', 'Q2 2025', 'Q3 2025', 'Q4 2025', 'Q1 2026', 'Q2 2026'],
          datasets: [{
            label: 'Disbursement (Cr ₹)',
            data: [1120, 1450, 1890, 2400, 3100, 3917],
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
      if (fundChart) fundChart.destroy();
      if (monthChart) monthChart.destroy();
    };
  }, []);

  // Trend Chart with dynamic time period
  useEffect(() => {
    if (!trendCanvasRef.current || typeof window.Chart === 'undefined') return;

    if (trendChartInstanceRef.current) {
      trendChartInstanceRef.current.destroy();
    }

    let labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
    let anomalyData = [12.4, 14.1, 11.8, 16.5, 18.2, 15.0, 19.8, 22.1];
    let delayData = [24.1, 26.5, 23.8, 28.0, 31.2, 29.5, 33.0, 35.4];

    if (timePeriod === '90') {
      labels = ['Jun W1', 'Jun W2', 'Jun W3', 'Jun W4', 'Jul W1', 'Jul W2', 'Jul W3', 'Jul W4', 'Aug W1', 'Aug W2', 'Aug W3', 'Aug W4'];
      anomalyData = [15.1, 14.8, 16.2, 15.9, 18.1, 17.5, 19.2, 18.8, 20.4, 21.1, 21.8, 22.1];
      delayData = [28.2, 29.0, 29.8, 30.5, 31.0, 32.1, 33.4, 33.9, 34.2, 34.8, 35.1, 35.4];
    } else if (timePeriod === '180') {
      labels = ['Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
      anomalyData = [11.8, 16.5, 18.2, 15.0, 19.8, 22.1];
      delayData = [23.8, 28.0, 31.2, 29.5, 33.0, 35.4];
    } else if (timePeriod === '365') {
      labels = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug'];
      anomalyData = [9.4, 10.2, 11.0, 10.8, 12.4, 14.1, 11.8, 16.5, 18.2, 15.0, 19.8, 22.1];
      delayData = [18.2, 19.5, 20.4, 22.1, 24.1, 26.5, 23.8, 28.0, 31.2, 29.5, 33.0, 35.4];
    }

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
            backgroundColor: 'rgba(220, 38, 38, 0.1)',
            fill: true,
            tension: 0.3,
          },
          {
            label: 'Schedule Delay Rate (%)',
            data: delayData,
            borderColor: '#D97706',
            backgroundColor: 'rgba(217, 119, 6, 0.05)',
            fill: false,
            tension: 0.3,
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } }
      }
    });

    return () => {
      if (trendChartInstanceRef.current) {
        trendChartInstanceRef.current.destroy();
      }
    };
  }, [timePeriod]);

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
