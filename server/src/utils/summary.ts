import { Expense } from "../model/ExpenseResponse";
import { LineProfile } from "../model/LineProfile";
import { Transaction } from "../model/SummaryResponse";

export const getTotalTransactions = (
  expenses: Array<Expense>,
  memberProfilesMap: Map<string, LineProfile>
): Array<Transaction> => {
  const debtMap: Map<string, Map<string, number>> = new Map();
  expenses.map((expense) => {
    expense.debtors.map((debtor) => {
      const isPayer = debtor.profile.userId === expense.payer.userId;
      const payFrom = debtor.profile.userId;
      const payTo = expense.payer.userId;
      const amount = expense.amount;
      if (!isPayer) {
        const payToMap = debtMap.get(payFrom) ?? new Map<string, number>();
        const currentDebt = payToMap.get(payTo) ?? 0;
        payToMap.set(payTo, currentDebt + amount);
        debtMap.set(payFrom, payToMap);
      }
    });
  });
  const transactions = [];
  for (let payFrom of debtMap.keys()) {
    for (let payTo of debtMap.get(payFrom)?.keys() ?? []) {
      const amount = debtMap.get(payFrom)?.get(payTo) ?? 0;
      const payFromProfile = memberProfilesMap.get(payFrom);
      const payToProfile = memberProfilesMap.get(payTo);
      if (amount !== 0) {
        transactions.push({
          payFrom: payFromProfile ?? {
            userId: payFrom,
          },
          payTo: payToProfile ?? {
            userId: payTo,
          },
          amount: amount,
        });
      }
    }
  }
  return transactions;
};

export const getSimplifyTransactions = (
  expenses: Array<Expense>,
  memberProfilesMap: Map<string, LineProfile>
): Array<Transaction> => {
  const debtInvolvedMap: Map<string, number> = new Map();
  const paidMap: Map<string, number> = new Map();
  expenses.forEach((expense) => {
    const amount = expense.amount;
    const payerId = expense.payer.userId;
    const currentPay = paidMap.get(payerId) ?? 0;
    paidMap.set(payerId, currentPay + amount);
    expense.debtors.forEach((debtor) => {
      const userId = debtor.profile.userId;
      const currentDebt = debtInvolvedMap.get(userId) ?? 0;
      debtInvolvedMap.set(userId, currentDebt + amount);
    });
  });
  const resultMap: Map<string, number> = new Map();
  for (let userId of memberProfilesMap.keys()) {
    const amount =
      (paidMap.get(userId) ?? 0) - (debtInvolvedMap.get(userId) ?? 0);
    resultMap.set(userId, amount);
  }
  const maxPayer = [...resultMap.entries()].find(
    (record) => record[1] === Math.max(...resultMap.values())
  );
  const transactions: Array<Transaction> = [];
  if (!!maxPayer) {
    const maxPayerId = maxPayer[0];
    for (let userId of resultMap.keys()) {
      const amount = resultMap.get(userId) ?? 0;
      if (userId !== maxPayerId) {
        if (amount < 0) {
          transactions.push({
            payFrom: memberProfilesMap.get(userId) ?? {
              userId: userId,
            },
            payTo: memberProfilesMap.get(maxPayerId) ?? {
              userId: maxPayerId,
            },
            amount: -amount,
          });
        } else if (amount > 0) {
          transactions.push({
            payFrom: memberProfilesMap.get(maxPayerId) ?? {
              userId: maxPayerId,
            },
            payTo: memberProfilesMap.get(userId) ?? {
              userId: userId,
            },
            amount: amount,
          });
        }
      }
    }
  }
  return transactions;
};
