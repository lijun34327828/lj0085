import { useState, useEffect, useCallback, useRef } from 'react';
import type { CalculatorParams, CalculatorState, CalculateResponse, CalculateRequest } from '../types';

const DEFAULT_PARAMS: CalculatorParams = {
  discountRate: 0.8,
  estimatedFlow: 80,
  avgPrice: 128,
  dailyFlow: 50,
  materialCostRate: 0.3,
};

const API_BASE_URL = '/api';

export function useCalculator() {
  const [state, setState] = useState<CalculatorState>({
    params: DEFAULT_PARAMS,
    result: null,
    loading: false,
    error: null,
    lastUpdated: null,
  });

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const calculate = useCallback(async (params: CalculatorParams) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    abortControllerRef.current = new AbortController();

    debounceRef.current = setTimeout(async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));

      try {
        const requestData: CalculateRequest = {
          discountRate: params.discountRate,
          estimatedFlow: params.estimatedFlow,
          avgPrice: params.avgPrice,
          dailyFlow: params.dailyFlow,
          materialCostRate: params.materialCostRate,
        };

        const response = await fetch(`${API_BASE_URL}/calculate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData),
          signal: abortControllerRef.current?.signal,
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `请求失败: ${response.status}`);
        }

        const result: CalculateResponse = await response.json();

        setState(prev => ({
          ...prev,
          result,
          loading: false,
          lastUpdated: new Date(),
        }));
      } catch (error: unknown) {
        if ((error as Error).name === 'AbortError') {
          return;
        }
        setState(prev => ({
          ...prev,
          loading: false,
          error: error instanceof Error ? error.message : '计算失败，请稍后重试',
        }));
      }
    }, 150);
  }, []);

  const updateParam = useCallback(<K extends keyof CalculatorParams>(
    key: K,
    value: CalculatorParams[K]
  ) => {
    setState(prev => {
      const newParams = { ...prev.params, [key]: value };
      calculate(newParams);
      return { ...prev, params: newParams };
    });
  }, [calculate]);

  const setParams = useCallback((params: Partial<CalculatorParams>) => {
    setState(prev => {
      const newParams = { ...prev.params, ...params };
      calculate(newParams);
      return { ...prev, params: newParams };
    });
  }, [calculate]);

  const resetParams = useCallback(() => {
    setState(prev => {
      calculate(DEFAULT_PARAMS);
      return { ...prev, params: DEFAULT_PARAMS };
    });
  }, [calculate]);

  useEffect(() => {
    calculate(DEFAULT_PARAMS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [calculate]);

  return {
    ...state,
    updateParam,
    setParams,
    resetParams,
  };
}
