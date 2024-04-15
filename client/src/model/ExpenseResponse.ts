import { LineProfile } from "./LineProfile";

interface Expense {
  id: string;
  name: string;
  amount: number;
  payer: LineProfile;
  debtors: Array<Debtor>;
  createdAt: Date;
  createdBy: LineProfile;
  updatedAt?: Date;
  updatedBy?: LineProfile;
}
interface Debtor {
  profile: LineProfile;
  amount: number;
}
interface ExpenseResponse {
  expenses: Array<Expense>;
}

export type { ExpenseResponse, Expense, Debtor };
