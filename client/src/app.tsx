import { useEffect, useState } from "preact/hooks";
import Item from "./components/Item";
import Navbar from "./components/Navbar";
import data from "./mock/data";
import liff from "@line/liff";
import axios from "axios";
import CommonButton from "./components/CommonButton";
const App = () => {
  const expenses = [data.expense1, data.expense2, data.expense3];
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isJoin, setIsJoin] = useState<boolean>(false);
  const [isJoinButtonLoading, setIsJoinButtonLoading] =
    useState<boolean>(false);
  const [groupId, setGroupId] = useState<string>(
    window.location.pathname.split("/")[1]
  );
  const [members, setMembers] = useState([]);
  const initializeLiff = async () => {
    await liff.init({
      liffId: "2004547506-w5WkPoXz",
    });
    if (liff.isLoggedIn()) {
      const profile = await liff.getProfile();
      setCurrentUser({
        id: profile.userId,
        name: profile.displayName,
      } as User);
      const response = await axios.get(
        `http://localhost:3000/api/group/${groupId}`,
        {
          headers: {
            Authorization: `Bearer ${liff.getAccessToken()}`,
          },
        }
      );
      if (!!response.data.group) {
        setIsJoin(true);
        setMembers(response.data.group.members);
      } else {
        setIsJoin(false);
      }
    } else {
      liff.login();
    }
  };
  useEffect(() => {
    initializeLiff();
  }, []);

  const renderContent = () => {
    if (currentUser === null) return <></>;
    if (!isJoin)
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
                  const response = await axios.post(
                    `http://localhost:3000/api/group/${groupId}/join`,
                    null,
                    {
                      headers: {
                        Authorization: `Bearer ${liff.getAccessToken()}`,
                      },
                    }
                  );
                  if (response.data.success) {
                    setIsJoin(true);
                    setIsJoinButtonLoading(false);
                    setMembers(response.data.group.members);
                  }
                }}
              />
            </div>
          </div>
        </>
      );
    return (
      <>
        <div className="flex flex-col flex-auto">
          {expenses.map((ex) => (
            <Item expense={ex} currentUser={data.user2} />
          ))}
        </div>
        <div className="py-6 flex justify-center">
          <CommonButton text="Add an expense" onClick={() => {}} />
        </div>
      </>
    );
  };
  return (
    <div className="bg-stone-100 flex flex-col h-screen w-screen">
      <Navbar />
      {renderContent()}
    </div>
  );
};

export default App;
