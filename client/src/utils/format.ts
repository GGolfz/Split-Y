const formatAmount = (amount: number): string => {
  if (isNaN(amount) || !isFinite(amount)) return `THB 0.00`;
  return `THB ${amount.toFixed(2)}`;
};

export { formatAmount };
