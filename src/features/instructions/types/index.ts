export interface Instruction {
    id: number;
    title: string;
    slug: string;
    content: string;
    category: string;
    excerpt?: string;
    order_index?: number;
}
