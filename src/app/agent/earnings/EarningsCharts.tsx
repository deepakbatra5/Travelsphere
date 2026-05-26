"use client"

import React from 'react'

type MonthlyRow = [string, { agent: number; tours: number }]

export default function EarningsCharts({ monthlyRows, weeklyRows, tripRows }: { monthlyRows: MonthlyRow[]; weeklyRows: Array<[string, number]>; tripRows: Array<[string, number]> }) {
  const maxMonthly = Math.max(1, ...monthlyRows.map(([, r]) => r.agent))
  const maxWeekly = Math.max(1, ...weeklyRows.map(([, v]) => v))
  const maxTrip = Math.max(1, ...tripRows.map(([, v]) => v))

  return (
    <div className="space-y-6">
      {/* Monthly bar comparison with percent deltas */}
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Monthly Earnings — last {monthlyRows.length} months</h3>
        <div className="flex flex-col gap-3">
          <div className="flex items-end gap-3 overflow-x-auto py-1">
            {monthlyRows.map(([label, row], idx) => {
              const height = Math.max(8, (row.agent / maxMonthly) * 120)
              const prev = monthlyRows[idx - 1]?.[1].agent ?? row.agent
              const delta = prev === 0 ? 0 : Math.round(((row.agent - prev) / Math.max(1, prev)) * 100)
              const positive = delta >= 0
              return (
                <div key={label} className="flex flex-col items-center min-w-20">
                  <div className="relative flex items-end">
                    <div className={`w-10 rounded-t-lg ${positive ? 'bg-emerald-500' : 'bg-red-400'}`} style={{ height }} />
                    <div className="absolute -top-6 text-xs font-semibold" title={`${delta}%`}>{positive ? `+${delta}%` : `${delta}%`}</div>
                  </div>
                  <div className="mt-2 text-xs text-slate-600 text-center">{label}</div>
                </div>
              )
            })}
          </div>
          <div className="text-right text-xs text-slate-500">Values: Rs (rounded)</div>
        </div>
      </div>

      {/* Weekly line spark */}
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Weekly Trend (earnings)</h3>
        <div className="w-full h-36">
          <svg viewBox={`0 0 ${weeklyRows.length * 30} 100`} preserveAspectRatio="none" className="w-full h-full">
            {/* grid lines */}
            {[0, 25, 50, 75, 100].map((g) => (
              <line key={g} x1={0} x2={weeklyRows.length * 30} y1={(100 - g)} y2={(100 - g)} stroke="#f1f5f9" strokeWidth={0.5} />
            ))}
            {/* area */}
            <polyline
              fill="none"
              stroke="#10b981"
              strokeWidth={2}
              points={weeklyRows.map(([, v], i) => `${i * 30},${100 - Math.round((v / maxWeekly) * 90)}`).join(' ')}
            />
            {/* dots */}
            {weeklyRows.map(([, v], i) => (
              <circle key={i} cx={i * 30} cy={100 - Math.round((v / maxWeekly) * 90)} r={2.2} fill="#059669" />
            ))}
          </svg>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
          <div className="flex gap-2">
            {weeklyRows.map(([label]) => (
              <div key={label} className="opacity-90">{label}</div>
            ))}
          </div>
          <div>Peak: Rs {Math.max(...weeklyRows.map(([, v]) => v)).toLocaleString('en-IN')}</div>
        </div>
      </div>

      {/* Trip-wise assignments */}
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 mb-3">Trip assignments (recent)</h3>
        <div className="flex gap-3 overflow-x-auto py-1">
          {tripRows.map(([label, v]) => (
            <div key={label} className="flex flex-col items-center min-w-20">
              <div className="w-8" style={{ height: Math.max(10, (v / maxTrip) * 80) }}>
                <div className="h-full w-full rounded bg-indigo-400" />
              </div>
              <div className="mt-2 text-xs text-slate-600">{label}</div>
              <div className="text-xs font-semibold mt-1">{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
