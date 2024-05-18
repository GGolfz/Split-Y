import BillIcon from "../icons/BillIcon.tsx";
import { Expense } from "../model/ExpenseResponse.ts";
import { LineProfile } from "../model/LineProfile.ts";
import { formatAmount } from "../utils/format.ts";
interface Props {
  expense: Expense;
  currentUser: LineProfile;
  onClick: () => void;
}
const ExpenseItem = (props: Props) => {
  const isPaidByCurrentUser = props.expense.payer.userId === props.currentUser.userId;
  const currentUserDebt = props.expense.debtors.find(
    (debtor) => debtor.profile.userId === props.currentUser.userId
  );
  const renderAmount = () => {
    if (!!currentUserDebt || isPaidByCurrentUser) {
      return (
        <>
          {isPaidByCurrentUser ? "You" : props.expense.payer.displayName} paid{" "}
          {formatAmount(props.expense.amount)}
        </>
      );
    }
    return <>You were not involved</>;
  };
  const renderSummary = () => {
    if (isPaidByCurrentUser) {
      return (
        <>
          <div className="text-green-500">you lent</div>
          <div className="text-green-500">
            {formatAmount(
              props.expense.amount - (currentUserDebt?.amount ?? 0)
            )}
          </div>
        </>
      );
    } else if (!!currentUserDebt) {
      return (
        <>
          <div className="text-red-500">you borrowed</div>
          <div className="text-red-500">{formatAmount(currentUserDebt.amount)}</div>
        </>
      );
    }
    return <>not involved </>;
  };
  return (
    <div className="flex space-between gap-2 shadow-md mx-6 my-2 p-4 rounded cursor-pointer" onClick={props.onClick}>
      <div className="bg-neutral-800 p-2 h-min">
        <BillIcon />
      </div>
      <div className="flex-auto flex flex-col overflow-hidden">
        <div className="text-sm font-semibold text-violet-500">{props.expense.name}</div>
        <div className="text-xs text-neutral-400">{renderAmount()}</div>
      </div>
      <div className="w-24 text-end flex flex-col text-xs text-neutral-400">
        {renderSummary()}
      </div>
    </div>
  );
};

export default ExpenseItem;
