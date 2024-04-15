import { useEffect, useState } from "preact/hooks";
import Navbar from "./components/Navbar";
import liff from "@line/liff";
import ErrorPage from "./page/ErrorPage";
import { ApiService } from "./service/ApiService";
import { LineProfile } from "./model/LineProfile";
import NotInGroupPage from "./page/NotInGroupPage";
import ExpensePage from "./page/ExpensePage";
import NavbarWithAction from "./components/NavbarWithAction";
import CommonModal from "./components/CommonModal";
import MemberPage from "./page/MemberPage";
import SummaryPage from "./page/SummaryPage";
const App = () => {
  const [currentUser, setCurrentUser] = useState<LineProfile | null>(null);
  const [isJoin, setIsJoin] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const groupId = window.location.pathname.split("/")[1];
  const [isGroupIdValid, setIsGroupIdValid] = useState(
    groupId && groupId.length > 0
  );
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const initializeLiff = async () => {
    await liff.init({
      liffId: "2004547506-w5WkPoXz",
    });
    if (liff.isLoggedIn()) {
      const liffAccessToken = liff.getAccessToken();
      const profile = await liff.getProfile();
      setCurrentUser({
        userId: profile.userId,
        displayName: profile.displayName,
        pictureUrl: profile.pictureUrl,
        statusMessage: profile.statusMessage,
      });
      if (liffAccessToken) {
        setAccessToken(liffAccessToken);
      }
    } else {
      liff.login();
    }
  };
  const getGroup = async () => {
    if (accessToken !== null) {
      try {
        const response = await ApiService.getGroup(groupId, accessToken);
        setIsJoin(response.isSuccess);
        if (response.error && response.error !== "User is not in the group") {
          setIsGroupIdValid(false);
        }
      } catch (exception) {
        console.error(exception);
        setIsError(true);
      }
    }
  };
  useEffect(() => {
    if (isGroupIdValid) {
      initializeLiff();
    }
  }, []);
  useEffect(() => {
    getGroup();
  }, [accessToken]);
  const renderContent = () => {
    if (isError) return <ErrorPage />;
    if (!isGroupIdValid) return <ErrorPage />;
    if (currentUser === null) return <></>;
    if (accessToken === null) return <ErrorPage />;
    if (!isJoin)
      return (
        <NotInGroupPage
          groupId={groupId}
          accessToken={accessToken}
          onJoin={() => setIsJoin(true)}
          onError={() => setIsError(true)}
        />
      );
    return (
      <>
        <ExpensePage
          groupId={groupId}
          accessToken={accessToken}
          currentUser={currentUser}
        />
        {isShowMemberModal && (
          <CommonModal onClose={() => setIsShowMemberModal(false)}>
            <MemberPage groupId={groupId} accessToken={accessToken} />
          </CommonModal>
        )}
        {isShowSummaryModal && (
          <CommonModal onClose={() => setIsShowSummaryModal(false)}>
            <SummaryPage groupId={groupId} accessToken={accessToken} />
          </CommonModal>
        )}
        {isShowCreateExpenseModal && (
          <CommonModal onClose={() => setIsShowCreateExpenseModal(false)}>
            <>test</>
          </CommonModal>
        )}
        {isShowExpenseModal && (
          <CommonModal onClose={() => setIsShowExpenseModal(false)}>
            <>test</>
          </CommonModal>
        )}
      </>
    );
  };
  const renderNavbar = () => {
    if (
      isError ||
      !isGroupIdValid ||
      currentUser === null ||
      accessToken === null ||
      !isJoin
    )
      return <Navbar />;
    return (
      <NavbarWithAction
        groupId={groupId}
        accessToken={accessToken}
        onDisplayMember={onDisplayMember}
        onDisplaySummary={onDisplaySummary}
      />
    );
  };
  const onDisplayMember = () => {
    setIsShowMemberModal(true);
  };

  const onDisplaySummary = () => {
    setIsShowSummaryModal(true);
  };
  const [isShowMemberModal, setIsShowMemberModal] = useState(false);
  const [isShowSummaryModal, setIsShowSummaryModal] = useState(false);
  const [isShowCreateExpenseModal, setIsShowCreateExpenseModal] =
    useState(false);
  const [isShowExpenseModal, setIsShowExpenseModal] = useState(false);
  return (
    <div className="bg-stone-100 flex flex-col h-screen w-screen">
      {renderNavbar()}
      {renderContent()}
    </div>
  );
};

export default App;
