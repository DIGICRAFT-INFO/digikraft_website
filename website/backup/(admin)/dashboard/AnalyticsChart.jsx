import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import { ChevronDown, ArrowUpRight } from 'lucide-react';

// Mock Data representing premium metrics matching the visual layout
const data = [
  { name: 'Jan', views: 4000 },
  { name: 'Feb', views: 4500 },
  { name: 'Mar', views: 5100 },
  { name: 'Apr', views: 4800 },
  { name: 'May', views: 5800 },
  { name: 'Jun', views: 5500 },
  { name: 'Jul', views: 5200 },
  { name: 'Aug', views: 6100 },
  { name: 'Sep', views: 6500 },
  { name: 'Oct', views: 6300 },
  { name: 'Nov', views: 6800 },
  { name: 'Dec', views: 7200 },
];

export default function AnalyticsChart() {
  const [timeline, setTimeline] = useState('Last Year');

  return (
    <div className="bg-white border border-slate-100 rounded-3xl p-6 w-full shadow-sm">
      {/* Top Header Row Layout matching reference */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Blog Traffic</span>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight mt-0.5">Performance Overview</h2>
          
          {/* Growth Stat indicator matching the image (+2.05% badge style) */}
          <div className="flex items-center gap-1.5 mt-2">
            <span className="text-2xl font-bold text-slate-800 tracking-tight">86.75%</span>
            <div className="flex items-center gap-0.5 bg-emerald-50 border border-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full text-[11px] font-bold">
              <ArrowUpRight size={12} strokeWidth={2.5} />
              <span>+2.05%</span>
            </div>
            <span className="text-xs font-medium text-slate-400 ml-1">Increased by last year</span>
          </div>
        </div>

        {/* Dropdown Control Filter matching reference button pattern */}
        <button className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-slate-100 px-3.5 py-2 rounded-xl hover:bg-slate-100 transition-colors duration-200">
          <span>{timeline}</span>
          <ChevronDown size={14} className="text-slate-400" />
        </button>
      </div>

      {/* Chart Canvas Area Wrapper */}
      <div className="w-full h-72 text-xs font-semibold">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
            <defs>
              {/* Premium Soft Green Fluid Gradient Fill mapping reference look */}
              <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            
            {/* Soft grid lines to isolate background data nodes */}
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94A3B8', fontSize: 11 }} 
              dy={10}
            />
            
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              domain={[0, 'auto']}
              tickFormatter={(value) => `${value / 1000}k`}
            />
            
            {/* Custom Premium Clean Interactive Tooltip */}
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#ffffff', 
                border: '1px solid #F1F5F9', 
                borderRadius: '16px', 
                boxShadow: '0 4px 12px -2px rgba(15, 23, 42, 0.04)' 
              }}
              labelStyle={{ color: '#64748B', fontWeight: 600, fontSize: '11px' }}
              itemStyle={{ color: '#0F172A', fontWeight: 700, fontSize: '13px' }}
              formatter={(value) => [`${value} Views`, 'Traffic']}
            />

            {/* Main Area Config Node */}
            <Area
              type="monotone"
              dataKey="views"
              stroke="#10B981" // Mint Green Line Stroke
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#chartGradient)"
              activeDot={{ r: 5, strokeWidth: 2, stroke: '#ffffff', fill: '#10B981' }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}