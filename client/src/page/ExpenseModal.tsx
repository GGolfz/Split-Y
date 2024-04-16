import { useRecoilValue, useRecoilState, useSetRecoilState } from "recoil";
import { useState } from "preact/hooks";
import { ApiService } from "../service/ApiService";
import { ExpenseRequest } from "../model/ExpenseRequest";
import CommonButton, { ButtonType } from "../components/CommonButton";
import TextField, { TextFieldType } from "../components/TextField";
import SingleSelect from "../components/SingleSelect";
import MultipleSelect from "../components/MultipleSelect";
import { selectedExpenseState } from "../store/selectedExpenseState";
import { groupState } from "../store/groupState";
import { accessTokenState } from "../store/accessTokenState";
import { PageState, pageState } from "../store/pageState";
import { expenseState, fetchExpenses } from "../store/expensesState";
import { webSocketState } from "../store/webSocketState";

const ExpenseModal = () => {
  const [selectedExpense, setSelectedExpense] =
    useRecoilState(selectedExpenseState);
  const group = useRecoilValue(groupState);
  const accessToken = useRecoilValue(accessTokenState);
  const setPage = useSetRecoilState(pageState);
  const setExpenses = useSetRecoilState(expenseState);
  const webSocket = useRecoilValue(webSocketState)
  const [formData, setFormData] = useState<{
    name: string;
    amount: string;
    payerId: string;
    debtorIds: Array<string>;
  }>({
    name: selectedExpense?.name ?? "",
    amount: selectedExpense?.amount.toFixed(2) ?? "",
    payerId: selectedExpense?.payer.userId ?? "",
    debtorIds:
      selectedExpense?.debtors.map((d) => d.profile.userId) ?? Array<string>(),
  });
  const isFormValid =
    formData.name.length !== 0 &&
    !!parseFloat(formData.amount) &&
    formData.payerId.length !== 0 &&
    formData.debtorIds.length !== 0;

  const handleCloseModal = () => {
    setSelectedExpense(null);
    setPage(PageState.MAIN);
    fetchExpenses(accessToken, group, setExpenses);
    webSocket?.send('expenses')
  };
  const handleCreateExpense = async () => {
    if (isFormValid && accessToken != null) {
      const request: ExpenseRequest = {
        name: formData.name,
        amount: parseFloat(formData.amount),
        payerId: formData.payerId,
        debtorIds: formData.debtorIds,
      };
      const response = await ApiService.createExpense(
        group.groupId,
        accessToken,
        request
      );
      if (response.isSuccess) {
        handleCloseModal();
        return;
      }
      alert("Failed to create expense, please try again");
    }
  };
  const handleUpdateExpense = async () => {
    if (isFormValid && selectedExpense !== null && accessToken !== null) {
      const request: ExpenseRequest = {
        name: formData.name,
        amount: parseFloat(formData.amount),
        payerId: formData.payerId,
        debtorIds: formData.debtorIds,
      };
      const response = await ApiService.updateExpense(
        group.groupId,
        accessToken,
        selectedExpense.id,
        request
      );
      if (response.isSuccess) {
        handleCloseModal();
        return;
      }
      alert("Failed to update expense, please try again");
    }
  };
  const handleDeleteExpense = async () => {
    const isConfirm = confirm("Are you sure to remove an expense?");
    if (selectedExpense !== null && accessToken !== null && isConfirm) {
      const response = await ApiService.deleteExpense(
        group.groupId,
        accessToken,
        selectedExpense.id
      );
      if (response.isSuccess) {
        handleCloseModal();
        return;
      }
      alert("Failed to delete expense, please try again");
    }
  };

  const renderActionButton = () => {
    if (selectedExpense !== null) {
      return (
        <div className="flex justify-around">
          <CommonButton
            text="Delete"
            onClick={handleDeleteExpense}
            disable={!isFormValid}
            type={ButtonType.DANGER}
          />
          <CommonButton
            text="Update"
            onClick={handleUpdateExpense}
            disable={!isFormValid}
          />
        </div>
      );
    }
    return (
      <CommonButton
        text="Create an expense"
        onClick={handleCreateExpense}
        disable={!isFormValid}
      />
    );
  };

  return (
    <div className="w-64 flex flex-col max-h-screen gap-4">
      <div className="text-center text-lg sticky top-0 bg-white ">
        {selectedExpense === null ? "Create" : "Update"} an Expense
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
        valueList={group.members}
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
        valueList={group.members}
      />
      {renderActionButton()}
    </div>
  );
};

export default ExpenseModal;
