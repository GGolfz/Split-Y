import GroupIcon from "../icons/GroupIcon";
import SummaryIcon from "../icons/SummaryIcon";

interface NavbarWithActionProp extends PageProp {
  onDisplayMember: () => void;
  onDisplaySummary: () => void;
}
const NavbarWithAction = ({
  onDisplayMember,
  onDisplaySummary,
}: NavbarWithActionProp) => {
  return (
    <div className="flex justify-between w-screen p-4">
      <div className="cursor-pointer" role="button" onClick={onDisplayMember}>
        <GroupIcon />
      </div>
      <div className="text-xl font-semibold text-violet-500">Split Y</div>
      <div className="cursor-pointer" role="button" onClick={onDisplaySummary}>
        <SummaryIcon />
      </div>
    </div>
  );
};

export default NavbarWithAction;
