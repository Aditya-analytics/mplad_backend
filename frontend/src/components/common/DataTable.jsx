import React from 'react';

export function DataTable({ columns = [], data = [], onRowClick, emptyMessage = 'No data available.' }) {
  if (data.length === 0) {
    return (
      <div className="p-8 text-center text-xs text-slate-500 bg-white border border-slate-200 rounded-lg">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto border border-slate-200 rounded-lg bg-white shadow-sm">
      <table className="w-full text-left text-xs border-collapse">
        <thead>
          <tr className="bg-[#0A192F] text-white">
            {columns.map((col) => (
              <th key={col.key || col.header} className="p-3 font-semibold whitespace-nowrap">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row, idx) => (
            <tr
              key={row.id || idx}
              onClick={() => onRowClick && onRowClick(row)}
              className={`transition-colors ${onRowClick ? 'cursor-pointer hover:bg-amber-50/50' : 'hover:bg-slate-50'}`}
            >
              {columns.map((col) => (
                <td key={col.key || col.header} className="p-3 whitespace-nowrap text-slate-700">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
