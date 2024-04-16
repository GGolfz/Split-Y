export enum TextFieldType {
  Text = "text",
  Number = "number",
}
interface TextFieldProp {
  type: TextFieldType;
  name: string;
  value: string;
  onChange: (value: string) => void;
}
const TextField = ({ type, name, value, onChange }: TextFieldProp) => {
  return (
    <div>
      <label
        for={name}
        className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
      >
        {name}
      </label>
      <input
        type={type}
        id={name}
        className="bg-neutral-100 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-violet-500 focus:border-violet-500 block w-full p-3 focus:outline-none"
        required
        value={value}
        onInput={(e) => onChange(e.currentTarget.value)}
      />
    </div>
  );
};

export default TextField;
