import { useEffect, useState } from "preact/hooks";
import { ApiService } from "../service/ApiService";
import { LineProfile } from "../model/LineProfile";
import { ExpenseRequest } from "../model/ExpenseRequest";
import CommonButton, { ButtonType } from "../components/CommonButton";
import TextField, { TextFieldType } from "../components/TextField";
import SingleSelect from "../components/SingleSelect";
import MultipleSelect from "../components/MultipleSelect";
import { Expense } from "../model/ExpenseResponse";

interface UpdateExpensePageProps extends PageProp {
  expenseData: Expense;
  onClose: () => void;
}
const UpdateExpensePage = ({
  groupId,
  accessToken,
  onClose,
  expenseData,
}: UpdateExpensePageProps) => {
  const [members, setMembers] = useState<Array<LineProfile>>([]);
  const [formData, setFormData] = useState<{
    name: string;
    amount: string;
    payerId: string;
    debtorIds: Array<string>;
  }>({
    name: expenseData.name,
    amount: expenseData.amount.toFixed(2),
    payerId: expenseData.payer.userId,
    debtorIds: expenseData.debtors.map((d) => d.profile.userId),
  });
  const getMembers = async () => {
    try {
      const response = await ApiService.getGroup(groupId, accessToken);
      if (response.isSuccess && response.data) {
        setMembers(response.data.members);
      }
    } catch (exception) {
      console.error(exception);
    }
  };
  const isFormValid =
    formData.name.length !== 0 &&
    !!parseFloat(formData.amount) &&
    formData.payerId.length !== 0 &&
    formData.debtorIds.length !== 0;
  const handleUpdateExpense = async () => {
    if (isFormValid) {
      const request: ExpenseRequest = {
        name: formData.name,
        amount: parseFloat(formData.amount),
        payerId: formData.payerId,
        debtorIds: formData.debtorIds,
      };
      const response = await ApiService.updateExpense(
        groupId,
        accessToken,
        expenseData.id,
        request
      );
      if (response.isSuccess) {
        onClose();
        return;
      }
      alert("Failed to create expense, please try again");
      return;
    }
  };

  useEffect(() => {
    getMembers();
  }, []);
  return (
    <div className="w-64 flex flex-col max-h-screen gap-4">
      <div className="text-center text-lg sticky top-0 bg-white ">
        Update an Expense
      </div>
      <TextField
        type={TextFieldType.Text}
        name="Name"
        value={formData.name}
        onChange={(name) => setFormData((formData) => ({ ...formData, name }))}
      />
      <TextField
        type={TextFieldType.Number}
        name="Amount"
        value={formData.amount}
        onChange={(amount) =>
          setFormData((formData) => ({
            ...formData,
            amount,
          }))
        }
      />
      <SingleSelect
        name="Paid by"
        value={formData.payerId}
        onChange={(payerId) => {
          setFormData((formData) => ({
            ...formData,
            payerId,
          }));
        }}
        valueList={members}
      />
      <MultipleSelect
        name="Split equally to"
        values={formData.debtorIds}
        onChange={(debtorIds) => {
          setFormData((formData) => ({
            ...formData,
            debtorIds,
          }));
        }}
        valueList={members}
      />
      <div className="flex justify-around">
        <CommonButton
          text="Delete"
          onClick={handleUpdateExpense}
          disable={!isFormValid}
          type={ButtonType.DANGER}
        />
        <CommonButton
          text="Update"
          onClick={handleUpdateExpense}
          disable={!isFormValid}
        />
      </div>
    </div>
  );
};

export default UpdateExpensePage;
