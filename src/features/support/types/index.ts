export interface SupportTicket {
    id: number;
    subject: string;
    message: string;
    status: 'open' | 'in_progress' | 'resolved' | 'closed';
    created_at: string;
    updated_at: string;
}

export interface CreateSupportTicketRequest {
    subject: string;
    message: string;
    attachment_id?: number;
}

export interface Instruction {
    id: number;
    title: string;
    slug: string;
    content: string;
    category: string;
    excerpt?: string;
    order_index?: number;
}
