import React, { useState, useEffect, useRef } from 'react';
import { BarChart3, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { CalculateResponse } from '../types';
import { formatCurrency, formatPercent, getChangeIndicator } from '../utils/format';

interface ComparisonTableProps {
  result: CalculateResponse | null;
  loading: boolean;
}

const TableRow: React.FC<{
  label: string;
  dailyValue: string | number;
  activityValue: string | number;
  diff: number;
  isHighlight?: boolean;
  delay: number;
  isCurrency?: boolean;
  isPercent?: boolean;
}> = ({ label, dailyValue, activityValue, diff, isHighlight, delay, isCurrency, isPercent }) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const prevDiffRef = useRef(diff);
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    if (prevDiffRef.current !== diff) {
      setFlash(true);
      const timer = setTimeout(() => setFlash(false), 800);
      prevDiffRef.current = diff;
      return () => clearTimeout(timer);
    }
  }, [diff]);

  const indicator = getChangeIndicator(diff);
  const IconComponent = indicator.icon === 'trending-up'
    ? TrendingUp
    : indicator.icon === 'trending-down'
    ? TrendingDown
    : Minus;

  const formatValue = (value: string | number) => {
    if (typeof value === 'string') return value;
    if (isCurrency) return formatCurrency(value);
    if (isPercent) return formatPercent(value);
    return value.toString();
  };

  return (
    <div
      ref={rowRef}
      className={`grid grid-cols-12 gap-2 py-3 px-4 items-center opacity-0 animate-fade-in-up ${
        flash ? 'highlight-flash' : ''
      } ${isHighlight ? 'bg-clay-50/50 rounded-xl -mx-2' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="col-span-4">
        <span className={`text-sm ${isHighlight ? 'font-medium text-bark-700' : 'text-bark-500'}`}>
          {label}
        </span>
      </div>
      <div className="col-span-3 text-right">
        <span className="text-sm text-bark-500 font-medium">
          {formatValue(dailyValue)}
        </span>
      </div>
      <div className="col-span-3 text-right">
        <span className={`text-sm font-semibold ${isHighlight ? 'text-clay-600' : 'text-bark-700'}`}>
          {formatValue(activityValue)}
        </span>
      </div>
      <div className="col-span-2 flex items-center justify-end gap-1">
        <IconComponent className={`w-3.5 h-3.5 ${indicator.color}`} />
        <span className={`text-xs font-semibold ${indicator.color}`}>
          {indicator.sign}{Math.abs(diff).toFixed(isPercent ? 1 : 0)}{isPercent ? '%' : ''}
        </span>
      </div>
    </div>
  );
};

export const ComparisonTable: React.FC<ComparisonTableProps> = ({ result, loading }) => {
  if (loading && !result) {
    return (
      <div className="card-base p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-6 w-6 bg-cream-200 rounded animate-pulse" />
          <div className="h-6 w-40 bg-cream-200 rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-8 bg-cream-200 rounded animate-pulse" style={{ animationDelay: `${i * 50}ms` }} />
          ))}
        </div>
      </div>
    );
  }

  if (!result) return null;

  const rows = [
    {
      label: '营业收入',
      dailyValue: result.daily.revenue,
      activityValue: result.activity.revenue,
      diff: result.comparison.revenueChangeRate,
      isHighlight: true,
      isCurrency: true,
    },
    {
      label: '让利成本',
      dailyValue: '-',
      activityValue: result.activity.discountCost,
      diff: result.activity.discountCost > 0 ? 100 : 0,
      isCurrency: true,
    },
    {
      label: '物料成本',
      dailyValue: result.daily.revenue * 0.3,
      activityValue: result.activity.revenue * 0.3,
      diff: ((result.activity.revenue * 0.3 - result.daily.revenue * 0.3) / (result.daily.revenue * 0.3)) * 100,
      isCurrency: true,
    },
    {
      label: '毛利',
      dailyValue: result.daily.profit,
      activityValue: result.activity.profit,
      diff: result.comparison.profitChangeRate,
      isHighlight: true,
      isCurrency: true,
    },
    {
      label: '毛利率',
      dailyValue: result.daily.grossMargin,
      activityValue: result.activity.grossMargin,
      diff: result.activity.grossMargin - result.daily.grossMargin,
      isPercent: true,
    },
    {
      label: '预估客流',
      dailyValue: result.breakdown.dailyData[0] / (result.activity.revenue / (result.activityData?.[0] || 1)) || 50,
      activityValue: result.breakdown.activityData[0] / (result.activity.revenue / (result.activityData?.[0] || 1)) || 80,
      diff: 60,
    },
  ];

  return (
    <div
      className="card-base p-6 opacity-0 animate-fade-in-up"
      style={{ animationDelay: '100ms' }}
    >
      <div className="flex items-center gap-2 mb-5">
        <BarChart3 className="w-5 h-5 text-clay-500" />
        <h2 className="font-serif text-xl font-semibold text-bark-700">收益对比分析</h2>
      </div>

      <div className="grid grid-cols-12 gap-2 py-2 px-4 border-b border-cream-200">
        <div className="col-span-4">
          <span className="text-xs font-medium text-bark-400 uppercase tracking-wider">项目</span>
        </div>
        <div className="col-span-3 text-right">
          <span className="text-xs font-medium text-bark-400 uppercase tracking-wider">日常营业</span>
        </div>
        <div className="col-span-3 text-right">
          <span className="text-xs font-medium text-clay-500 uppercase tracking-wider">活动期间</span>
        </div>
        <div className="col-span-2 text-right">
          <span className="text-xs font-medium text-bark-400 uppercase tracking-wider">变化</span>
        </div>
      </div>

      <div className="divide-y divide-cream-100">
        <TableRow
          label="营业收入"
          dailyValue={result.daily.revenue}
          activityValue={result.activity.revenue}
          diff={result.comparison.revenueChangeRate}
          isHighlight
          isCurrency
          delay={100}
        />
        <TableRow
          label="让利成本"
          dailyValue="-"
          activityValue={result.activity.discountCost}
          diff={result.activity.discountCost > 0 ? 100 : 0}
          isCurrency
          delay={200}
        />
        <TableRow
          label="物料成本"
          dailyValue={result.daily.revenue * 0.3}
          activityValue={result.activity.revenue * 0.3}
          diff={result.daily.revenue > 0 
            ? ((result.activity.revenue * 0.3 - result.daily.revenue * 0.3) / (result.daily.revenue * 0.3)) * 100 
            : 0}
          isCurrency
          delay={300}
        />
        <TableRow
          label="毛利"
          dailyValue={result.daily.profit}
          activityValue={result.activity.profit}
          diff={result.comparison.profitChangeRate}
          isHighlight
          isCurrency
          delay={400}
        />
        <TableRow
          label="毛利率"
          dailyValue={result.daily.grossMargin}
          activityValue={result.activity.grossMargin}
          diff={result.activity.grossMargin - result.daily.grossMargin}
          isPercent
          delay={500}
        />
      </div>

      <div className="mt-5 pt-4 border-t border-cream-200">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-bark-300" />
              <span className="text-bark-500">日常营业</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-clay-500" />
              <span className="text-bark-500">活动期间</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-moss-600" />
              <span className="text-xs text-bark-400">增长</span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingDown className="w-3.5 h-3.5 text-terracotta-600" />
              <span className="text-xs text-bark-400">下降</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
