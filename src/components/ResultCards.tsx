import React, { useState, useEffect, useRef } from 'react';
import { TrendingDown, TrendingUp, Minus, DollarSign, Percent, PiggyBank } from 'lucide-react';
import type { CalculateResponse } from '../types';
import { formatCurrency, formatPercent, getChangeIndicator } from '../utils/format';

interface ResultCardsProps {
  result: CalculateResponse | null;
  loading: boolean;
  lastUpdated: Date | null;
}

const ResultCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle?: string;
  bgColor: string;
  iconBg: string;
  iconColor: string;
  delay: number;
  highlight?: boolean;
}> = ({ icon, title, value, subtitle, bgColor, iconBg, iconColor, delay, highlight }) => {
  const prevValueRef = useRef(value);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (prevValueRef.current !== value) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 400);
      prevValueRef.current = value;
      return () => clearTimeout(timer);
    }
  }, [value]);

  return (
    <div
      className={`${bgColor} rounded-2xl p-5 opacity-0 animate-fade-in-up ${highlight ? 'ring-2 ring-clay-400/30' : ''}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2.5 rounded-xl ${iconBg} ${iconColor}`}>
          {icon}
        </div>
        {subtitle && (
          <span className="text-xs text-white/70 font-medium">{subtitle}</span>
        )}
      </div>
      <h4 className="text-white/80 text-sm font-medium mb-1">{title}</h4>
      <p className={`text-2xl font-bold text-white ${animate ? 'number-animate' : ''}`}>
        {value}
      </p>
    </div>
  );
};

const ChangeIndicator: React.FC<{ value: number; label: string }> = ({ value, label }) => {
  const indicator = getChangeIndicator(value);
  const IconComponent = indicator.icon === 'trending-up'
    ? TrendingUp
    : indicator.icon === 'trending-down'
    ? TrendingDown
    : Minus;

  return (
    <div className="flex items-center gap-1.5">
      <IconComponent className={`w-4 h-4 ${indicator.color}`} />
      <span className={`text-sm font-medium ${indicator.color}`}>
        {indicator.sign}{Math.abs(value).toFixed(1)}%
      </span>
      <span className="text-xs text-bark-400">{label}</span>
    </div>
  );
};

export const ResultCards: React.FC<ResultCardsProps> = ({ result, loading, lastUpdated }) => {
  if (loading && !result) {
    return (
      <div className="space-y-5">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-6 w-6 bg-cream-200 rounded animate-pulse" />
          <div className="h-6 w-40 bg-cream-200 rounded animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[100, 200, 300].map((delay) => (
            <div key={delay} className="h-36 bg-cream-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between opacity-0 animate-fade-in-up">
        <div className="flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-clay-500" />
          <h2 className="font-serif text-xl font-semibold text-bark-700">测算结果</h2>
        </div>
        {lastUpdated && (
          <span className="text-xs text-bark-400">
            最后更新：{lastUpdated.toLocaleTimeString('zh-CN')}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <ResultCard
          icon={<TrendingDown className="w-5 h-5" />}
          title="让利总成本"
          value={formatCurrency(result.activity.discountCost)}
          subtitle="活动期间"
          bgColor="bg-gradient-to-br from-terracotta-500 to-terracotta-600"
          iconBg="bg-terracotta-400/30"
          iconColor="text-terracotta-100"
          delay={100}
          highlight={result.comparison.profitDiff < 0}
        />

        <ResultCard
          icon={<DollarSign className="w-5 h-5" />}
          title="预估总营收"
          value={formatCurrency(result.activity.revenue)}
          subtitle="活动期间"
          bgColor="bg-gradient-to-br from-clay-500 to-clay-600"
          iconBg="bg-clay-400/30"
          iconColor="text-clay-100"
          delay={200}
          highlight={result.comparison.revenueDiff > 0}
        />

        <ResultCard
          icon={<Percent className="w-5 h-5" />}
          title="毛利率"
          value={formatPercent(result.activity.grossMargin)}
          subtitle="活动期间"
          bgColor="bg-gradient-to-br from-moss-500 to-moss-600"
          iconBg="bg-moss-400/30"
          iconColor="text-moss-100"
          delay={300}
        />
      </div>

      <div
        className="card-base p-5 opacity-0 animate-fade-in-up"
        style={{ animationDelay: '400ms' }}
      >
        <div className="flex items-center gap-2 mb-4">
          <PiggyBank className="w-5 h-5 text-clay-500" />
          <h3 className="font-serif text-lg font-semibold text-bark-700">收益变化分析</h3>
        </div>
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-bark-500">营收差额</span>
              <span className={`font-semibold ${result.comparison.revenueDiff >= 0 ? 'text-moss-600' : 'text-terracotta-600'}`}>
                {result.comparison.revenueDiff >= 0 ? '+' : ''}{formatCurrency(result.comparison.revenueDiff)}
              </span>
            </div>
            <ChangeIndicator value={result.comparison.revenueChangeRate} label="较日常" />
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-bark-500">利润差额</span>
              <span className={`font-semibold ${result.comparison.profitDiff >= 0 ? 'text-moss-600' : 'text-terracotta-600'}`}>
                {result.comparison.profitDiff >= 0 ? '+' : ''}{formatCurrency(result.comparison.profitDiff)}
              </span>
            </div>
            <ChangeIndicator value={result.comparison.profitChangeRate} label="较日常" />
          </div>
        </div>
      </div>
    </div>
  );
};
