import React, { useState, useEffect } from 'react';
import { Percent, Users, Tag, Settings, RotateCcw } from 'lucide-react';
import type { CalculatorParams } from '../types';
import { formatDiscount } from '../utils/format';

const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

interface ParameterPanelProps {
  params: CalculatorParams;
  onUpdate: <K extends keyof CalculatorParams>(key: K, value: CalculatorParams[K]) => void;
  onReset: () => void;
  loading: boolean;
}

const ParamCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
  delay: number;
}> = ({ icon, title, subtitle, children, delay }) => (
  <div
    className="card-base p-5 opacity-0 animate-fade-in-up"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="flex items-start gap-3 mb-4">
      <div className="p-2.5 rounded-xl bg-clay-50 text-clay-500">
        {icon}
      </div>
      <div>
        <h3 className="font-serif text-lg font-semibold text-bark-700">{title}</h3>
        <p className="text-sm text-bark-400">{subtitle}</p>
      </div>
    </div>
    {children}
  </div>
);

export const ParameterPanel: React.FC<ParameterPanelProps> = ({
  params,
  onUpdate,
  onReset,
  loading,
}) => {
  const [inputValues, setInputValues] = useState<Record<keyof CalculatorParams, string>>({
    discountRate: String(params.discountRate),
    estimatedFlow: String(params.estimatedFlow),
    avgPrice: String(params.avgPrice),
    dailyFlow: String(params.dailyFlow),
    materialCostRate: String(params.materialCostRate),
  });

  const [focusedField, setFocusedField] = useState<keyof CalculatorParams | null>(null);

  const handleFocus = (key: keyof CalculatorParams) => {
    setFocusedField(key);
  };

  useEffect(() => {
    setInputValues({
      discountRate: String(params.discountRate),
      estimatedFlow: String(params.estimatedFlow),
      avgPrice: String(params.avgPrice),
      dailyFlow: String(params.dailyFlow),
      materialCostRate: String(params.materialCostRate),
    });
  }, [params.discountRate, params.estimatedFlow, params.avgPrice, params.dailyFlow, params.materialCostRate]);

  const handleInputChange = (key: keyof CalculatorParams, value: string) => {
    setInputValues(prev => ({ ...prev, [key]: value }));
  };

  const handleInputBlur = (
    key: keyof CalculatorParams,
    parser: (v: string) => number,
    min: number,
    max: number,
    fallback: number
  ) => {
    setFocusedField(null);
    const raw = inputValues[key];
    if (raw === '' || raw === null || raw === undefined) {
      setInputValues(prev => ({ ...prev, [key]: String(fallback) }));
      onUpdate(key, fallback as CalculatorParams[typeof key]);
      return;
    }
    const parsed = parser(raw);
    if (Number.isNaN(parsed)) {
      setInputValues(prev => ({ ...prev, [key]: String(fallback) }));
      onUpdate(key, fallback as CalculatorParams[typeof key]);
      return;
    }
    const clamped = clamp(parsed, min, max);
    setInputValues(prev => ({ ...prev, [key]: String(clamped) }));
    onUpdate(key, clamped as CalculatorParams[typeof key]);
  };

  const handleSliderChange = (
    key: keyof CalculatorParams,
    parser: (v: string) => number,
    value: string
  ) => {
    const parsed = parser(value);
    if (!Number.isNaN(parsed)) {
      setInputValues(prev => ({ ...prev, [key]: String(parsed) }));
      onUpdate(key, parsed as CalculatorParams[typeof key]);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between opacity-0 animate-fade-in-up">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-clay-500" />
          <h2 className="font-serif text-xl font-semibold text-bark-700">核心参数配置</h2>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-bark-500 hover:text-clay-600 hover:bg-clay-50 rounded-lg transition-all"
        >
          <RotateCcw className="w-4 h-4" />
          重置参数
        </button>
      </div>

      <ParamCard
        icon={<Percent className="w-5 h-5" />}
        title="活动折扣比例"
        subtitle="设置周末主题活动的优惠力度"
        delay={100}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-clay-600">
              {formatDiscount(params.discountRate)}
            </span>
            <div className="flex flex-col items-end">
              <input
                type="text"
                value={focusedField === 'discountRate' ? inputValues.discountRate : formatDiscount(parseFloat(inputValues.discountRate) || 0)}
                onChange={(e) => handleInputChange('discountRate', e.target.value)}
                onFocus={() => handleFocus('discountRate')}
                onBlur={() => handleInputBlur('discountRate', parseFloat, 0.1, 1, params.discountRate)}
                className="w-24 input-field text-right"
                disabled={loading}
              />
              {focusedField === 'discountRate' && (
                <span className="text-xs text-bark-400 mt-1">填写完成后点击其他区域生效</span>
              )}
            </div>
          </div>
          <input
            type="range"
            value={params.discountRate}
            onChange={(e) => handleSliderChange('discountRate', parseFloat, e.target.value)}
            step="0.05"
            min="0.1"
            max="1"
            className="w-full"
            disabled={loading}
          />
          <div className="flex justify-between text-xs text-bark-400">
            <span>1折</span>
            <span>10折（原价）</span>
          </div>
        </div>
      </ParamCard>

      <ParamCard
        icon={<Users className="w-5 h-5" />}
        title="预估单日客流"
        subtitle="活动期间预计到店体验的客户数量"
        delay={200}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-clay-600">
                {params.estimatedFlow}
              </span>
              <span className="text-sm text-bark-400">人/天</span>
            </div>
            <div className="flex flex-col items-end">
              <input
                type="number"
                value={inputValues.estimatedFlow}
                onChange={(e) => handleInputChange('estimatedFlow', e.target.value)}
                onFocus={() => handleFocus('estimatedFlow')}
                onBlur={() => handleInputBlur('estimatedFlow', parseInt, 1, 500, params.estimatedFlow)}
                min="1"
                max="500"
                className="w-24 input-field text-right"
                disabled={loading}
              />
              {focusedField === 'estimatedFlow' && (
                <span className="text-xs text-bark-400 mt-1">填写完成后点击其他区域生效</span>
              )}
            </div>
          </div>
          <input
            type="range"
            value={params.estimatedFlow}
            onChange={(e) => handleSliderChange('estimatedFlow', parseInt, e.target.value)}
            step="5"
            min="1"
            max="500"
            className="w-full"
            disabled={loading}
          />
          <div className="flex justify-between text-xs text-bark-400">
            <span>1人</span>
            <span>500人</span>
          </div>
        </div>
      </ParamCard>

      <ParamCard
        icon={<Tag className="w-5 h-5" />}
        title="项目平均定价"
        subtitle="店内手作体验项目的平均客单价"
        delay={300}
      >
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-1">
              <span className="text-sm text-bark-400">¥</span>
              <span className="text-2xl font-bold text-clay-600">
                {params.avgPrice}
              </span>
              <span className="text-sm text-bark-400">/人次</span>
            </div>
            <div className="flex flex-col items-end">
              <input
                type="number"
                value={inputValues.avgPrice}
                onChange={(e) => handleInputChange('avgPrice', e.target.value)}
                onFocus={() => handleFocus('avgPrice')}
                onBlur={() => handleInputBlur('avgPrice', parseFloat, 10, 1000, params.avgPrice)}
                step="1"
                min="10"
                max="1000"
                className="w-24 input-field text-right"
                disabled={loading}
              />
              {focusedField === 'avgPrice' && (
                <span className="text-xs text-bark-400 mt-1">填写完成后点击其他区域生效</span>
              )}
            </div>
          </div>
          <input
            type="range"
            value={params.avgPrice}
            onChange={(e) => handleSliderChange('avgPrice', parseInt, e.target.value)}
            step="5"
            min="10"
            max="1000"
            className="w-full"
            disabled={loading}
          />
          <div className="flex justify-between text-xs text-bark-400">
            <span>¥10</span>
            <span>¥1000</span>
          </div>
        </div>
      </ParamCard>

      <div
        className="card-base p-4 opacity-0 animate-fade-in-up"
        style={{ animationDelay: '400ms' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Settings className="w-4 h-4 text-bark-400" />
          <h4 className="text-sm font-medium text-bark-600">高级参数（可选）</h4>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-bark-400 mb-1.5">日常客流（人/天）</label>
            <input
              type="number"
              value={inputValues.dailyFlow}
              onChange={(e) => handleInputChange('dailyFlow', e.target.value)}
              onFocus={() => handleFocus('dailyFlow')}
              onBlur={() => handleInputBlur('dailyFlow', parseInt, 1, 500, params.dailyFlow)}
              min="1"
              className="input-field"
              disabled={loading}
            />
            {focusedField === 'dailyFlow' && (
              <span className="text-xs text-bark-400 mt-1 block">填写完成后点击其他区域生效</span>
            )}
          </div>
          <div>
            <label className="block text-xs text-bark-400 mb-1.5">物料成本率</label>
            <input
              type="number"
              value={inputValues.materialCostRate}
              onChange={(e) => handleInputChange('materialCostRate', e.target.value)}
              onFocus={() => handleFocus('materialCostRate')}
              onBlur={() => handleInputBlur('materialCostRate', parseFloat, 0, 0.9, params.materialCostRate)}
              step="0.05"
              min="0"
              max="0.9"
              className="input-field"
              disabled={loading}
            />
            {focusedField === 'materialCostRate' && (
              <span className="text-xs text-bark-400 mt-1 block">填写完成后点击其他区域生效</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
