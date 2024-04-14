const user1: User = {
  id: "1",
  name: "User 1",
};

const user2: User = {
  id: "2",
  name: "User 2",
};

const user3: User = {
  id: "3",
  name: "User 3",
};

const expense1: Expense = {
  name: "Expense 1",
  amount: 2000.0,
  dateTime: "13/04/2023 12:00",
  payer: user1,
  debtors: [
    {
      ...user1,
      amount: 1000.0,
    },
    {
      ...user2,
      amount: 1000.0,
    },
  ],
};
const expense2: Expense = {
  name: "Expense 2",
  amount: 200.0,
  dateTime: "13/04/2023 11:00",
  payer: user1,
  debtors: [
    {
      ...user1,
      amount: 100.0,
    },
    {
      ...user3,
      amount: 100.0,
    },
  ],
};
const expense3: Expense = {
  name: "Expense 3",
  amount: 500.0,
  dateTime: "13/04/2023 10:00",
  payer: user2,
  debtors: [
    {
      ...user2,
      amount: 250.0,
    },
    {
      ...user3,
      amount: 250.0,
    },
  ],
};


export default {
    user1,
    user2,
    user3,
    expense1,
    expense2,
    expense3
}