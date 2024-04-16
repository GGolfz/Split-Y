import { useState } from "preact/hooks";
import { LineProfile } from "../model/LineProfile";
import MemberBox, { Size } from "./MemberBox";
import { JSX } from "preact/jsx-runtime";

interface MultipleSelectProp {
  name: string;
  values: Array<string>;
  valueList: Array<LineProfile>;
  onChange: (value: Array<string>) => void;
}
const MultipleSelect = ({
  name,
  values,
  onChange,
  valueList,
}: MultipleSelectProp) => {
  const renderCurrentSelection = () => {
    if (values.length > 0) {
      return values
        .map((lv) => {
          const selectMember = valueList.find((v) => v.userId === lv);
          if (selectMember) {
            return <MemberBox profile={selectMember} size={Size.Medium} />;
          }
          return <></>;
        })
        .reduce((prev, curr) => {
          if (prev.length === 0) return [...prev, curr];
          return [...prev, <>,</>, curr];
        }, Array<JSX.Element>());
    }

    return <div className="h-6"></div>;
  };
  const [show, setShow] = useState(false);
  const allUserIds = valueList.map((v) => v.userId);
  const isSelectAll =
    values.sort((a, b) => a.localeCompare(b)).join(",") ===
    allUserIds.sort((a, b) => a.localeCompare(b)).join(",");
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
        className={
          `z-10 bg-neutral-100 border border-gray-300 divide-y absolute divide-gray-100 rounded-lg w-full shadow ` +
          (!show && "hidden")
        }
      >
        <ul className="py-2 text-sm text-gray-700">
          <li>
            <div className="flex gap-2 px-4 py-2 hover:bg-gray-200 cursor-pointer">
              <input
                type="checkbox"
                checked={isSelectAll}
                onClick={() => {
                  if (isSelectAll) {
                    onChange([]);
                  } else {
                    onChange(allUserIds);
                  }
                }}
              />
              Select All
            </div>
          </li>
          {valueList.map((v) => {
            const isValueSelect = !!values.find((lv) => lv === v.userId);
            return (
              <li>
                <div className="flex gap-2 px-4 py-2 hover:bg-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isValueSelect}
                    onClick={() => {
                      if (isValueSelect) {
                        onChange(values.filter((lv) => lv !== v.userId));
                      } else {
                        onChange([...values, v.userId]);
                      }
                    }}
                  />
                  <MemberBox profile={v} size={Size.Medium} />
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default MultipleSelect;
