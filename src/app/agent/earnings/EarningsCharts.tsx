"use client"

import React, { useState, useMemo } from 'react'
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BriefcaseIcon,
  ChartBarIcon,
  CalendarIcon,
  ClockIcon,
  NoSymbolIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline'

interface MonthlyDataPoint {
  month: string
  completedEarnings: number
  pendingEarnings: number
  cancelledEarnings: number
  completedTours: number
  activeTours: number
  cancelledTours: number
  totalTours: number
  cumulativeEarnings: number
}

interface EarningsChartsProps {
  monthlyRows: MonthlyDataPoint[]
  weeklyRows: Array<[string, number]>
}

export default function EarningsCharts({ monthlyRows, weeklyRows }: EarningsChartsProps) {
  const [activeTab, setActiveTab] = useState<'growth' | 'trips' | 'comparison'>('growth')
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)

  // Math limits for scale
  const maxCompleted = useMemo(() => {
    if (!monthlyRows || monthlyRows.length === 0) return 1000
    return Math.max(1000, ...monthlyRows.map(r => r.completedEarnings))
  }, [monthlyRows])

  const maxCumulative = useMemo(() => {
    if (!monthlyRows || monthlyRows.length === 0) return 1000
    return Math.max(1000, ...monthlyRows.map(r => r.cumulativeEarnings))
  }, [monthlyRows])

  const maxTours = useMemo(() => {
    if (!monthlyRows || monthlyRows.length === 0) return 1
    return Math.max(1, ...monthlyRows.map(r => r.totalTours))
  }, [monthlyRows])

  const maxValInComparison = useMemo(() => {
    if (!monthlyRows || monthlyRows.length === 0) return 1000
    return Math.max(1000, ...monthlyRows.map(r => Math.max(r.completedEarnings, r.pendingEarnings, r.cancelledEarnings)))
  }, [monthlyRows])

  // Empty state handling
  if (!monthlyRows || monthlyRows.length === 0) {
    return (
      <div className="rounded-3xl bg-white p-8 text-center shadow-xs border border-slate-100">
        <div className="mx-auto w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center mb-3">
          <ChartBarIcon className="w-6 h-6 text-slate-400" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 mb-1">No Data Available</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          We couldn&apos;t find any assignments or completed trips to display earnings graphs. Once trips are assigned to you and completed, charts will populate automatically.
        </p>
      </div>
    )
  }

  // Active month calculations (only run when monthlyRows.length > 0)
  const activeIdx = hoveredIdx !== null ? hoveredIdx : monthlyRows.length - 1
  const activeData = monthlyRows[activeIdx]
  const prevData = activeIdx > 0 ? monthlyRows[activeIdx - 1] : null

  // MoM statistics (using simple primitives instead of conditional hooks)
  const momEarningsChange = prevData && prevData.completedEarnings > 0
    ? Math.round(((activeData.completedEarnings - prevData.completedEarnings) / prevData.completedEarnings) * 100)
    : 0

  const momToursChange = prevData && prevData.totalTours > 0
    ? Math.round(((activeData.totalTours - prevData.totalTours) / prevData.totalTours) * 100)
    : 0

  const width = 600
  const height = 300
  const formatCompact = (val: number) => {
    if (val >= 100000) return `${(val / 100000).toFixed(1)}L`
    if (val >= 1000) return `${(val / 1000).toFixed(0)}k`
    return val.toString()
  }
  const paddingLeft = 55
  const paddingRight = 55
  const paddingTop = 40
  const paddingBottom = 45

  const chartWidth = width - paddingLeft - paddingRight
  const chartHeight = height - paddingTop - paddingBottom
  const N = monthlyRows.length
  const step = chartWidth / N

  const getX = (index: number) => paddingLeft + index * step + step / 2

  // Render helper for tab 1 (Growth)
  const renderGrowthChart = () => {
    // Cumulative area and line path points
    const points = monthlyRows.map((row, idx) => {
      const x = getX(idx)
      const y = paddingTop + (1 - row.cumulativeEarnings / maxCumulative) * chartHeight
      return { x, y }
    })

    const dLine = points.map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
    const dArea = `${dLine} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`

    return (
      <>
        {/* Gradients */}
        <defs>
          <linearGradient id="barGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.1" />
          </linearGradient>
          <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Y Gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
          const y = paddingTop + (1 - r) * chartHeight
          return (
            <g key={i} className="opacity-40">
              <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
              {/* Left axis (Monthly earnings) */}
              <text x={paddingLeft - 8} y={y + 4} textAnchor="end" className="text-[10px] fill-slate-400 font-medium">
                {formatCompact(r * maxCompleted)}
              </text>
              {/* Right axis (Cumulative) */}
              <text x={width - paddingRight + 8} y={y + 4} textAnchor="start" className="text-[10px] fill-indigo-400 font-medium">
                {formatCompact(r * maxCumulative)}
              </text>
            </g>
          )
        })}

        {/* Monthly Earnings Bars */}
        {monthlyRows.map((row, idx) => {
          const barWidth = Math.min(28, step * 0.45)
          const x = getX(idx) - barWidth / 2
          const barHeight = (row.completedEarnings / maxCompleted) * chartHeight
          const y = paddingTop + chartHeight - barHeight

          const isHovered = hoveredIdx === idx

          return (
            <rect
              key={idx}
              x={x}
              y={y}
              width={barWidth}
              height={Math.max(2, barHeight)}
              rx={4}
              fill="url(#barGrad)"
              className={`transition-all duration-200 ${isHovered ? 'fill-emerald-500 filter drop-shadow-[0_2px_4px_rgba(16,185,129,0.3)]' : 'fill-emerald-500/70'}`}
            />
          )
        })}

        {/* Cumulative Earnings Area */}
        {points.length > 0 && (
          <path d={dArea} fill="url(#areaGrad)" className="transition-all duration-300" />
        )}

        {/* Cumulative Earnings Line */}
        {points.length > 0 && (
          <path d={dLine} fill="none" stroke="#6366f1" strokeWidth={2.5} strokeLinecap="round" className="transition-all duration-300" />
        )}

        {/* Interactive Dots on Line */}
        {points.map((p, idx) => {
          const isHovered = hoveredIdx === idx
          return (
            <g key={idx}>
              {isHovered && (
                <line x1={p.x} y1={paddingTop} x2={p.x} y2={paddingTop + chartHeight} stroke="#6366f1" strokeWidth={1} strokeDasharray="3 3" />
              )}
              <circle
                cx={p.x}
                cy={p.y}
                r={isHovered ? 6 : 4}
                className={`fill-indigo-600 stroke-white stroke-2 transition-all duration-150 ${isHovered ? 'r-6 shadow-lg' : 'r-4'}`}
              />
            </g>
          )
        })}
      </>
    )
  }

  // Render helper for tab 2 (Trip Assignments)
  const renderTripsChart = () => {
    return (
      <>
        {/* Y Gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
          const y = paddingTop + (1 - r) * chartHeight
          const val = Math.round(r * maxTours)
          return (
            <g key={i} className="opacity-40">
              <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
              <text x={paddingLeft - 8} y={y + 4} textAnchor="end" className="text-[10px] fill-slate-400 font-medium">
                {val}
              </text>
            </g>
          )
        })}

        {/* Stacked bars for Assignments */}
        {monthlyRows.map((row, idx) => {
          const barWidth = Math.min(26, step * 0.4)
          const x = getX(idx) - barWidth / 2

          // Compute segments
          const completedH = (row.completedTours / maxTours) * chartHeight
          const activeH = (row.activeTours / maxTours) * chartHeight
          const cancelledH = (row.cancelledTours / maxTours) * chartHeight

          // Y offsets (starting from bottom)
          const completedY = paddingTop + chartHeight - completedH
          const activeY = completedY - activeH
          const cancelledY = activeY - cancelledH

          const isHovered = hoveredIdx === idx

          return (
            <g key={idx} className={`transition-all duration-200 ${isHovered ? 'filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.1)]' : ''}`}>
              {isHovered && (
                <line x1={getX(idx)} y1={paddingTop} x2={getX(idx)} y2={paddingTop + chartHeight} stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
              )}
              {/* Completed Segment (Green) */}
              {completedH > 0 && (
                <rect x={x} y={completedY} width={barWidth} height={completedH} rx={2} fill="#10b981" className="opacity-85 hover:opacity-100 transition-opacity" />
              )}
              {/* Active Segment (Orange/Amber) */}
              {activeH > 0 && (
                <rect x={x} y={activeY} width={barWidth} height={activeH} rx={2} fill="#f59e0b" className="opacity-85 hover:opacity-100 transition-opacity" />
              )}
              {/* Cancelled Segment (Red) */}
              {cancelledH > 0 && (
                <rect x={x} y={cancelledY} width={barWidth} height={cancelledH} rx={2} fill="#ef4444" className="opacity-85 hover:opacity-100 transition-opacity" />
              )}
            </g>
          )
        })}
      </>
    )
  }

  // Render helper for tab 3 (Comparison)
  const renderComparisonChart = () => {
    return (
      <>
        {/* Y Gridlines */}
        {[0, 0.25, 0.5, 0.75, 1].map((r, i) => {
          const y = paddingTop + (1 - r) * chartHeight
          return (
            <g key={i} className="opacity-40">
              <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#e2e8f0" strokeDasharray="3 3" />
              <text x={paddingLeft - 8} y={y + 4} textAnchor="end" className="text-[10px] fill-slate-400 font-medium">
                {formatCompact(r * maxValInComparison)}
              </text>
            </g>
          )
        })}

        {/* Grouped bars */}
        {monthlyRows.map((row, idx) => {
          const groupWidth = Math.min(48, step * 0.75)
          const barW = groupWidth / 3 - 2
          const startX = getX(idx) - groupWidth / 2

          // Heights
          const compH = (row.completedEarnings / maxValInComparison) * chartHeight
          const pendH = (row.pendingEarnings / maxValInComparison) * chartHeight
          const cancH = (row.cancelledEarnings / maxValInComparison) * chartHeight

          // Y coordinates
          const compY = paddingTop + chartHeight - compH
          const pendY = paddingTop + chartHeight - pendH
          const cancY = paddingTop + chartHeight - cancH

          const isHovered = hoveredIdx === idx

          return (
            <g key={idx}>
              {isHovered && (
                <line x1={getX(idx)} y1={paddingTop} x2={getX(idx)} y2={paddingTop + chartHeight} stroke="#64748b" strokeWidth={1} strokeDasharray="3 3" />
              )}
              {/* Completed bar (Green) */}
              <rect
                x={startX}
                y={compY}
                width={barW}
                height={Math.max(1, compH)}
                rx={1.5}
                fill="#10b981"
                className={`transition-all ${isHovered ? 'fill-emerald-500 scale-x-105' : 'fill-emerald-500/70'}`}
              />
              {/* Pending bar (Amber) */}
              <rect
                x={startX + barW + 2}
                y={pendY}
                width={barW}
                height={Math.max(1, pendH)}
                rx={1.5}
                fill="#f59e0b"
                className={`transition-all ${isHovered ? 'fill-amber-500 scale-x-105' : 'fill-amber-500/70'}`}
              />
              {/* Cancelled bar (Red) */}
              <rect
                x={startX + (barW + 2) * 2}
                y={cancY}
                width={barW}
                height={Math.max(1, cancH)}
                rx={1.5}
                fill="#ef4444"
                className={`transition-all ${isHovered ? 'fill-red-500 scale-x-105' : 'fill-red-500/70'}`}
              />
            </g>
          )
        })}
      </>
    )
  }

  return (
    <div className="space-y-6">
      {/* Tab selectors & Header Card */}
      <div className="rounded-3xl bg-white p-6 shadow-xs border border-slate-100">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5 mb-6">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900">Earnings & Travel Performance</h2>
            <p className="text-xs text-slate-500">Interactive trends for payouts, commissions, and assignment growths.</p>
          </div>

          <div className="flex items-center rounded-2xl bg-slate-50 p-1 border border-slate-100 overflow-x-auto gap-0.5">
            {([
              { id: 'growth', label: 'Growth & Trend', icon: ArrowTrendingUpIcon },
              { id: 'trips', label: 'Trip Velocity', icon: BriefcaseIcon },
              { id: 'comparison', label: 'Comparisons', icon: ChartBarIcon },
            ] as const).map((tab) => {
              const Icon = tab.icon
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    setHoveredIdx(null)
                  }}
                  className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition whitespace-nowrap ${
                    active
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/15'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Main Chart Column */}
          <div className="relative rounded-2xl bg-slate-50 p-4 border border-slate-100 lg:col-span-2 flex flex-col justify-between min-h-[360px]">
            <div className="flex justify-between items-center mb-2 px-2">
              <span className="text-xs font-semibold text-slate-400">
                {activeTab === 'growth' && 'Area: Cumulative Growth | Bars: Monthly Payout'}
                {activeTab === 'trips' && 'Stacked Composition (Completed / Active / Cancelled)'}
                {activeTab === 'comparison' && 'Grouped comparison (Paid / Pending / Cancelled)'}
              </span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1 bg-white px-2 py-0.5 rounded-full border border-slate-100">
                <ClockIcon className="w-3 h-3 text-orange-500" /> Hover to explore details
              </span>
            </div>

            {/* Responsive SVG wrapper */}
            <div className="relative w-full h-[260px]">
              <svg viewBox={`0 0 ${width} ${height}`} width="100%" height="100%" className="overflow-visible select-none">
                {/* Horizontal bottom line */}
                <line x1={paddingLeft} y1={paddingTop + chartHeight} x2={width - paddingRight} y2={paddingTop + chartHeight} stroke="#cbd5e1" strokeWidth={1} />

                {/* Render selected chart */}
                {activeTab === 'growth' && renderGrowthChart()}
                {activeTab === 'trips' && renderTripsChart()}
                {activeTab === 'comparison' && renderComparisonChart()}

                {/* X Axis Labels */}
                {monthlyRows.map((row, idx) => {
                  const x = getX(idx)
                  const isHovered = hoveredIdx === idx
                  return (
                    <text
                      key={idx}
                      x={x}
                      y={height - paddingBottom + 20}
                      textAnchor="middle"
                      className={`text-[10px] font-bold transition-all duration-150 ${isHovered ? 'fill-orange-600 font-extrabold scale-105' : 'fill-slate-500'}`}
                    >
                      {row.month}
                    </text>
                  )
                })}

                {/* Transparent hover capture grid */}
                {monthlyRows.map((_, idx) => {
                  const x = paddingLeft + idx * step
                  return (
                    <rect
                      key={idx}
                      x={x}
                      y={0}
                      width={step}
                      height={height}
                      fill="transparent"
                      className="cursor-pointer"
                      onMouseEnter={() => setHoveredIdx(idx)}
                      onMouseLeave={() => setHoveredIdx(null)}
                    />
                  )
                })}
              </svg>
            </div>

            {/* Color indicators key */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-slate-600 border-t border-slate-100 pt-3 px-2">
              {activeTab === 'growth' && (
                <>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500" /> Monthly Paid</div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-0.5 border-t-2 border-indigo-600" /> Cumulative Running Total</div>
                </>
              )}
              {activeTab === 'trips' && (
                <>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500" /> Completed Tours</div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500" /> Active / Assigned</div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-500" /> Cancelled</div>
                </>
              )}
              {activeTab === 'comparison' && (
                <>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-emerald-500" /> Paid (Completed)</div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-amber-500" /> Pending (Assigned/Progress)</div>
                  <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded bg-red-500" /> Cancelled (Lost)</div>
                </>
              )}
            </div>
          </div>

          {/* Details & Metrics Sidebar */}
          <div className="rounded-2xl bg-slate-900 p-6 text-white flex flex-col justify-between min-h-[360px] relative overflow-hidden shadow-lg shadow-cyan-950/20">
            {/* Background glowing circle */}
            <div className="absolute -right-12 -top-12 w-32 h-32 rounded-full bg-orange-500/10 blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-orange-400 font-bold">Month Focus</span>
                  <h3 className="text-lg font-bold flex items-center gap-1.5 mt-0.5 text-slate-100">
                    <CalendarIcon className="w-4 h-4 text-slate-400" />
                    {activeData.month}
                  </h3>
                </div>
                <span className="text-[10px] bg-slate-800 text-slate-300 font-bold px-2.5 py-1 rounded-full border border-slate-700">
                  {hoveredIdx !== null ? 'Live Stats' : 'Latest'}
                </span>
              </div>

              {/* Dynamic Information Display based on Tab */}
              {activeTab === 'growth' && (
                <div className="space-y-4">
                  <div>
                    <span className="text-xs text-slate-400 block mb-1">Monthly Paid Commission</span>
                    <div className="text-2xl font-black text-emerald-400">Rs {activeData.completedEarnings.toLocaleString('en-IN')}</div>
                  </div>

                  <div>
                    <span className="text-xs text-slate-400 block mb-1">Total Accumulated Earnings</span>
                    <div className="text-2xl font-black text-indigo-300">Rs {activeData.cumulativeEarnings.toLocaleString('en-IN')}</div>
                  </div>

                  {/* MoM Earnings change badge */}
                  <div className="border-t border-slate-800 pt-3">
                    <span className="text-xs text-slate-400 block mb-1.5">Month-over-Month Growth</span>
                    {momEarningsChange >= 0 ? (
                      <div className="inline-flex items-center gap-1 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-3 py-1.5 text-xs text-emerald-400 font-bold">
                        <ArrowTrendingUpIcon className="w-3.5 h-3.5 text-emerald-400" />
                        <span>+{momEarningsChange}% Increase</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1 bg-red-500/10 border border-red-500/20 rounded-xl px-3 py-1.5 text-xs text-red-400 font-bold">
                        <ArrowTrendingDownIcon className="w-3.5 h-3.5 text-red-400" />
                        <span>{momEarningsChange}% Decrease</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'trips' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-800/50">
                      <span className="text-[10px] text-slate-400 block mb-0.5">Total Trips Assigned</span>
                      <div className="text-xl font-extrabold text-slate-200">{activeData.totalTours}</div>
                    </div>
                    <div className="bg-slate-800/40 rounded-xl p-3 border border-slate-800/50">
                      <span className="text-[10px] text-slate-400 block mb-0.5">MoM Assign Trend</span>
                      <div className="flex items-center gap-0.5 font-bold text-xs mt-1">
                        {momToursChange >= 0 ? (
                          <span className="text-emerald-400 flex items-center gap-0.5">+{momToursChange}% <ArrowTrendingUpIcon className="w-3 h-3" /></span>
                        ) : (
                          <span className="text-red-400 flex items-center gap-0.5">{momToursChange}% <ArrowTrendingDownIcon className="w-3 h-3" /></span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 border-t border-slate-800 pt-3">
                    <span className="text-xs text-slate-400 block mb-1">Status Composition</span>

                    <div className="flex items-center justify-between text-xs py-1">
                      <span className="text-slate-400 flex items-center gap-1.5"><CheckCircleIcon className="w-4 h-4 text-emerald-500" /> Completed Trips</span>
                      <span className="font-bold text-slate-100">{activeData.completedTours}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs py-1">
                      <span className="text-slate-400 flex items-center gap-1.5"><ClockIcon className="w-4 h-4 text-amber-500" /> Active / Assigned</span>
                      <span className="font-bold text-slate-100">{activeData.activeTours}</span>
                    </div>

                    <div className="flex items-center justify-between text-xs py-1">
                      <span className="text-slate-400 flex items-center gap-1.5"><NoSymbolIcon className="w-4 h-4 text-red-500" /> Cancelled Trips</span>
                      <span className="font-bold text-slate-100">{activeData.cancelledTours}</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'comparison' && (
                <div className="space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                      <span className="text-xs text-slate-400">Paid (Completed)</span>
                      <span className="text-sm font-bold text-emerald-400">Rs {activeData.completedEarnings.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5 border-b border-slate-800">
                      <span className="text-xs text-slate-400">Pending (In Progress)</span>
                      <span className="text-sm font-bold text-amber-400">Rs {activeData.pendingEarnings.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex items-center justify-between py-1.5">
                      <span className="text-xs text-slate-400">Cancelled (Lost)</span>
                      <span className="text-sm font-bold text-red-400">Rs {activeData.cancelledEarnings.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="border-t border-slate-800 pt-3">
                    <span className="text-xs text-slate-400 block mb-1">Earning Realization Ratio</span>
                    {activeData.completedEarnings + activeData.pendingEarnings > 0 ? (
                      <div>
                        <div className="text-2xl font-black text-orange-400">
                          {Math.round(
                            (activeData.completedEarnings /
                              (activeData.completedEarnings + activeData.pendingEarnings)) *
                              100
                          )}%
                        </div>
                        <span className="text-[10px] text-slate-400">Paid amount / Total active pipeline</span>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">No active pipelines</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom summary card */}
            <div className="border-t border-slate-850 pt-4 mt-6 text-slate-500 text-[10px] leading-relaxed">
              * Earnings represent your net commission payout after deduction of platform fees and processing taxes.
            </div>
          </div>
        </div>
      </div>

      {/* Weekly trend velocity card - smaller layout */}
      {weeklyRows && weeklyRows.length > 0 && (
        <div className="rounded-3xl bg-white p-6 shadow-xs border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Weekly Earnings Trend</h3>
              <p className="text-[10px] text-slate-500">Short term payout velocity over the last {weeklyRows.length} weeks.</p>
            </div>
            <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
              Peak: Rs {Math.max(...weeklyRows.map(([, v]) => v)).toLocaleString('en-IN')}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 items-center">
            {/* Sparkline chart */}
            <div className="md:col-span-3 h-28 bg-slate-50 rounded-2xl p-4 border border-slate-100">
              <svg viewBox={`0 0 ${weeklyRows.length * 40} 100`} preserveAspectRatio="none" className="w-full h-full overflow-visible">
                {/* Area under curve */}
                <path
                  fill="url(#sparkAreaGrad)"
                  opacity={0.3}
                  d={`
                    M 0,100
                    ${weeklyRows.map(([, v], i) => `L ${i * 40},${100 - Math.round((v / Math.max(1, ...weeklyRows.map(([, x]) => x))) * 80)}`).join(' ')}
                    L ${(weeklyRows.length - 1) * 40},100 Z
                  `}
                />
                
                {/* Line */}
                <polyline
                  fill="none"
                  stroke="#10b981"
                  strokeWidth={2}
                  points={weeklyRows.map(([, v], i) => `${i * 40},${100 - Math.round((v / Math.max(1, ...weeklyRows.map(([, x]) => x))) * 80)}`).join(' ')}
                />
                
                {/* Dots */}
                {weeklyRows.map(([, v], i) => (
                  <circle
                    key={i}
                    cx={i * 40}
                    cy={100 - Math.round((v / Math.max(1, ...weeklyRows.map(([, x]) => x))) * 80)}
                    r={3}
                    fill="#059669"
                    stroke="#ffffff"
                    strokeWidth={1.5}
                  />
                ))}

                {/* Spark gradient definition */}
                <defs>
                  <linearGradient id="sparkAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Weekly values text key */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 max-h-28 overflow-y-auto">
              {weeklyRows.map(([label, val]) => (
                <div key={label} className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 font-medium">{label}</span>
                  <span className="font-extrabold text-slate-700">Rs {val.toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
