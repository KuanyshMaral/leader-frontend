/**
 * Format number as currency (RUB)
 */
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount);
};

/**
 * Format number with spaces (e.g., 1000000 -> 1 000 000)
 */
export const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('ru-RU').format(num);
};

/**
 * Format date to Russian locale
 */
export const formatDate = (date: string | Date): string => {
    return new Date(date).toLocaleDateString('ru-RU');
};

/**
 * Format date with time
 */
export const formatDateTime = (date: string | Date): string => {
    return new Date(date).toLocaleString('ru-RU');
};

/**
 * Format relative time (e.g., "2 дня назад")
 */
export const formatRelativeTime = (date: string | Date): string => {
    const now = new Date();
    const past = new Date(date);
    const diffMs = now.getTime() - past.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Сегодня';
    if (diffDays === 1) return 'Вчера';
    if (diffDays < 7) return `${diffDays} дней назад`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} недель назад`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} месяцев назад`;
    return `${Math.floor(diffDays / 365)} лет назад`;
};
