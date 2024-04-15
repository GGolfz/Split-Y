import { useEffect, useState } from "preact/hooks";
import CommonButton from "../components/CommonButton";
import { Expense } from "../model/ExpenseResponse";
import ExpenseItem from "../components/ExpenseItem";
import { LineProfile } from "../model/LineProfile";
import { ApiService } from "../service/ApiService";

interface ExpensePageProp extends PageProp {
  currentUser: LineProfile;
}
const ExpensePage = ({
  groupId,
  accessToken,
  currentUser,
}: ExpensePageProp) => {
  const [expenses, setExpenses] = useState<Array<Expense>>([]);
  const getExpenses = async () => {
    try {
      const response = await ApiService.getExpenses(groupId, accessToken);
      if (response.isSuccess && response.data) {
        setExpenses(response.data.expenses);
      }
    } catch (exception) {
      console.error(exception);
    }
  };
  useEffect(() => {
    getExpenses();
  }, []);
  return (
    <>
      <div className="flex flex-col flex-auto">
        {expenses.length === 0 ? (
          <>No expense in the group yet</>
        ) : (
          <>
            {expenses.map((expense) => (
              <ExpenseItem expense={expense} currentUser={currentUser} />
            ))}
          </>
        )}
      </div>
      <div className="py-6 flex justify-center">
        <CommonButton text="Add an expense" onClick={() => {}} />
      </div>
    </>
  );
};

export default ExpensePage;
