import { useRecoilValue, useSetRecoilState } from "recoil";
import CommonButton from "../components/CommonButton";
import { Expense } from "../model/ExpenseResponse";
import ExpenseItem from "../components/ExpenseItem";
import { expenseState } from "../store/expensesState";
import { userState } from "../store/userState";
import { selectedExpenseState } from "../store/selectedExpenseState";
import { PageState, pageState } from "../store/pageState";
import { Nullable } from "../type/Nullable";

const ExpensePage = () => {
  const expenses = useRecoilValue(expenseState);
  const currentUser = useRecoilValue(userState);
  const setSelectedExpense = useSetRecoilState(selectedExpenseState);
  const setPage = useSetRecoilState(pageState);
  const handleExpenseAction = (expense: Nullable<Expense>) => {
    setSelectedExpense(expense);
    setPage(PageState.EXPENSE);
  };
  if (currentUser === null) {
    return <></>;
  }
  return (
    <>
      <div className="flex flex-col flex-auto overflow-y-scroll">
        {expenses.length === 0 ? (
          <div className="flex flex-col flex-auto text-center justify-center">
            No expense in the group yet
          </div>
        ) : (
          <>
            {expenses.map((expense) => (
              <ExpenseItem
                expense={expense}
                currentUser={currentUser}
                onClick={() => handleExpenseAction(expense)}
              />
            ))}
          </>
        )}
      </div>
      <div className="py-6 flex justify-center">
        <CommonButton
          text="Add an expense"
          onClick={() => handleExpenseAction(null)}
        />
      </div>
    </>
  );
};

export default ExpensePage;
