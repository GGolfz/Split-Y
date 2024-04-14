import { Expense } from "./Expense"

export interface Group {
    groupId: string
    lineGroupId: string
    members: Array<string>
    expenses: Array<Expense>
}