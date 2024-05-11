import { useState } from "react";
import {
  passwordValidation,
  nameValidation,
} from "../../../interactive-components/input-box/utils/input-validation-type";
import "../../../interactive-components/input-box/input-form-layout.scss";
import InputFormPassword from "../../../interactive-components/input-box/input-form-password-box/InputFormPassword";
import { FormProvider, useForm } from "react-hook-form";
import InputFormBox from "../../../interactive-components/input-box/input-form-box/InputFormBox";
import SvgBG from "../../../bg-asset/bg";
import { NavLink } from "react-router-dom";
import AuthService from "../../../../service/AuthService";
import InputErrorMessage from "../../../interactive-components/input-box/input-error-message/InputErrorMessage";

const LoginForm = () => {
  const methods = useForm({ mode: "onChange" });
  const {
    formState: { errors },
    handleSubmit,
    setError,
    clearErrors,
  } = methods;
  const [isLoading, setIsLoading] = useState(false);
  const [warning, setWarning] = useState(undefined);
  const [submitBtnWasSubmit, setSubmitBtnWasSubmit] = useState(false);
  const authService = AuthService();

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

  const password = passwordValidation(
    "Пароль",
    "password",
    { autoComplete: "password" },
    () => validate(warning, "password")
  );

  const onSubmit = handleSubmit((data) => {
    clearErrors("root.serverError");
    authService.handleLogin(data, setError, setIsLoading);
  });

  return (
    <div className="form-main-page-wrapper">
      <FormProvider {...methods}>
        <section
          className="form-wrapper"
          noValidate
          onSubmit={() => {
            onSubmit();
            setSubmitBtnWasSubmit(true);
          }}
        >
          <img className="" src="/public/logo-bi-book.png" alt="BiBook" />

          <section className="form-content-wrapper">
            <InputFormBox
              {...userName}
              setWarning={setWarning}
              submitBtnWasSubmit={submitBtnWasSubmit}
            />
            <InputFormPassword
              {...password}
              viewTips={true}
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
                Вхід
              </button>
              <NavLink to="/sign-up" className="btn btn-link">
                Реєстрація
              </NavLink>
            </div>
          </div>
        </section>
      </FormProvider>
      <SvgBG position={10} />
    </div>
  );
};

export default LoginForm;
