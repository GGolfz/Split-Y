import { useRecoilValue } from "recoil";
import { useState } from "preact/hooks";
import { formatAmount } from "../utils/format";
import MemberBox, { Size } from "../components/MemberBox";
import { accessTokenState } from "../store/accessTokenState";
import { summaryState } from "../store/summaryState";

enum Tab {
  Total,
  Simplify,
}
const SummaryPage = () => {
  const accessToken = useRecoilValue(accessTokenState);
  const summary = useRecoilValue(summaryState);
  if (accessToken === null) return <></>;
  const [tab, setTab] = useState<Tab>(Tab.Simplify);
  return (
    <div className="w-screen flex flex-col h-screen overflow-scroll gap-3 p-8">
      <div className="sticky top-0 bg-white flex flex-col">
        <div className="text-center text-lg">Summary</div>
        <div className="text-md flex cursor-pointer">
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
        {(tab === Tab.Simplify
          ? summary.simplifyTransactions
          : summary.totalTransactions
        ).map((transaction) => (
          <div className="flex text-sm gap-2 py-2 items-center">
            <MemberBox profile={transaction.payFrom} size={Size.Medium} />
            <div>paid {formatAmount(transaction.amount)} to </div>
            <MemberBox profile={transaction.payTo} size={Size.Medium} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default SummaryPage;
