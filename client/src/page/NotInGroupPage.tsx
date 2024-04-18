import { useEffect, useState } from "preact/hooks";
import CommonButton from "../components/CommonButton";
import { ApiService } from "../service/ApiService";
import { useRecoilValue, useSetRecoilState, useRecoilState } from "recoil";
import { PageState, pageState } from "../store/pageState";
import { accessTokenState } from "../store/accessTokenState";
import { fetchGroupState, groupState } from "../store/groupState";
import { expenseState, fetchExpenses } from "../store/expensesState";
const NotInGroupPage = () => {
  const setPage = useSetRecoilState(pageState);
  const setExpense = useSetRecoilState(expenseState);
  const accessToken = useRecoilValue(accessTokenState);
  const [group, setGroup] = useRecoilState(groupState);
  const [isJoinButtonLoading, setIsJoinButtonLoading] =
    useState<boolean>(false);
  useEffect(() => {
    if (accessToken === null) {
      setPage(PageState.ERROR);
    }
  }, [accessToken]);
  if (accessToken === null) return <></>;
  return (
    <>
      <div className="flex flex-col flex-auto text-center justify-center">
        <div>You're not joining this group yet.</div>
        <div className="py-6 flex justify-center">
          <CommonButton
            text="Join a group"
            onClick={async () => {
              if (isJoinButtonLoading) return;
              setIsJoinButtonLoading(true);
              try {
                const response = await ApiService.joinGroup(
                  group.groupId,
                  accessToken
                );
                if (response.isSuccess) {
                  setIsJoinButtonLoading(false);
                  fetchGroupState(accessToken, group, setGroup, setPage);
                  fetchExpenses(accessToken, group, setExpense);
                  setPage(PageState.MAIN);
                }
              } catch (exception) {
                console.error(exception);
                setPage(PageState.ERROR);
              }
            }}
          />
        </div>
      </div>
    </>
  );
};

export default NotInGroupPage;
