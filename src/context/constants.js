export const apiUrl =
  process.env.NODE_ENV !== "production"
    ? "http://localhost:5000/api"
    : "https://certificate-sheet-server.herokuapp.com/api";

export const LOCAL_STORAGE_TOKEN_NAME = "token";

export const SET_AUTH = "SET_AUTH";

export const POSTS_LOADED_SUCCESS = "POSTS_LOADED_SUCCESS";
export const POSTS_LOADED_FAIL = "POSTS_LOADED_FAIL";
export const ADD_POST = "ADD_POST";
export const DELETE_POST = "DELETE_POST";
export const UPDATE_POST = "UPDATE_POST";
export const SET_LOADING = "SET_LOADING";
export const ITEM_LOAD_SUCCESS = "ITEM_LOAD_SUCCESS";
export const ITEM_LOAD_FAIL = "ITEM_LOAD_FAIL";
