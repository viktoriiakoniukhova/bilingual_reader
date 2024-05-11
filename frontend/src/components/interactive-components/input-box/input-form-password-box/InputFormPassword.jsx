import { useEffect, useState } from "react";
import InputErrorMessage from "../input-error-message/InputErrorMessage";
import { useFormContext } from "react-hook-form";
import {
  isFormInvalid,
  findInputError,
  isInputDirty,
} from "../utils/input-helper";
import cn from "classnames";
import "../input-form-layout.scss";
import SVG from "../../../../svg-env";

const InputFormPassword = ({
  label,
  name,
  attributes = {},
  validation = {},
  autoFocus = false,
  viewTips = true,
  setWarning,
  submitBtnWasSubmit = false,
}) => {
  const {
    register,
    formState: { errors, dirtyFields },
    setError,
    clearErrors,
  } = useFormContext();

  const [modeView, setModeView] = useState("password");
  const [isFocused, setIsFocused] = useState(false);
  const [value, setValue] = useState("");
  const [blurred, setBlurred] = useState(false);

  const inputErrors = findInputError(errors, name);
  const [inputIsDirty, setInputIsDirty] = useState(false);
  const isInvalid = isFormInvalid(inputErrors);

  viewTips ? delete attributes.type : "";

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

  useEffect(() => {
    if (typeof validation.validate() === "string")
      setError(name, { message: validation.validate() });
  }, [validation.validate()]);

  const handleOnChange = (event) => {
    if (name === "confirmPassword") {
      clearErrors("password");
    } else {
      clearErrors("confirmPassword");
    }
    setValue(event.target.value);
    if (typeof setWarning === "function" && setWarning !== undefined)
      setWarning(false);
  };

  const toggleModeView = () => {
    setModeView((prevMode) => (prevMode === "password" ? "text" : "password"));
  };

  const classNames = cn({
    "--disabled": attributes.readOnly,
    "--invalid":
      (isInvalid && inputIsDirty) || (submitBtnWasSubmit && isInvalid),
    "--success": !attributes.readOnly && !isInvalid && value !== "",
    "--focus-in": !attributes.readOnly && isFocused,
    "--filled": value !== "" || attributes.placeholder !== "",
  });

  return (
    <label className={"input-content-wrapper " + classNames} htmlFor={name}>
      <div
        className="text-field-wrapper"
        onFocus={handleFocus}
        onBlur={handleBlur}
      >
        <div className="input-label">
          <p className="p-graph --bold" id={"input-label- " + name}>
            {label}
          </p>
        </div>
        <input
          className="text-field"
          autoFocus={autoFocus}
          id={name}
          name={name}
          pattern={validation?.pattern?.value}
          value={value || ""}
          aria-invalid={Boolean(inputErrors?.error?.message)}
          aria-labelledby={"input-label- " + name}
          {...attributes}
          type={modeView}
          {...register(name, {
            ...validation,
            onChange: (e) => handleOnChange(e),
          })}
        />
        {viewTips && value && (
          <div
            className="btn-icon mini-icon --with-hover-effect view-mode-box"
            onClick={toggleModeView}
          >
            <svg viewBox="0 0 30 30">
              <path d={modeView !== "password" ? SVG.eyeSlash : SVG.eye} />
            </svg>
          </div>
        )}
      </div>
      <InputErrorMessage
        message={inputErrors?.error?.message}
        isInvalid={isInvalid && (inputIsDirty || submitBtnWasSubmit)}
      />
    </label>
  );
};

export default InputFormPassword;
