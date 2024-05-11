import { useState } from "react";
import {
  passwordValidation,
  emailValidation,
  nameValidation,
  phoneValidation,
} from "../../../interactive-components/input-box/utils/input-validation-type";
import "../../../interactive-components/input-box/input-form-layout.scss";
import InputFormPassword from "../../../interactive-components/input-box/input-form-password-box/InputFormPassword";
import { FormProvider, useForm } from "react-hook-form";
import InputFormBox from "../../../interactive-components/input-box/input-form-box/InputFormBox";
import SvgBG from "../../../bg-asset/bg";
import { NavLink } from "react-router-dom";
import AuthService from "../../../../service/AuthService";
import InputErrorMessage from "../../../interactive-components/input-box/input-error-message/InputErrorMessage";

const SignUpForm = () => {
  const methods = useForm({ mode: "onChange" });
  const {
    formState: { errors },
    handleSubmit,
    getValues,
    setError,
    clearErrors,
  } = methods;
  const [isLoading, setIsLoading] = useState(false);
  const [warning, setWarning] = useState(undefined);
  const [submitBtnWasSubmit, setSubmitBtnWasSubmit] = useState(false);
  const authService = AuthService();

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

  const validate = (warning, key) => {
    if (warning && warning[key]) {
      return warning[key];
    } else return true;
  };

  const userName = nameValidation(
    "Псевдонім",
    "username",
    { autoComplete: "username" },
    () => validate(warning, "username")
  );

  const email = emailValidation(
    "Пошта",
    "email",
    { autoComplete: "email" },
    () => validate(warning, "email")
  );

  const phoneNumber = phoneValidation(
    "Телефон",
    "phone",
    { autoComplete: "tel" },
    () => validate(warning, "phone")
  );

  const password = passwordValidation(
    "Пароль",
    "password",
    { autoComplete: "password" },
    () => passwordValidate(),
    "Спробуйте сервіси для генерації паролів"
  );

  const confirmPassword = passwordValidation(
    "Підтвердити пароль",
    "confirmPassword",
    { autoComplete: "password" },
    () => passwordValidate(),
    "Спробуйте сервіси для генерації паролів"
  );

  const onSubmit = handleSubmit(async (data) => {
    setIsLoading(true);
    clearErrors("root.serverError");

    const { confirmPassword: _, ...rest } = data;

    authService.handleSignUp(rest, setError, setIsLoading);
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
    <div className="form-main-page-wrapper">
      <FormProvider {...methods}>
        <section
          className="form-wrapper"
          onSubmit={() => {
            onSubmit();
            setSubmitBtnWasSubmit(true);
          }}
          noValidate
          onKeyDown={handleArrowNavigation}
        >
          <img src="/public/logo-bi-book.png" alt="BiBook" />

          <section className="form-content-wrapper">
            <InputFormBox
              {...userName}
              setWarning={setWarning}
              submitBtnWasSubmit={submitBtnWasSubmit}
            />

            <InputFormBox
              {...email}
              setWarning={setWarning}
              submitBtnWasSubmit={submitBtnWasSubmit}
            />
            <InputFormBox
              {...phoneNumber}
              setWarning={setWarning}
              submitBtnWasSubmit={submitBtnWasSubmit}
            />

            <InputFormPassword
              {...password}
              viewTips={true}
              submitBtnWasSubmit={submitBtnWasSubmit}
            />
            <InputFormPassword
              {...confirmPassword}
              viewTips={false}
              submitBtnWasSubmit={submitBtnWasSubmit}
            />
            {errors.root?.serverError && (
              <InputErrorMessage
                message={errors.root?.serverError?.message}
                isInvalid={true}
              />
            )}
          </section>
          <div className="btn-content-wrapper btn-form">
            <div className="col-fields-wrapper">
              <button
                className="btn primary-btn"
                type="submit"
                disabled={isLoading}
                onClick={() => {
                  onSubmit();
                  setSubmitBtnWasSubmit(true);
                }}
              >
                Зареєструватись
              </button>
              <NavLink to="/login" className="btn btn-link">
                Увійти
              </NavLink>
            </div>
          </div>
        </section>
      </FormProvider>
      <SvgBG position={15} />
    </div>
  );
};

export default SignUpForm;
