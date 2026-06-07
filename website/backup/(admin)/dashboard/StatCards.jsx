import React from 'react';
import { Eye, FileCheck, MessageSquare, Heart } from 'lucide-react';

export default function StatCards() {
  const stats = [
    {
      title: 'Total Views',
      value: '14.2K',
      target: '20K',
      percentage: 71, // (14.2 / 20) * 100
      icon: Eye,
      subtitle: 'Views this month',
      isAccent: true, // Reference image ke "All Leaves" ki tarah halka tinted card
    },
    {
      title: 'Live Posts',
      value: '10',
      target: '15',
      percentage: 66,
      icon: FileCheck,
      subtitle: 'Target scheduled',
      isAccent: false,
    },
    {
      title: 'New Comments',
      value: '8',
      target: '24',
      percentage: 33,
      icon: MessageSquare,
      subtitle: 'Pending moderation',
      isAccent: false,
    },
    {
      title: 'Engagement',
      value: '3/4',
      target: 'Score',
      percentage: 75,
      icon: Heart,
      subtitle: 'Avg. reader rating',
      isAccent: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 w-full">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        // SVG circle calculations
        const radius = 28;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (stat.percentage / 100) * circumference;

        return (
          <div
            key={index}
            className={`p-5 rounded-3xl border transition-all duration-300 hover:shadow-md flex items-center justify-between ${
              stat.isAccent
                ? 'bg-emerald-50/50 border-emerald-100/80' // Tinted accent layout matching reference
                : 'bg-white border-slate-100'
            }`}
          >
            {/* Left Column: Text Data */}
            <div className="flex flex-col justify-between h-full py-1">
              <div>
                <span className={`text-xs font-semibold tracking-wide ${
                  stat.isAccent ? 'text-emerald-800/80' : 'text-slate-400'
                }`}>
                  {stat.title}
                </span>
                <div className="flex items-baseline gap-1 mt-2">
                  <span className="text-2xl font-bold tracking-tight text-slate-800">
                    {stat.value}
                  </span>
                  {stat.target !== 'Score' && (
                    <span className="text-xs font-medium text-slate-400">
                      /{stat.target}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 mt-4">
                <Icon size={14} className={stat.isAccent ? 'text-emerald-600' : 'text-slate-400'} />
                <span className="text-[11px] font-medium text-slate-400">
                  {stat.subtitle}
                </span>
              </div>
            </div>

            {/* Right Column: Premium Circular Indicator */}
            <div className="relative flex items-center justify-center w-20 h-20">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  className={`${stat.isAccent ? 'stroke-emerald-100/60' : 'stroke-slate-100'}`}
                  strokeWidth="6"
                  fill="transparent"
                />
                {/* Active Indicator Progress Ring */}
                <circle
                  cx="40"
                  cy="40"
                  r={radius}
                  className="stroke-emerald-500 transition-all duration-500 ease-in-out"
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </svg>
              {/* Inner Percentage Text labels */}
              <div className="absolute flex flex-col items-center justify-center">
                <span className="text-xs font-bold text-slate-800">
                  {stat.percentage}%
                </span>
                <span className="text-[9px] font-medium text-slate-400">
                  Done
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}