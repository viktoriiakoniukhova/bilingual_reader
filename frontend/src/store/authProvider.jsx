import { createContext, useContext, useMemo, useReducer } from "react";

const AuthContext = createContext(undefined);

const ACTIONS = {
  SET_TOKEN: "SET_TOKEN",
  SET_TOKEN_VERIFIED: "SET_TOKEN_VERIFIED",
  SET_LOUD_USER_DATE: "SET_LOUD_USER_DATE",
};

const authReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_TOKEN:
      return { ...state, token: action.payload };

    case ACTIONS.SET_TOKEN_VERIFIED:
      return { ...state, tokenVerified: action.payload };
    case ACTIONS.SET_LOUD_USER_DATE:
      return { ...state, loudUserDate: action.payload };

    default:
      return state;
  }
};

const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, {
    token: localStorage.getItem("accessToken"),
    tokenVerified: true,
    loudUserDate: false,
  });

  const setToken = (newToken) => {
    dispatch({ type: ACTIONS.SET_TOKEN, payload: newToken });
    localStorage.setItem("accessToken", newToken);
  };

  const removeToken = () => {
    dispatch({ type: ACTIONS.SET_TOKEN, payload: null });
    localStorage.removeItem("accessToken");
  };

  const setTokenVerified = (newVerified) => {
    dispatch({ type: ACTIONS.SET_TOKEN_VERIFIED, payload: newVerified });
  };

  const setLoudUserDate = (loudUserDates) => {
    // console.log("loudUserDate "+ loudUserDates)
    dispatch({ type: ACTIONS.SET_LOUD_USER_DATE, payload: loudUserDates });
  };

  const contextValue = useMemo(
    () => ({
      ...state,
      setToken,
      setTokenVerified,
      setLoudUserDate,
      removeToken,
    }),
    [state, setToken, setLoudUserDate, setTokenVerified, removeToken]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) throw new Error("useAuth must be used within an AuthProvider");

  return context;
};

export default AuthProvider;
