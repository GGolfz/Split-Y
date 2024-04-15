export const calculateAmountPerPerson = (
  totalAmount: number,
  numberOfMember: number
): number => {
  return Math.ceil((totalAmount * 100) / numberOfMember) / 100;
};
