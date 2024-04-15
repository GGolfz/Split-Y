import { LineProfile } from "./LineProfile";

interface SummaryResponse {
  total: Array<Transaction>;
  simplify: Array<Transaction>;
}

interface Transaction {
  payFrom: LineProfile;
  payTo: LineProfile;
  amount: number;
}

export type { SummaryResponse, Transaction };
