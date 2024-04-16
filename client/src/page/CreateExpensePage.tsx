import { useEffect, useState } from "preact/hooks";
import { ApiService } from "../service/ApiService";
import { LineProfile } from "../model/LineProfile";
import { ExpenseRequest } from "../model/ExpenseRequest";
import CommonButton from "../components/CommonButton";
import TextField, { TextFieldType } from "../components/TextField";
import SingleSelect from "../components/SingleSelect";
import MultipleSelect from "../components/MultipleSelect";

interface CreateExpensePageProps extends PageProp {
  onClose: () => void;
}
const CreateExpensePage = ({
  groupId,
  accessToken,
  onClose,
}: CreateExpensePageProps) => {
  const [members, setMembers] = useState<Array<LineProfile>>([]);
  const [formData, setFormData] = useState<{
    name: string;
    amount: string;
    payerId: string;
    debtorIds: Array<string>;
  }>({
    name: "",
    amount: "0",
    payerId: "",
    debtorIds: [],
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
  const handleCreateExpense = async () => {
    if (
      formData.name.length !== 0 &&
      !!parseFloat(formData.amount) &&
      formData.payerId.length !== 0 &&
      formData.debtorIds.length !== 0
    ) {
      const request: ExpenseRequest = {
        name: formData.name,
        amount: parseFloat(formData.amount),
        payerId: formData.payerId,
        debtorIds: formData.debtorIds,
      };
      const response = await ApiService.createExpense(
        groupId,
        accessToken,
        request
      );
      if (response.isSuccess) {
        onClose();
        return;
      }
      alert("Failed to create expense, please try again");
      return;
    }
    alert("Form is not valid :(");
  };

  useEffect(() => {
    getMembers();
  }, []);
  return (
    <div className="w-64 flex flex-col max-h-screen gap-4">
      <div className="text-center text-lg sticky top-0 bg-white ">
        Create an Expense
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
      <CommonButton text="Create an expense" onClick={handleCreateExpense} />
    </div>
  );
};

export default CreateExpensePage;
