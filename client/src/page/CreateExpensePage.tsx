import { useEffect, useState } from "preact/hooks";
import { ApiService } from "../service/ApiService";
import { LineProfile } from "../model/LineProfile";
import MemberBox from "../components/MemberBox";
import { ExpenseRequest } from "../model/ExpenseRequest";

const CreateExpensePage = ({ groupId, accessToken }: PageProp) => {
  const [members, setMembers] = useState<Array<LineProfile>>([]);
  const [formData, setFormData] = useState<ExpenseRequest>({
    name: "",
    amount: 0,
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
    <div className="w-60 flex flex-col h-96 overflow-scroll gap-2">
      <div className="text-center text-lg sticky top-0 bg-white ">
        Create an Expense
      </div>
      <div className="flex h-8 items-center gap-4">
        <div>Name</div> <input type="text" className="border box-border" />
      </div>
      <div className="flex h-8 items-center gap-4">
        <div>Amount</div>
        <div>
          <input type="number" className="border box-border" />
        </div>
      </div>
      <div className="flex h-8 items-center gap-4">
        <div>Paid by</div>
        <div>
          <select name="payer">
            {members.map((profile) => (
              <option>{profile.displayName}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex h-8 items-center gap-4">
        <input type="checkbox" />
        Select All
      </div>
      {members.map((profile) => (
        <div className="flex h-16 items-center gap-4" key={profile.userId}>
          <input type="checkbox" />
          <MemberBox profile={profile} />
        </div>
      ))}
    </div>
  );
};

export default CreateExpensePage;
