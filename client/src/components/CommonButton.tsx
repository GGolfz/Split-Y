interface Props {
  text: string;
  onClick: () => void;
  disable?: boolean;
}
const CommonButton = ({ text, onClick, disable = false }: Props) => {
  return (
    <div
      role="button"
      className={`border py-2 px-8 text-md ${disable ? "text-neutral-300 border-neutral-300 " : "text-violet-500 border-violet-500 hover:bg-violet-300/50"} border-1  rounded-md text-center`}
      onClick={disable ? () => {} : onClick}
    >
      {text}
    </div>
  );
};

export default CommonButton;
