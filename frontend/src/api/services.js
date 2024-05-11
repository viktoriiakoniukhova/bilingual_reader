import { BOOK, USER } from "./endpoints";
import axios from "./axios";

// AUTH

export const login = (body) => {
  return axios.post(USER.LOGIN, body);
};

export const signUp = (body) => {
  return axios.post(USER.SIGN_UP, body);
};

// USER

export const setNewPassword = (body) => {
  return axios.put(USER.CHANGE_PASSWORD, body);
};

export const getUser = () => {
  return axios.get(USER.GET_INFO);
};

export const updateUser = (body) => {
  return axios.put(USER.UPDATE, body);
};

export const deleteUser = () => {
  return axios.delete(USER.DELETE);
};

//TODO: add change-avatar endpoint

// BOOK

export const uploadFile = (body) => {
  return axios.post(BOOK.CREATE, body, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const getBookById = (bookId) => {
  return axios.get(BOOK.GET_BY_ID(bookId));
};

export const getBooksAll = () => {
  return axios.get(BOOK.GET_ALL);
};

//TODO: add get-pages endpoint
