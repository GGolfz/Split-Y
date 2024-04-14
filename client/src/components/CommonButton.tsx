interface Props {
  text: string;
  onClick: () => void;
}
const CommonButton = ({ text, onClick }: Props) => {
  return (
    <div
      role="button"
      className="border py-2 px-8 text-md text-violet-500 border-1 border-violet-500 rounded-md hover:bg-violet-300/50"
      onClick={onClick}
    >
      {text}
    </div>
  );
};

export default CommonButton;
