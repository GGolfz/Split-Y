import { useEffect } from "preact/hooks";
import Navbar from "./components/Navbar";
import liff from "@line/liff";
import ErrorPage from "./page/ErrorPage";
import NotInGroupPage from "./page/NotInGroupPage";
import ExpensePage from "./page/ExpensePage";
import { useSetRecoilState, useRecoilValue, useRecoilState } from "recoil";
import { userState } from "./store/userState";
import { accessTokenState } from "./store/accessTokenState";
import { PageState, pageState } from "./store/pageState";
import { fetchGroupState, groupState } from "./store/groupState";
import { expenseState, fetchExpenses } from "./store/expensesState";
import CommonModal from "./components/CommonModal";
import MemberPage from "./page/MemberPage";
import SummaryPage from "./page/SummaryPage";
import ExpenseModal from "./page/ExpenseModal";
const App = () => {
  const [group, setGroup] = useRecoilState(groupState);
  const setCurrentUser = useSetRecoilState(userState);
  const setAccessToken = useSetRecoilState(accessTokenState);
  const setPage = useSetRecoilState(pageState);
  const accessToken = useRecoilValue(accessTokenState);
  const setExpenses = useSetRecoilState(expenseState);
  const isGroupIdValid = group.groupId && group.groupId.length > 0;
  const initializeLiff = async () => {
    await liff.init({
      liffId: "2004547506-w5WkPoXz",
    });
    if (liff.isLoggedIn()) {
      const liffAccessToken = liff.getAccessToken();
      const profile = await liff.getProfile();
      setCurrentUser(profile);
      setAccessToken(liffAccessToken);
    } else {
      liff.login();
    }
  };

  useEffect(() => {
    if (isGroupIdValid) {
      initializeLiff();
    } else {
      setPage(PageState.ERROR);
    }
  }, []);
  useEffect(() => {
    fetchGroupState(accessToken, group, setGroup, setPage);
    fetchExpenses(accessToken, group, setExpenses);
  }, [accessToken]);

  const renderPage = () => {
    const page = useRecoilValue(pageState);
    switch (page) {
      case PageState.ERROR:
        return <ErrorPage />;
      case PageState.NOT_IN_GROUP:
        return <NotInGroupPage />;
      default:
        return (
          <>
            <ExpensePage />
            {page === PageState.MEMBERS && (
              <CommonModal onClose={() => setPage(PageState.MAIN)}>
                <MemberPage />
              </CommonModal>
            )}
            {page === PageState.SUMMARY && (
              <CommonModal onClose={() => setPage(PageState.MAIN)}>
                <SummaryPage />
              </CommonModal>
            )}
            {page === PageState.EXPENSE && (
              <CommonModal onClose={() => setPage(PageState.MAIN)}>
                <ExpenseModal />
              </CommonModal>
            )}
          </>
        );
    }
  };
  return (
    <div className="bg-stone-100 flex flex-col h-screen w-screen">
      <Navbar />
      {renderPage()}
    </div>
  );
};

export default App;
