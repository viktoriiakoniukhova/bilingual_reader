import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import InputFormBox from "../../../interactive-components/input-box/input-form-box/InputFormBox";
import {
  emailValidation,
  nameValidation,
  phoneValidation,
} from "../../../interactive-components/input-box/utils/input-validation-type";
import "../../../interactive-components/input-box/input-form-layout.scss";
import UserService from "../../../../service/UserService";
import InputErrorMessage from "../../../interactive-components/input-box/input-error-message/InputErrorMessage";
import { useUser } from "../../../../store/userProvider";

const UserProfileForm = ({ title = "" }) => {
  const methods = useForm({ mode: "onChange" });

  const {
    formState: { errors },
    handleSubmit,
    setError,
    clearErrors,
    setValue,
  } = methods;

  const [isLoading, setIsLoading] = useState(false);
  const [warning, setWarning] = useState(undefined);
  const [submitBtnWasSubmit, setSubmitBtnWasSubmit] = useState(false);

  const { user } = useUser();
  const userService = UserService();

  useEffect(() => {
    setUserFormValues();
  }, [user]);

  const setUserFormValues = () => {
    const filtered = Object.fromEntries(
      Object.entries(user).filter(([_, v]) => v != null && v !== "")
    );
    Object.keys(filtered).forEach((key) => setValue(key, user[key]));
  };

  const validate = (warning, key) => {
    if (warning && warning[key]) {
      return warning[key];
    } else return true;
  };

  const onSubmit = handleSubmit((data) => {
    clearErrors("root.serverError");
    setIsLoading(true);

    const filtered = Object.fromEntries(
      Object.entries(data).filter(([_, v]) => v != null && v !== "")
    );

    //TODO: for debug, remove when forms are fixed
    console.log(data);

    userService.handleUpdateUser(filtered, setError, setIsLoading);
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

  const userName = nameValidation(
    "Псевдонім",
    "username",
    { autoComplete: "username" },
    () => validate(warning, "username")
  );
  const firstName = nameValidation(
    "Ім'я",
    "firstName",
    { autoComplete: "firstName" },
    () => {},
    false,
    "Будь ласка, введіть коректне ім'я"
  );
  const secondName = nameValidation(
    "Прізвище",
    "surname",
    { autoComplete: "surname" },
    () => {},
    false,
    "Будь ласка, введіть коректне Прізвище"
  );

  const handleDelete = async () => {
    clearErrors("root.serverError");
    setIsLoading(true);
    userService.handleDeleteUser(setError, setIsLoading);
  };

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
  return (
    <section className="form-section-provider">
      <div className="form-label-wrapper">
        <p className="p-graph-24 form-label">{title}</p>
      </div>

      <FormProvider {...methods}>
        <form
          className={"upper-form-section"}
          onSubmit={() => {
            onSubmit();
            setSubmitBtnWasSubmit(true);
          }}
          noValidate
          onKeyDown={handleArrowNavigation}
        >
          <InputFormBox
            {...userName}
            setWarning={setWarning}
            submitBtnWasSubmit={submitBtnWasSubmit}
          />
          <div className="two-fields-wrapper">
            <InputFormBox
              {...firstName}
              submitBtnWasSubmit={submitBtnWasSubmit}
            />
            <InputFormBox
              {...secondName}
              submitBtnWasSubmit={submitBtnWasSubmit}
            />
          </div>
          <div className="two-fields-wrapper">
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
          </div>
          {errors.root?.serverError && (
            <InputErrorMessage
              message={errors.root?.serverError?.message}
              isInvalid={true}
            />
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
          <button
            onClick={handleDelete}
            disabled={isLoading}
            className="btn --primary --danger-btn"
          >
            Видалити аккаунт
          </button>
        </div>
      </FormProvider>
    </section>
  );
};

export default UserProfileForm;
