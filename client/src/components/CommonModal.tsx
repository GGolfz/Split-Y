import { JSX } from "preact/compat";

interface Prop {
  children: JSX.Element;
  onClose: () => void;
}
const CommonModal = ({ onClose, children }: Prop) => {
  return (
    <div className="z-50 w-screen h-screen absolute justify-center flex items-center">
      <div className="z-50 bg-white rounded-sm p-4">{children}</div>
      <div
        className="w-screen h-screen bg-stone-600/40 z-40 absolute"
        onClick={onClose}
      ></div>
    </div>
  );
};

export default CommonModal;
