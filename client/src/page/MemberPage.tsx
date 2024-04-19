import { useRecoilValue } from "recoil";
import MemberBox from "../components/MemberBox";
import { groupState } from "../store/groupState";

const MemberPage = () => {
  const group = useRecoilValue(groupState);
  return (
    <div className="w-screen flex flex-col h-screen overflow-scroll gap-3 p-8">
      <div className="text-center text-lg sticky top-0 bg-white">
        Group Members
      </div>
      {group.members.map((profile) => (
        <div className="flex h-12 items-center gap-4" key={profile.userId}>
          <MemberBox profile={profile} />
        </div>
      ))}
    </div>
  );
};

export default MemberPage;
