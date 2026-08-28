import React, { useEffect, useRef, useState } from 'react';

const DEFAULT_LOCATIONS = [
  { name: 'Maharashtra (Pune)', lat: 18.5204, lng: 73.8567, risk: 'CRITICAL', score: 88, works: 2480, utilization: 82.4, delay: 142 },
  { name: 'Uttar Pradesh (Lucknow)', lat: 26.8467, lng: 80.9462, risk: 'HIGH', score: 82, works: 3820, utilization: 76.1, delay: 284 },
  { name: 'Karnataka (Belagavi)', lat: 15.8497, lng: 74.4977, risk: 'MODERATE', score: 54, works: 1940, utilization: 84.8, delay: 88 },
  { name: 'Rajasthan (Jaipur)', lat: 26.9124, lng: 75.7873, risk: 'LOW', score: 18, works: 1760, utilization: 89.2, delay: 46 },
  { name: 'West Bengal (Kolkata)', lat: 22.5726, lng: 88.3639, risk: 'CRITICAL', score: 91, works: 2310, utilization: 79.4, delay: 154 },
  { name: 'Tamil Nadu (Chennai)', lat: 13.0827, lng: 80.2707, risk: 'LOW', score: 26, works: 2150, utilization: 88.5, delay: 62 },
  { name: 'Gujarat (Ahmedabad)', lat: 23.0225, lng: 72.5714, risk: 'MODERATE', score: 62, works: 1680, utilization: 86.7, delay: 52 },
];

export function LeafletMap({ height = '420px', showControls = true, onSelectLocation, locations = [] }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);
  const [activeLayer, setActiveLayer] = useState('risk');

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (typeof window.L === 'undefined') return;

    if (!mapInstanceRef.current) {
      const map = window.L.map(mapContainerRef.current, {
        zoomControl: true,
        attributionControl: true,
      }).setView([20.5937, 78.9629], 5);

      window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '© OpenStreetMap contributors',
      }).addTo(map);

      layerGroupRef.current = window.L.layerGroup().addTo(map);
      mapInstanceRef.current = map;
    }

    const L = window.L;
    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    const dataToRender = locations.length > 0 ? locations : DEFAULT_LOCATIONS;

    dataToRender.forEach((loc) => {
      let markerColor = '#10B981';
      let radius = 9;
      
      // Fallback variables if using old mock format vs new real format
      const lat = loc.coordinates ? loc.coordinates[1] : loc.lat;
      const lng = loc.coordinates ? loc.coordinates[0] : loc.lng;
      const score = loc.riskScore || loc.score || 0;
      let riskStr = loc.risk || 'MODERATE';
      if (!loc.risk && score > 75) riskStr = 'CRITICAL';
      else if (!loc.risk && score > 50) riskStr = 'HIGH';
      else if (!loc.risk && score > 25) riskStr = 'MODERATE';
      else if (!loc.risk) riskStr = 'LOW';
      
      const worksCount = loc.works !== undefined ? loc.works : 0;
      const util = loc.utilization !== undefined ? loc.utilization : 80;
      const delays = loc.delayed !== undefined ? loc.delayed : (loc.delay || 0);

      let metricText = `Risk Score: <b>${score}/100</b>`;

      if (activeLayer === 'risk') {
        markerColor = riskStr === 'CRITICAL' ? '#DC2626' : riskStr === 'HIGH' ? '#EA580C' : riskStr === 'MODERATE' ? '#D97706' : '#10B981';
        radius = riskStr === 'CRITICAL' ? 12 : 9;
        metricText = `Risk Level: <b>${riskStr} (${score}/100)</b>`;
      } else if (activeLayer === 'utilization') {
        markerColor = util > 85 ? '#138808' : util > 80 ? '#3B82F6' : '#DC2626';
        radius = 10;
        metricText = `Fund Utilization: <b>${util}%</b>`;
      } else if (activeLayer === 'delays') {
        markerColor = delays > 100 ? '#DC2626' : delays > 50 ? '#EA580C' : '#10B981';
        radius = delays > 100 ? 12 : 8;
        metricText = `Delayed Works: <b>${delays} projects</b>`;
      }

      const circle = L.circleMarker([lat, lng], {
        color: markerColor,
        fillColor: markerColor,
        fillOpacity: 0.75,
        weight: 2,
        radius,
      });

      circle.bindPopup(`
        <div style="font-family:'Inter',sans-serif; padding:4px;">
          <h4 style="margin:0 0 0.3rem; color:#0A192F; font-size:0.95rem; font-weight:700;">${loc.name}</h4>
          <div style="font-size:0.8rem; color:#475569; margin-bottom:2px;">${metricText}</div>
          <div style="font-size:0.8rem; color:#475569;">Active Works: <b>${loc.works.toLocaleString()}</b></div>
        </div>
      `);

      circle.on('click', () => {
        if (onSelectLocation) onSelectLocation(loc);
      });

      circle.addTo(layerGroup);
    });

    return () => {
      // Keep map instance alive unless unmounted
    };
  }, [activeLayer, onSelectLocation]);

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div>
      {showControls && (
        <div className="map-card-header">
          <h3 className="section-title">
            <i className="fa-solid fa-earth-asia"></i> National Geospatial Risk Map
          </h3>
          <div className="map-controls">
            <button
              className={`map-layer-btn ${activeLayer === 'risk' ? 'active' : ''}`}
              onClick={() => setActiveLayer('risk')}
            >
              Risk Heatmap
            </button>
            <button
              className={`map-layer-btn ${activeLayer === 'utilization' ? 'active' : ''}`}
              onClick={() => setActiveLayer('utilization')}
            >
              Utilization %
            </button>
            <button
              className={`map-layer-btn ${activeLayer === 'delays' ? 'active' : ''}`}
              onClick={() => setActiveLayer('delays')}
            >
              Delays
            </button>
          </div>
        </div>
      )}

      <div ref={mapContainerRef} style={{ width: '100%', height, borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}></div>

      {showControls && (
        <div className="map-legend">
          <span style={{ fontWeight: 700 }}>Risk Index:</span>
          <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--risk-critical)' }}></div> Critical</div>
          <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--risk-high)' }}></div> High</div>
          <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--risk-moderate)' }}></div> Moderate</div>
          <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--risk-low)' }}></div> Low Risk</div>
        </div>
      )}
    </div>
  );
}

export default LeafletMap;
