import { from, catchError, switchMap, finalize } from "rxjs";
import axios from "axios";
import { useUser } from "../store/userProvider.jsx";
import { useNavigate } from "react-router-dom";
import {
  deleteUser,
  getUser,
  setNewPassword,
  updateUser,
} from "../api/services.js";
import { useAuth } from "../store/authProvider.jsx";

const UserService = () => {
  const navigate = useNavigate();
  const { setUserProfile } = useUser();
  const { removeToken } = useAuth();

  const handleGetUser = (setError, setIsLoading) => {
    from(getUser())
      .pipe(
        switchMap((response) => {
          const { user } = response.data;
          const { first_name: firstName, last_name: lastName, ...rest } = user;

          setUserProfile({
            user: {
              ...rest,
              firstName,
              lastName,
            },
          });

          return from(Promise.resolve());
        }),
        catchError((error) => {
          if (axios.isAxiosError(error)) {
            setError("root.serverError", {
              type: error.code,
              message:
                error.response?.data?.detail ??
                error.response?.data?.errors?.[0] ??
                Object.values(error.response?.data?.errors)[0] ??
                error?.response?.statusText,
            });
          } else {
            console.error(error);
          }
          return from(Promise.reject(error));
        }),
        finalize(() => setIsLoading(false))
      )
      .subscribe();
  };

  const handleUpdate = (data, setError, setIsLoading) => {
    from(updateUser(data))
      .pipe(
        switchMap((response) => {
          const { user } = response.data;
          const { first_name: firstName, last_name: lastName, ...rest } = user;

          setUserProfile({
            user: {
              ...rest,
              firstName,
              lastName,
            },
          });

          return from(Promise.resolve());
        }),
        catchError((error) => {
          if (axios.isAxiosError(error)) {
            setError("root.serverError", {
              type: error.code,
              message:
                error.response?.data?.detail ??
                error.response?.data?.errors?.[0] ??
                Object.values(error.response?.data?.errors)[0] ??
                error?.response?.statusText,
            });
          } else {
            console.error(error);
          }
          return from(Promise.reject(error));
        }),
        finalize(() => setIsLoading(false))
      )
      .subscribe();
  };

  const handleSetNewPassword = (data, setSuccess, setError, setIsLoading) => {
    from(setNewPassword(data))
      .pipe(
        switchMap((response) => {
          const { message } = response.data;
          setSuccess(message);

          return from(Promise.resolve());
        }),
        catchError((error) => {
          if (axios.isAxiosError(error)) {
            setError("root.serverError", {
              type: error.code,
              message:
                error.response?.data?.detail ??
                error.response?.data?.errors?.[0] ??
                Object.values(error.response?.data?.errors)[0] ??
                error?.response?.statusText,
            });
          } else {
            console.error(error);
          }
          return from(Promise.reject(error));
        }),
        finalize(() => setIsLoading(false))
      )
      .subscribe();
  };

  const handleDelete = (setError, setIsLoading) => {
    from(deleteUser())
      .pipe(
        switchMap(() => {
          removeToken();
          return from(Promise.resolve("/"));
        }),
        catchError((error) => {
          if (axios.isAxiosError(error)) {
            setError("root.serverError", {
              type: error.code,
              message:
                error.response?.data?.detail ??
                error.response?.data?.errors?.[0] ??
                Object.values(error.response?.data?.errors)[0] ??
                error?.response?.statusText,
            });
          } else {
            console.error(error);
          }
          return from(Promise.reject(error));
        }),
        finalize(() => setIsLoading(false))
      )
      .subscribe((redirectPath) => navigate(redirectPath));
  };

  return {
    handleSetNewPassword,
    handleDelete,
    handleGetUser,
    handleUpdate,
  };
};

export default UserService;
