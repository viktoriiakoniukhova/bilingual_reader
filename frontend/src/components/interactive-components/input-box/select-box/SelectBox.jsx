import {useState, useRef} from "react";
import cn from "classnames";
import {motion, AnimatePresence} from "framer-motion";
import "../input-form-layout.scss";
import "./SelectBos.scss";
import SVG from "../../../../svg-env";

const SelectBox = ({
	label = "",
	select,
	options = [],
	viewMaxElements = 5,
	selectOptionHandler = () => {},
	disabled = false,
}) => {
	const selectOptionWrapper = useRef(null);
	const [wasSelected, setWasSelected] = useState(false);
	const [dropDownModalStatus, setDropDownModalStatus] = useState(false);

	const handleOpenDropDownMenu = (el) => {
		const active = document.activeElement;
		setDropDownModalStatus(el.contains(active));
	};

	const classNames = cn({
		"--disabled": disabled,
		"--filled": disabled || (select && select?.key),
	});

	const collapse = cn({
		"--down": dropDownModalStatus,
		"--up": !dropDownModalStatus,
	});

	return (
		<label className={"input-content-wrapper " + classNames} htmlFor={name}>
			<div
				tabIndex={1}
				ref={selectOptionWrapper}
				className="text-field-wrapper optional-menu"
				onClick={() => setDropDownModalStatus(!dropDownModalStatus)}
				onBlur={() => handleOpenDropDownMenu(selectOptionWrapper.current)}
			>
				<div className="input-label">
					<p className="p-graph --bold" id={"input-label- " + name}>
						{label}
					</p>
				</div>
				<p className="p-graph-20 --bold --title-type">{select?.title}</p>

				{!disabled && (
					<div className="collapse-icon-wrapper">
						<svg viewBox="0 0 30 30" className={"collapse-icon ".concat(collapse)}>
							<path d={SVG?.collapseBtn} />
						</svg>
					</div>
				)}
				<DropdownOptionContext
					options={options}
					viewMaxElements={viewMaxElements}
					selectOptionHandler={selectOptionHandler}
					dropDownModalStatus={dropDownModalStatus}
				/>
			</div>
		</label>
	);
};

export const DropdownOptionContext = ({
	options = [],
	selectOptionHandler = () => {},
	dropDownModalStatus = false,
	viewMaxElements = 3,
}) => {
	const frameDropDownAnim = {
		initial: {opacity: 0, y: -10},
		animate: {opacity: 1, y: 0},
		exit: {opacity: 0, y: 10},
		transition: {duration: 0.2},
	};
	
	return (
		<AnimatePresence mode="wait" initial={false}>
			{dropDownModalStatus && (
				<motion.div className="drop-down-optional-menu" {...frameDropDownAnim}>
					<ul className="ul-optional-menu" style={{"--elements": viewMaxElements}}>
						{options.map((val, index) => {
							return (
								<li
									key={index}
									onClick={() => selectOptionHandler(val)}
									style={val.title ? {} : {textTransform: "capitalize"}}
								>
									<p className="p-graph-16 --title-type">{val?.title || val}</p>
								</li>
							);
						})}
					</ul>
				</motion.div>
			)}
		</AnimatePresence>
	);
};
export default SelectBox;
