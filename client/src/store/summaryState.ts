import { atom, SetterOrUpdater } from "recoil";
import { ApiService } from "../service/ApiService";
import { Nullable } from "../type/Nullable";
import GroupResponse from "../model/GroupResponse";
import { Transaction } from "../model/SummaryResponse";

interface ExpenseSummary {
  totalTransactions: Array<Transaction>;
  simplifyTransactions: Array<Transaction>;
}

export const summaryState = atom<ExpenseSummary>({
  key: "summaryState",
  default: {
    totalTransactions: Array<Transaction>(),
    simplifyTransactions: Array<Transaction>(),
  },
});

export const fetchSummary = async (
  accessToken: Nullable<string>,
  group: GroupResponse,
  setSummary: SetterOrUpdater<ExpenseSummary>
) => {
  if (accessToken !== null) {
    try {
      const response = await ApiService.getSummary(group.groupId, accessToken);
      if (response.isSuccess && response.data) {
        setSummary({
          totalTransactions: response.data.total,
          simplifyTransactions: response.data.simplify,
        });
      }
    } catch (exception) {
      console.error(exception);
    }
  }
};
