import { t } from "elysia"

interface ExpenseRequest {
    name: string
    amount: number
    payerId: string
    debtorIds: Array<string>
}
const ExpenseRequestType = t.Object({
    name: t.String(),
    amount: t.Number(),
    payerId: t.String(),
    debtorIds: t.Array(t.String())
})

export {ExpenseRequest, ExpenseRequestType};
