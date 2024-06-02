import { CheckBoxCheckIcon, CheckBoxNotCheckIcon } from "../icons/Checkbox"
import { LineProfile } from "../model/LineProfile"
import MemberBox, { Size } from "./MemberBox"

interface MultipleSelectProp {
	name: string
	values: Array<string>
	valueList: Array<LineProfile>
	onChange: (value: Array<string>) => void
}
const MultipleSelect = ({
	name,
	values,
	onChange,
	valueList
}: MultipleSelectProp) => {
	const isSelectAll = values.length === valueList.length
	return (
		<div className="relative min-h-0 flex flex-col">
			<label
				for={name}
				className="block mb-2 text-sm font-medium text-gray-900"
			>
				{name}
			</label>
			<ul className="py-2 text-sm text-gray-700 min-h-0 overflow-scroll">
				<li>
					<div
						className="flex gap-2 px-4 py-2 cursor-pointer"
						onClick={() => {
							if (isSelectAll) {
								onChange([])
							} else {
								onChange(valueList.map((v) => v.userId))
							}
						}}
					>
						<div>
							{isValueSelect ? <CheckBoxCheckIcon /> : <CheckBoxNotCheckIcon />}
						</div>
						<div className="text-md h-[24px]">Select All</div>
					</div>
				</li>
				);
				{valueList.map((v) => {
					const isValueSelect = !!values.find((lv) => lv === v.userId)
					return (
						<li>
							<div
								className="flex gap-2 px-4 py-2 cursor-pointer"
								onClick={() => {
									if (isValueSelect) {
										onChange(values.filter((lv) => lv !== v.userId))
									} else {
										onChange([...values, v.userId])
									}
								}}
							>
								<div>
									{isValueSelect ? (
										<CheckBoxCheckIcon />
									) : (
										<CheckBoxNotCheckIcon />
									)}
								</div>
								<MemberBox profile={v} size={Size.Medium} />
							</div>
						</li>
					)
				})}
			</ul>
		</div>
	)
}

export default MultipleSelect
