import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function FundUtilizationChart({ data = [] }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm h-[320px] flex flex-col">
      <h3 className="font-bold text-sm text-[#0A192F] mb-2 font-['Outfit']">State-wise Sanctioned vs Utilized Funds (Cr ₹)</h3>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="sanctioned" name="Sanctioned" fill="#0A192F" radius={[4, 4, 0, 0]} />
            <Bar dataKey="utilization" name="Utilization %" fill="#FF9933" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
