import {
  POSTS_LOADED_SUCCESS,
  POSTS_LOADED_FAIL,
  ADD_POST,
  DELETE_POST,
} from "../context/constants";

export const postReducer = (state, action) => {
  const { type, payload, id } = action;
  switch (type) {
    case POSTS_LOADED_SUCCESS:
      return {
        ...state,
        postItems: payload ? payload : [],
        postsLoading: false,
      };
    case POSTS_LOADED_FAIL:
      return {
        ...state,
        postItems: {},
        postsLoading: false,
      };
    case "ITEM_LOAD_SUCCESS":
      return {
        ...state,
        postItem: payload,
        postsLoading: false,
      };
    case "ITEM_LOAD_FAIL":
      return {
        ...state,
        postItem: {},
        postsLoading: false,
      };
    case ADD_POST:
      return {
        ...state,
        postItems: [...state.postItems, payload],
        postsLoading: false,
      };

    case DELETE_POST:
      return {
        ...state,
        postItems: payload.postItems,
        postsLoading: false,
      };
    case "UPDATE_POST":
      state.postItems[state.postItems.findIndex((item) => item.postId === id)] =
        payload;
      return {
        ...state,
        postItems: [...state.postItems],
      };
    case "SET_LOADING":
      return { ...state, postsLoading: payload };
    default:
      return state;
  }
};
