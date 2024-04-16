import { useState } from "preact/hooks";
import { LineProfile } from "../model/LineProfile";
import MemberBox, { Size } from "./MemberBox";

interface SingleSelectProp {
  name: string;
  value: string;
  valueList: Array<LineProfile>;
  onChange: (value: string) => void;
}
const SingleSelect = ({
  name,
  value,
  onChange,
  valueList,
}: SingleSelectProp) => {
  const renderCurrentSelection = () => {
    const selectMember = valueList.find((v) => v.userId === value);
    if (selectMember) {
      return <MemberBox profile={selectMember} size={Size.Medium} />;
    }
    return <div className="h-6"></div>;
  };
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <label
        for={name}
        className="block mb-2 text-sm font-medium text-gray-900"
      >
        {name}
      </label>
      <div
        onClick={() => setShow((show) => !show)}
        className="bg-neutral-100 border cursor-pointer  flex gap-2 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-2.5 focus:outline-none"
      >
        {renderCurrentSelection()}
      </div>
      <div
        id="dropdown"
        className={`z-10 bg-neutral-100 border border-gray-300 divide-y absolute divide-gray-100 rounded-lg w-full shadow ` + (!show && 'hidden')}
      >
        <ul className="py-2 text-sm text-gray-700">
          {valueList.map((v) => (
            <li>
              <div
                className="flex gap-2 px-4 py-2 hover:bg-gray-200 cursor-pointer"
                onClick={() => {
                  onChange(v.userId);
                  setShow(false);
                }}
              >
                <MemberBox profile={v} size={Size.Medium} />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SingleSelect;
