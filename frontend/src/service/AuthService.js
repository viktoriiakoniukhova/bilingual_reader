import { from, catchError, switchMap, finalize } from "rxjs";
import axios from "axios";
import { useUser } from "../store/userProvider.jsx";
import { useAuth } from "../store/authProvider.jsx";
import { useNavigate } from "react-router-dom";
import { login, signUp } from "../api/services.js";

const AuthService = () => {
  const navigate = useNavigate();
  const { setToken } = useAuth();
  const { setUserProfile } = useUser();

  const handleLogin = (data, setError, setIsLoading) => {
    from(login(data))
      .pipe(
        switchMap((response) => {
          const { token, user } = response.data;
          setToken(token);

          const { first_name: firstName, last_name: lastName, ...rest } = user;
          setUserProfile({
            ...rest,
            firstName,
            lastName,
          });

          return from(Promise.resolve("/"));
        }),
        catchError((error) => {
          if (axios.isAxiosError(error)) {
            setError("root.serverError", {
              type: error.code,
              message:
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

  const handleSignUp = (data, setError, setIsLoading) => {
    from(signUp(data))
      .pipe(
        switchMap((response) => {
          const { token, user } = response.data;
          setToken(token);

          const { first_name: firstName, last_name: lastName, ...rest } = user;
          setUserProfile({
            ...rest,
            firstName,
            lastName,
          });

          return from(Promise.resolve("/"));
        }),
        catchError((error) => {
          if (axios.isAxiosError(error)) {
            setError("root.serverError", {
              type: error.code,
              message:
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
    handleLogin,
    handleSignUp,
  };
};

export default AuthService;
