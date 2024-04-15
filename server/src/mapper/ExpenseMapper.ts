import { Expense as PrismaExpense } from "@prisma/client";
import { Debtor, Expense } from "../model/ExpenseResponse";
import { LineProfile } from "../model/LineProfile";
import { calculateAmountPerPerson } from "../utils/calculate";

export abstract class ExpenseMapper {
  static fromPrismaModel(
    expense: PrismaExpense,
    memberProfilesMap: Map<string, LineProfile>
  ): Expense {
    return {
      id: expense.id,
      name: expense.name,
      amount: expense.amount,
      payer: memberProfilesMap.get(expense.payerId),
      debtors: expense.debtorIds.map(
        (debtorId) =>
          ({
            profile: memberProfilesMap.get(debtorId),
            amount: calculateAmountPerPerson(
              expense.amount,
              expense.debtorIds.length
            ),
          } as Debtor)
      ),
      createdAt: expense.createdAt,
      createdBy: memberProfilesMap.get(expense.createdBy),
      updatedAt: expense.updatedAt,
      updatedBy: expense.updatedBy && memberProfilesMap.get(expense.updatedBy),
    } as Expense;
  }
}
