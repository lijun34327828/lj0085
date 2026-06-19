import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { PieChart as PieChartIcon, BarChart3 } from 'lucide-react';
import type { CalculateResponse } from '../types';
import { formatCurrency } from '../utils/format';

interface DataChartsProps {
  result: CalculateResponse | null;
  loading: boolean;
}

const COLORS = ['#D97757', '#B45309', '#8C7A68', '#6B8E23'];

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-cream-200 rounded-xl p-3 shadow-lg">
        <p className="text-sm font-medium text-bark-700 mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 text-xs">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-bark-500">{entry.name}:</span>
            <span className="font-medium text-bark-700">
              {formatCurrency(entry.value)}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const PieCustomTooltip = ({ active, payload }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; percent: number }>;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/95 backdrop-blur-sm border border-cream-200 rounded-xl p-3 shadow-lg">
        <p className="text-sm font-medium text-bark-700 mb-2">{payload[0].name}</p>
        <p className="text-xs text-bark-500">
          金额: <span className="font-medium text-bark-700">{formatCurrency(payload[0].value)}</span>
        </p>
        <p className="text-xs text-bark-500">
          占比: <span className="font-medium text-bark-700">{(payload[0].percent * 100).toFixed(1)}%</span>
        </p>
      </div>
    );
  }
  return null;
};

export const DataCharts: React.FC<DataChartsProps> = ({ result, loading }) => {
  if (loading && !result) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="card-base p-6 h-80">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-6 w-6 bg-cream-200 rounded animate-pulse" />
            <div className="h-6 w-32 bg-cream-200 rounded animate-pulse" />
          </div>
          <div className="h-56 bg-cream-100 rounded-xl animate-pulse" />
        </div>
        <div className="card-base p-6 h-80">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-6 w-6 bg-cream-200 rounded animate-pulse" />
            <div className="h-6 w-32 bg-cream-200 rounded animate-pulse" />
          </div>
          <div className="h-56 bg-cream-100 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!result) return null;

  const barChartData = result.breakdown.labels.map((label, index) => ({
    name: label,
    日常营业: result.breakdown.dailyData[index],
    活动期间: result.breakdown.activityData[index],
  }));

  const pieChartData = [
    { name: '毛利', value: result.activity.profit },
    { name: '让利成本', value: result.activity.discountCost },
    { name: '物料成本', value: result.activity.revenue * 0.3 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div
        className="card-base p-6 opacity-0 animate-fade-in-up"
        style={{ animationDelay: '100ms' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-clay-500" />
          <h3 className="font-serif text-lg font-semibold text-bark-700">营收对比分析</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barChartData}
              barGap={4}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E9DFCB" vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ fill: '#6B5A4A', fontSize: 12 }}
                axisLine={{ stroke: '#DBCDAA' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6B5A4A', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `¥${value / 1000}k`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="日常营业"
                fill="#AFA091"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                dataKey="活动期间"
                fill="#D97757"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div
        className="card-base p-6 opacity-0 animate-fade-in-up"
        style={{ animationDelay: '200ms' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <PieChartIcon className="w-5 h-5 text-clay-500" />
          <h3 className="font-serif text-lg font-semibold text-bark-700">成本构成分析</h3>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="value"
              >
                {pieChartData.map((_entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                    stroke="#FAF7F2"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<PieCustomTooltip />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                iconType="circle"
                iconSize={8}
                formatter={(value) => (
                  <span className="text-xs text-bark-500">{value}</span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
