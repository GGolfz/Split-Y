import { useRecoilValue } from "recoil";
import { useEffect, useState } from "preact/hooks";
import { ApiService } from "../service/ApiService";
import { Transaction } from "../model/SummaryResponse";
import { formatAmount } from "../utils/format";
import MemberBox, { Size } from "../components/MemberBox";
import { groupState } from "../store/groupState";
import { accessTokenState } from "../store/accessTokenState";

enum Tab {
  Total,
  Simplify,
}
const SummaryPage = () => {
  const group = useRecoilValue(groupState);
  const accessToken = useRecoilValue(accessTokenState);
  if (accessToken === null) return <></>;
  const [totalTransactions, setTotalTransactions] = useState<
    Array<Transaction>
  >([]);
  const [simplifyTransactions, setSimplifyTransactions] = useState<
    Array<Transaction>
  >([]);
  const [tab, setTab] = useState<Tab>(Tab.Simplify);
  const getSummary = async () => {
    try {
      const response = await ApiService.getSummary(group.groupId, accessToken);
      if (response.isSuccess && response.data) {
        setTotalTransactions(response.data.total);
        setSimplifyTransactions(response.data.simplify);
      }
    } catch (exception) {
      console.error(exception);
    }
  };
  useEffect(() => {
    getSummary();
  }, []);
  return (
    <div className="w-64 flex flex-col h-96 overflow-scroll gap-3">
      <div className="sticky top-0 bg-white flex flex-col">
        <div className="text-center text-lg">Summary</div>
        <div className="text-md flex">
          <div
            className={`flex-1 text-center ${
              tab === Tab.Simplify && "text-violet-500 text-semibold"
            }`}
            onClick={() => setTab(Tab.Simplify)}
          >
            Simplified
          </div>
          <div
            className={`flex-1 text-center ${
              tab === Tab.Total && "text-violet-500 text-semibold"
            }`}
            onClick={() => setTab(Tab.Total)}
          >
            Total
          </div>
        </div>
        {(tab === Tab.Simplify ? simplifyTransactions : totalTransactions).map(
          (transaction) => (
            <div className="flex text-xs gap-2 py-2 items-center">
              <MemberBox profile={transaction.payFrom} size={Size.Medium} />
              <div>paid {formatAmount(transaction.amount)} to </div>
              <MemberBox profile={transaction.payTo} size={Size.Medium} />
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default SummaryPage;
