import {useEffect, useState} from "react";
import InputErrorMessage from "../input-error-message/InputErrorMessage";
import {useFormContext} from "react-hook-form";
import {isFormInvalid, findInputError, isInputDirty} from "../utils/input-helper";
import cn from "classnames";
import "../input-form-layout.scss";

const InputFormBox = ({
	label,
	name,
	attributes = {},
	validation = {},
	autoFocus = false,
	value_ = "",
	setWarning,
	submitBtnWasSubmit = false,
}) => {
	const {
		register,
		formState: {errors, dirtyFields},
		setError,
	} = useFormContext();

	const [isFocused, setIsFocused] = useState(false);
	const [value, setValue] = useState(value_);
	const [blurred, setBlurred] = useState(false);

	const inputErrors = findInputError(errors, name);
	const [inputIsDirty, setInputIsDirty] = useState(false);
	const isInvalid = isFormInvalid(inputErrors);

	const handleFocus = () => {
		setIsFocused(true);
	};

	const handleBlur = () => {
		setIsFocused(false);
		if (!blurred) {
			setInputIsDirty(isInputDirty(dirtyFields, name));
			if (value !== "" && value) setBlurred(true);
		}
	};

	const handleOnChange = (event) => {
		setValue(event.target.value);
		if (typeof setWarning === "function" && setWarning !== undefined) setWarning(false);
	};

	const classNames = cn({
		"--disabled": attributes.readOnly,
		"--invalid": (isInvalid && inputIsDirty) || (submitBtnWasSubmit && isInvalid),
		"--success": !attributes.readOnly && !isInvalid && value !== "",
		"--focus-in": !attributes.readOnly && isFocused,
		"--filled": value_ !== "" || value !== "",
	});

	return (
		<label className={"input-content-wrapper " + classNames} htmlFor={name}>
			<div className="text-field-wrapper" onFocus={handleFocus} onBlur={handleBlur}>
				<div className="input-label">
					<p className="p-graph --bold" id={"input-label- " + name}>
						{label}
					</p>
				</div>
				<input
					className="text-field"
					autoFocus={autoFocus}
					pattern={validation?.pattern?.value}
					id={name}
					name={name}
					value={value || ""}
					aria-invalid={Boolean(inputErrors?.error?.message)}
					aria-labelledby={"input-label- " + name}
					{...attributes}
					{...register(name, {...validation, onChange: (e) => handleOnChange(e)})}
				/>
			</div>
			<InputErrorMessage
				message={inputErrors?.error?.message}
				isInvalid={isInvalid && (inputIsDirty || submitBtnWasSubmit)}
			/>
		</label>
	);
};

export default InputFormBox;
