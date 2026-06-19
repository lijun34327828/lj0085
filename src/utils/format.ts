export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

export function formatPercent(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatDiscount(value: number): string {
  return `${(value * 10).toFixed(1)}折`;
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  });
}

export function getChangeIndicator(value: number): {
  sign: '+' | '-' | '';
  color: string;
  icon: 'trending-up' | 'trending-down' | 'minus';
} {
  if (value > 0) {
    return { sign: '+', color: 'text-moss-600', icon: 'trending-up' };
  }
  if (value < 0) {
    return { sign: '-', color: 'text-terracotta-600', icon: 'trending-down' };
  }
  return { sign: '', color: 'text-bark-500', icon: 'minus' };
}
