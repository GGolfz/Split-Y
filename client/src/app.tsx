import { useEffect, useState } from "preact/hooks";
import AddExpenseButton from "./components/AddExpenseButton";
import Item from "./components/Item";
import Navbar from "./components/Navbar";
import data from "./mock/data";
import liff from "@line/liff";
const App = () => {
  const expenses = [data.expense1, data.expense2, data.expense3];
  const [currentUser, setCurrentUser] = useState<User | null>(null);
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
    } else {
      liff.login();
    }
  };
  useEffect(() => {
    initializeLiff();
  }, []);
  return (
    <div className="bg-stone-100 flex flex-col h-screen w-screen">
      <Navbar />
      {currentUser !== null && (
        <>
          <div className="flex flex-col flex-auto">
            
            {expenses.map((ex) => (
              <Item expense={ex} currentUser={data.user2} />
            ))}
          </div>
          <div className="py-6 flex justify-center">
            <AddExpenseButton />
          </div>
        </>
      )}
    </div>
  );
};

export default App;
