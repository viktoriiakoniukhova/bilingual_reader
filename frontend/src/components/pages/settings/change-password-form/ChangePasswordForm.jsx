import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { passwordValidation } from "../../../interactive-components/input-box/utils/input-validation-type";
import InputFormPassword from "../../../interactive-components/input-box/input-form-password-box/InputFormPassword";
import "../../../interactive-components/input-box/input-form-layout.scss";
import UserService from "../../../../service/UserService";
import InputErrorMessage from "../../../interactive-components/input-box/input-error-message/InputErrorMessage";

const ChangePasswordForm = ({ title = "Змінити Пароль" }) => {
  const methods = useForm({ mode: "onChange" });

  const {
    formState: { errors },
    handleSubmit,
    getValues,
    setError,
    clearErrors,
  } = methods;

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);
  const [warning, setWarning] = useState(undefined);
  const [submitBtnWasSubmit, setSubmitBtnWasSubmit] = useState(false);

  const userService = UserService();

  const passwordValidate = () => {
    const value = getValues("password");
    const confirmValue = getValues("confirmPassword");
    if (value === confirmValue) {
      return true;
    } else if (!confirmValue) {
      return true;
    }
    return "Паролі не співпадають";
  };

  const password = passwordValidation(
    "Новий пароль",
    "password",
    { autoComplete: "password" },
    () => passwordValidate()
  );

  const currentPassword = passwordValidation(
    "Старий пароль",
    "currentPassword",
    { autoComplete: "password" },
    () => passwordValidate()
  );

  const onSubmit = handleSubmit(async (data) => {
    clearErrors("root.serverError");
    setSuccessMessage(null);
    setIsLoading(true);

    const { password: newPassword, currentPassword: oldPassword } = data;

    userService.handleSetNewPassword(
      { newPassword, oldPassword },
      setSuccessMessage,
      setError,
      setIsLoading
    );
  });

  const handleArrowNavigation = (e) => {
    const activeElement = document.activeElement;
    const inputs = document.querySelectorAll("input");
    const currentIndex = Array.from(inputs).indexOf(activeElement);

    switch (e.key) {
      case "ArrowDown":
      case "ArrowUp":
        e.preventDefault();
        if (currentIndex !== -1) {
          const nextIndex =
            e.key === "ArrowDown"
              ? (currentIndex + 1) % inputs.length
              : (currentIndex - 1 + inputs.length) % inputs.length;
          inputs[nextIndex].focus();
        }
        break;

      case "Enter":
        e.preventDefault();
        if (currentIndex !== -1) {
          const nextIndex = (currentIndex + 1) % inputs.length;
          inputs[nextIndex].focus();
        }
        break;
      default:
    }
  };

  return (
    <section className="form-section-provider">
      <div className="form-label-wrapper">
        <p className="p-graph-24 form-label">{title}</p>
      </div>

      <FormProvider {...methods}>
        <form
          className="upper-form-section"
          onSubmit={() => {
            onSubmit();
            setSubmitBtnWasSubmit(true);
          }}
          noValidate
          onKeyDown={handleArrowNavigation}
        >
          <InputFormPassword
            {...password}
            viewTips
            setWarning={setWarning}
            submitBtnWasSubmit={submitBtnWasSubmit}
          />
          <InputFormPassword
            {...currentPassword}
            viewTips={false}
            setWarning={setWarning}
            submitBtnWasSubmit={submitBtnWasSubmit}
          />
          {errors.root?.serverError && (
            <InputErrorMessage
              message={errors.root?.serverError?.message}
              isInvalid={true}
            />
          )}
          {successMessage && (
            <p style={{ color: "darkgreen" }}>{successMessage}</p>
          )}
        </form>
        <div className="btn-content-wrapper bottom-form-section btn-form">
          <button
            type="submit"
            className="btn --primary"
            disabled={isLoading}
            onClick={() => {
              onSubmit();
              setSubmitBtnWasSubmit(true);
            }}
          >
            Зберегти
          </button>
          <button type="submit" className="btn" disabled={isLoading}>
            Збросити
          </button>
        </div>
      </FormProvider>
    </section>
  );
};

export default ChangePasswordForm;
