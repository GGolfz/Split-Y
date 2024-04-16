export enum ButtonType {
  PRIMARY,
  DANGER,
}
interface Props {
  text: string;
  onClick: () => void;
  type?: ButtonType;
  disable?: boolean;
}
const CommonButton = ({
  text,
  onClick,
  disable = false,
  type = ButtonType.PRIMARY,
}: Props) => {
  const renderButton = () => {
    switch (type) {
      case ButtonType.DANGER:
        return (
          <div
            role="button"
            className={`border py-2 px-8 text-md ${
              disable
                ? "text-neutral-300 border-neutral-300 "
                : `text-red-500 border-red-500 hover:bg-red-300/50`
            } border-1 rounded-md text-center`}
            onClick={disable ? () => {} : onClick}
          >
            {text}
          </div>
        );
      case ButtonType.PRIMARY:
      default:
        return (
          <div
            role="button"
            className={`border py-2 px-8 text-md ${
              disable
                ? "text-neutral-300 border-neutral-300 "
                : `text-violet-500 border-violet-500 hover:bg-violet-300/50`
            } border-1 rounded-md text-center`}
            onClick={disable ? () => {} : onClick}
          >
            {text}
          </div>
        );
    }
  };
  return renderButton();
};

export default CommonButton;
