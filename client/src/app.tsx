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
import { webSocketState } from "./store/webSocketState";
const App = () => {
  const [group, setGroup] = useRecoilState(groupState);
  const setCurrentUser = useSetRecoilState(userState);
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const setPage = useSetRecoilState(pageState);
  const setExpenses = useSetRecoilState(expenseState);
  const setWebSocket = useSetRecoilState(webSocketState);
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
      liff.login({
        redirectUri: `https://${window.location.hostname}/${group.groupId}`
      });
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
    if (accessToken !== null) {
      fetchGroupState(accessToken, group, setGroup, setPage);
      fetchExpenses(accessToken, group, setExpenses);
      const webSocket = new WebSocket(
        `wss://${window.location.hostname}/ws/${group.groupId}`
      );
      webSocket.onmessage = (event: MessageEvent) => {
        if (event.data === "members") {
          fetchGroupState(accessToken, group, setGroup, setPage);
        } else if (event.data === "expenses") {
          fetchExpenses(accessToken, group, setExpenses);
        }
      };
      setWebSocket((ws) => {
        ws?.close();
        return webSocket;
      });
    }
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
