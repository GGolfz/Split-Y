import { atom, SetterOrUpdater } from "recoil";
import { Expense } from "../model/ExpenseResponse";
import { ApiService } from "../service/ApiService";
import { Nullable } from "../type/Nullable";
import GroupResponse from "../model/GroupResponse";
export const expenseState = atom({
  key: "expenses",
  default: Array<Expense>(),
});

export const fetchExpenses = async (
  accessToken: Nullable<string>,
  group: GroupResponse,
  setExpenses: SetterOrUpdater<Array<Expense>>
) => {
  if (accessToken !== null) {
    try {
      const response = await ApiService.getExpenses(group.groupId, accessToken);
      if (response.isSuccess && response.data) {
        setExpenses(response.data.expenses);
      }
    } catch (exception) {
      console.error(exception);
    }
  }
};
