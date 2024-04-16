import { atom } from "recoil";
import { Expense } from "../model/ExpenseResponse";
import { Nullable } from "../type/Nullable";
export const selectedExpenseState = atom<Nullable<Expense>>({
  key: "selectedExpense",
  default: null,
});
