import { useEffect, useState } from "preact/hooks";
import { ApiService } from "../service/ApiService";
import { LineProfile } from "../model/LineProfile";
import MemberBox from "../components/MemberBox";
import { ExpenseRequest } from "../model/ExpenseRequest";
import CommonButton from "../components/CommonButton";
import TextField, { TextFieldType } from "../components/TextField";
import SingleSelect from "../components/SingleSelect";
import MultipleSelect from "../components/MultipleSelect";

const CreateExpensePage = ({ groupId, accessToken }: PageProp) => {
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
      <CommonButton text="Create an expense" onClick={() => {}} />
    </div>
  );
};

export default CreateExpensePage;
