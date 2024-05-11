// endpoints.js
export const BASE_URL =
  import.meta.env.DJANGO_BACKEND_URL || "http://localhost:8000";

export default BASE_URL;

// Book endpoints
export const BOOK = {
  CREATE: "/book/create/",
  GET_ALL: "/book/all_books/",
  FILTER: "/book/filter/",
  SEARCH: "/book/search/",

  GET_BY_ID: (id) => `/book/one/info?book_id=${id}/`,
};

// User endpoints
export const USER = {
  SIGN_UP: "/user/create/",
  LOGIN: "/user/login/",
  CHANGE_PASSWORD: "/user/change-password/",
  CHANGE_AVATAR: "/user/change-avatar/",
  LOGOUT: "/auth/",

  GET_INFO: "/user/info/",
  UPDATE: "/user/",
  DELETE: "/user/",
};

// Translation endpoint
export const TRANSLATE = "/translate/";
