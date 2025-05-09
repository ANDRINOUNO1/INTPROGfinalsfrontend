export interface RequestItem {
    name: string;
    quantity: number;
}

export interface Request {
    id: number;
    employeeId: number;
    type: string;
    items: RequestItem[];
    status: string;
} 