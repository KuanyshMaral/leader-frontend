import { ApplicationStatus, UserRole, DocumentStatus, ProductType, UserStatus } from './enums';

// User models
export interface User {
    id: number;
    email: string;
    fio: string;
    phone: string;
    role: UserRole;
    status: UserStatus;
    company_name?: string;
    company_inn?: string;
    avatar?: string;
    bank_id?: number;
    personal_manager_id?: number;
    referrer_agent_id?: number;
    gender?: string;
    timezone?: string;
    preferences?: Record<string, any>;
}

// Bank model
export interface Bank {
    id: number;
    name: string;
    logo_path?: string;
    conditions: Record<string, any>;
    status: string;
}

// Application model
export interface Application {
    id: number;
    client_user_id: number;
    agent_user_id?: number;
    bank_id: number;
    product_type: ProductType;
    status: ApplicationStatus;
    amount: number;
    term_days: number;
    product_data: Record<string, any>;
    offer_data?: Record<string, any>;
    commission_amount?: number;
    tariff_rate?: number;
    created_at: string;
    updated_at: string;
    deleted_at?: string;

    // Relations
    client_user?: User;
    agent_user?: User;
    bank?: Bank;
}

// Document model
export interface Document {
    id: number;
    uploader_user_id: number;
    company_id?: number;
    application_id?: number;
    message_id?: number;
    doc_type: string;
    status: DocumentStatus;
    rejection_reason?: string;
    file?: UploadedFile;
    created_at: string;
    deleted_at?: string;
}

// Uploaded File model
export interface UploadedFile {
    id: number;
    original_name: string;
    stored_name: string;
    mime_type: string;
    size: number;
    path: string;
}

// Pagination response
export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    limit: number;
}

// API Error
export interface ApiError {
    message: string;
    errors?: Record<string, string[]>;
}
