interface ExpenseRequest {
  name: string;
  amount: number;
  payerId: string;
  debtorIds: Array<string>;
}
export type { ExpenseRequest };
