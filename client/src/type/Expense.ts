interface Expense {
    name: string
    amount: number
    dateTime: string
    payer: User
    debtors: Array<UserWithAmount>
}