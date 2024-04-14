export interface Expense {
    name: string
    amount: string
    created_at: number
    created_by: string
    updated_at?: number
    updated_by?: string
    payerId: string
    debtorIds: Array<string>
}