import { useRecoilState, useRecoilValue } from "recoil";
import { PageState, pageState } from "../store/pageState";
import { accessTokenState } from "../store/accessTokenState";
import GroupIcon from "../icons/GroupIcon";
import SummaryIcon from "../icons/SummaryIcon";
const Navbar = () => {
  const [page, setPage] = useRecoilState(pageState);
  const accessToken = useRecoilValue(accessTokenState);
  if (
    page === PageState.ERROR ||
    page === PageState.NOT_IN_GROUP ||
    accessToken === null
  )
    return (
      <div className="flex justify-center w-screen py-4">
        <div className="text-xl font-semibold text-violet-500">Split Y</div>
      </div>
    );
  return (
    <div className="flex justify-between w-screen p-6">
      <div
        className="cursor-pointer"
        role="button"
        onClick={() => setPage(PageState.MEMBERS)}
      >
        <GroupIcon />
      </div>
      <div className="text-xl font-semibold text-violet-500">Split Y</div>
      <div
        className="cursor-pointer"
        role="button"
        onClick={() => setPage(PageState.SUMMARY)}
      >
        <SummaryIcon />
      </div>
    </div>
  );
};

export default Navbar;
