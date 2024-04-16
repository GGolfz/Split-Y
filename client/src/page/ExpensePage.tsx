import CommonButton from "../components/CommonButton";
import { Expense } from "../model/ExpenseResponse";
import ExpenseItem from "../components/ExpenseItem";
import { LineProfile } from "../model/LineProfile";

interface ExpensePageProp extends PageProp {
  currentUser: LineProfile;
  expenses: Array<Expense>;
  onCreateExpense: () => void;
  onUpdateExpense: (expenseId: string) => void;
}
const ExpensePage = ({
  currentUser,
  expenses,
  onCreateExpense,
  onUpdateExpense,
}: ExpensePageProp) => {
  return (
    <>
      <div className="flex flex-col flex-auto">
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
                onClick={() => onUpdateExpense(expense.id)}
              />
            ))}
          </>
        )}
      </div>
      <div className="py-6 flex justify-center">
        <CommonButton text="Add an expense" onClick={onCreateExpense} />
      </div>
    </>
  );
};

export default ExpensePage;
