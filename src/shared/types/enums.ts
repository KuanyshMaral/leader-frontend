// Shared Enums matching backend
export enum ApplicationStatus {
    DRAFT = 'draft',
    SUBMITTED = 'submitted',
    UNDER_REVIEW = 'under_review',
    APPROVED = 'approved',
    COMPLETED = 'completed',
    REJECTED = 'rejected',
    CANCELLED = 'cancelled',
}

export enum UserRole {
    CLIENT = 'client',
    AGENT = 'agent',
    PARTNER = 'partner',
    ADMIN = 'admin',
}

export enum DocumentStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
}

export enum ProductType {
    BANK_GUARANTEE = 'bank_guarantee',
    LOAN = 'loan',
    FACTORING = 'factoring',
    RKO = 'rko',
}

export enum UserStatus {
    PENDING_REVIEW = 'pending_review',
    ACTIVE = 'active',
    SUSPENDED = 'suspended',
    REJECTED = 'rejected',
}
