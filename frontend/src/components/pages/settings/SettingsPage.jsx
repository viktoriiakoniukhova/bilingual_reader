import UserProfileForm from "./user-profile-form/UserProfileForm";
import ChangePasswordForm from "./change-password-form/ChangePasswordForm";
import ImgContextLoader from "../../interactive-components/img-context-loader/ImgContextLoader";
import "./SettingsPage.scss";
import { useEffect, useState } from "react";
import UserService from "../../../service/UserService";

const SettingsPage = () => {
  const [image, setImage] = useState();
  const userService = UserService();

  useEffect(() => {
    userService.handleGetUser();
  }, []);

  return (
    <div className="flex-box">
      <div className="setting-box">
        <ImgContextLoader image={image} fileSetter={setImage} />
        <main className="main-form-wrapper">
          <UserProfileForm title="Персональна Інформація" />
        </main>
        <main className="main-form-wrapper">
          <ChangePasswordForm />
        </main>
        <footer className="setting-box-footer"></footer>
      </div>
    </div>
  );
};

export default SettingsPage;
