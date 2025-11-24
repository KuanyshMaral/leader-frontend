import { ApplicationStatus, DocumentStatus, ProductType } from '@shared/types/enums';

// Status labels
export const APPLICATION_STATUS_LABELS: Record<ApplicationStatus, string> = {
    [ApplicationStatus.DRAFT]: 'Черновик',
    [ApplicationStatus.SUBMITTED]: 'Отправлена',
    [ApplicationStatus.UNDER_REVIEW]: 'На рассмотрении',
    [ApplicationStatus.APPROVED]: 'Одобрена',
    [ApplicationStatus.REJECTED]: 'Отклонена',
    [ApplicationStatus.CANCELLED]: 'Отменена',
};

export const DOCUMENT_STATUS_LABELS: Record<DocumentStatus, string> = {
    [DocumentStatus.PENDING]: 'На модерации',
    [DocumentStatus.APPROVED]: 'Одобрен',
    [DocumentStatus.REJECTED]: 'Отклонен',
};

export const PRODUCT_TYPE_LABELS: Record<ProductType, string> = {
    [ProductType.BANK_GUARANTEE]: 'Банковская гарантия',
    [ProductType.LOAN]: 'Кредит',
    [ProductType.FACTORING]: 'Факторинг',
    [ProductType.RKO]: 'РКО',
};

// Status colors for badges
export const APPLICATION_STATUS_COLORS: Record<ApplicationStatus, string> = {
    [ApplicationStatus.DRAFT]: 'gray',
    [ApplicationStatus.SUBMITTED]: 'blue',
    [ApplicationStatus.UNDER_REVIEW]: 'yellow',
    [ApplicationStatus.APPROVED]: 'green',
    [ApplicationStatus.REJECTED]: 'red',
    [ApplicationStatus.CANCELLED]: 'gray',
};

// Pagination defaults
export const DEFAULT_PAGE_SIZE = 20;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];

// File upload
export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_FILE_TYPES = [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];
