const formatAmount = (amount: number): string => {
    return `THB ${amount.toFixed(2)}`
}

export {
    formatAmount
}