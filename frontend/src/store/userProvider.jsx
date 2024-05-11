import { createContext, useContext, useMemo, useReducer } from "react";

const UserContext = createContext();

const ACTIONS = {
  SET_USER_PROFILE: "SET_USER_PROFILE",
  SET_AVATAR: "SET_AVATAR",
  SET_BOOKS: "SET_BOOKS",
  SET_ALL: "SET_ALL",
};

const initialState = {
  user: {
    id: null,
    username: "",
    email: "",
    firstName: "",
    lastName: "",
    phone: "",
    books: [],
    avatar: null,
  },
};

const userReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_USER_PROFILE:
      return {
        ...state,
        ...action.payload, // This assumes that payload contains all user data fields
      };
    case ACTIONS.SET_AVATAR:
      return {
        ...state,
        avatar: action.payload, // Payload should be the avatar URL or data
      };
    case ACTIONS.SET_BOOKS:
      return {
        ...state,
        books: action.payload, // Payload should be an array of book IDs
      };
    case ACTIONS.SET_ALL:
      return {
        ...initialState, // Resets to initial state before setting new user data
        ...action.payload,
      };
    default:
      return state;
  }
};

const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const setUserProfile = (userData) => {
    dispatch({ type: ACTIONS.SET_USER_PROFILE, payload: userData });
  };

  const setAvatar = (avatarUrl) => {
    dispatch({ type: ACTIONS.SET_AVATAR, payload: avatarUrl });
  };

  const setBooks = (bookIds) => {
    dispatch({ type: ACTIONS.SET_BOOKS, payload: bookIds });
  };

  const resetUser = () => {
    dispatch({ type: ACTIONS.SET_ALL, payload: initialState });
  };

  const contextValue = useMemo(
    () => ({
      ...state,
      setUserProfile,
      setAvatar,
      setBooks,
      resetUser,
    }),
    [state]
  );

  return (
    <UserContext.Provider value={contextValue}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
};

export default UserProvider;
