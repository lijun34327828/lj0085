import React from 'react';
import { Calculator, Sparkles, Store } from 'lucide-react';
import { useCalculator } from '../hooks/useCalculator';
import { ParameterPanel } from '../components/ParameterPanel';
import { ResultCards } from '../components/ResultCards';
import { ComparisonTable } from '../components/ComparisonTable';
import { DataCharts } from '../components/DataCharts';
import { formatDate } from '../utils/format';

export default function Home() {
  const {
    params,
    result,
    loading,
    error,
    lastUpdated,
    updateParam,
    resetParams,
  } = useCalculator();

  const today = new Date();

  return (
    <div className="min-h-screen paper-bg">
      <header
        className="border-b border-cream-200/60 bg-white/50 backdrop-blur-sm sticky top-0 z-10 opacity-0 animate-fade-in-up"
        style={{ animationDelay: '0ms' }}
      >
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-clay-500 to-clay-600 text-white">
                <Calculator className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-serif text-xl font-bold text-bark-700">
                周末主题活动
                <span className="text-clay-500">让利成本预估</span>
              </h1>
              <p className="text-xs text-bark-400">
                精准测算 · 智慧经营</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 text-sm text-bark-500">
                <Store className="w-4 h-4" />
                <span className="hidden sm:inline">手作门店</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-bark-400">
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">{formatDate(today)}</span>
              </div>
            </div>
          </div>
          </div>
      </header>

      <main className="container py-8">
        {error && (
          <div className="mb-6 p-4 bg-terracotta-50 border border-terracotta-200 rounded-xl text-terracotta-700 text-sm opacity-0 animate-fade-in-up">
            <strong className="font-medium">计算出错：</strong>
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <ParameterPanel
              params={params}
              onUpdate={updateParam}
              onReset={resetParams}
              loading={loading}
            />
          </div>

          <div className="lg:col-span-8 space-y-6">
            <ResultCards
              result={result}
              loading={loading}
              lastUpdated={lastUpdated}
            />

            <div className="hand-divider" />

            <ComparisonTable
              result={result}
              loading={loading}
            />

            <DataCharts
              result={result}
              loading={loading}
            />
          </div>
        </div>
      </main>

      <footer className="border-t border-cream-200/60 mt-12 py-6 opacity-0 animate-fade-in-up" style={{ animationDelay: '800ms' }}>
        <div className="container text-center">
          <p className="text-sm text-bark-400">
            © 2024 手作门店活动测算工具 · 让每一场活动都精准可控
          </p>
          <p className="text-xs text-bark-300 mt-1">
            前端端口 3861 · 后端服务端口 8865
          </p>
        </div>
      </footer>
    </div>
  );
}
