interface Expense {
    name: string
    amount: number
    payer: User
    debtors: Array<UserWithAmount>
}