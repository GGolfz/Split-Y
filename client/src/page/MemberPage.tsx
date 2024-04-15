import { useEffect, useState } from "preact/hooks";
import { LineProfile } from "../model/LineProfile";
import { ApiService } from "../service/ApiService";
import MemberBox from "../components/MemberBox";

const MemberPage = ({ groupId, accessToken }: PageProp) => {
  const [members, setMembers] = useState<Array<LineProfile>>([]);
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
    <div className="w-60 flex flex-col h-96 overflow-scroll gap-3">
      <div className="text-center text-lg sticky top-0 bg-white ">
        Group Members
      </div>
      {members.map((profile) => (
        <div className="flex h-16 items-center gap-4" key={profile.userId}>
          <MemberBox profile={profile} />
        </div>
      ))}
    </div>
  );
};

export default MemberPage;
