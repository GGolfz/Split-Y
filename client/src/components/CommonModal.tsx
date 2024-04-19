import { JSX } from "preact/compat";
import BackIcon from "../icons/BackIcon";

interface Prop {
  children: JSX.Element;
  onClose: () => void;
}
const CommonModal = ({ onClose, children }: Prop) => {
  return (
    <div className="z-50 w-screen h-screen absolute justify-center flex items-center">
      <div className="z-50 bg-white rounded-sm relative"><div className="absolute top-8 left-7 z-50" onClick={onClose}><BackIcon/></div>{children}</div>
    </div>
  );
};

export default CommonModal;
