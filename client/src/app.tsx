import AddExpenseButton from "./components/AddExpenseButton";
import Item from "./components/Item";
import Navbar from "./components/Navbar";
import data from "./mock/data";
const App = () => {
  const expenses = [data.expense1, data.expense2, data.expense3];
  return (
    <div className="bg-stone-100 flex flex-col h-screen w-screen">
      <Navbar />
      <div className="flex flex-col flex-auto">
        {expenses.map((ex) => (
          <Item expense={ex} currentUser={data.user2} />
        ))}
      </div>
      <div className="py-6 flex justify-center">
        <AddExpenseButton />
      </div>
    </div>
  );
};

export default App;
