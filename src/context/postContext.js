import React, { createContext, useContext, useReducer, useState } from "react";
import { postReducer } from "../reducer/postReducer";
import {
  apiUrl,
  POSTS_LOADED_FAIL,
  POSTS_LOADED_SUCCESS,
  ITEM_LOAD_SUCCESS,
  ITEM_LOAD_FAIL,
  SET_LOADING,
  ADD_POST,
  DELETE_POST,
  UPDATE_POST,
} from "./constants";
import { toast } from "react-toastify";
import axios from "axios";

const PostContext = createContext();

export const usePostContext = () => {
  return useContext(PostContext);
};

const PostContextProvider = ({ children }) => {
  const [postState, dispatch] = useReducer(postReducer, {
    postItems: [],
    postItem: {},
    postsLoading: false,
  });
  const [items, setItems] = useState([]);
  const [certificate, setCertificate] = useState([]);
  const [data1, setData1] = useState([]);
  const [showManagerModal, setShowManagerModal] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);

  const getItems = async () => {
    dispatch({
      type: SET_LOADING,
      payload: true,
    });
    try {
      const response = await axios.get(`${apiUrl}/posts`);
      if (response.data.success) {
        dispatch({
          type: POSTS_LOADED_SUCCESS,
          payload: response.data.posts,
        });
      }
    } catch (error) {
      dispatch({ type: POSTS_LOADED_FAIL });
    }
  };

  const getItem = async (id) => {
    dispatch({
      type: SET_LOADING,
      payload: true,
    });
    try {
      const response = await axios.get(`${apiUrl}/posts/search/${id}`);
      if (response.data.success) {
        dispatch({
          type: ITEM_LOAD_SUCCESS,
          payload: response.data.posts,
        });
      }
      return response.data;
    } catch (error) {
      dispatch({ type: ITEM_LOAD_FAIL });
      return error.response.data;
    }
  };
  const addItems = async (newItems, name) => {
    dispatch({
      type: SET_LOADING,
      payload: true,
    });
    try {
      const response = await axios.post(`${apiUrl}/posts`, {
        items: newItems,
        postName: name,
      });
      if (response.data.success) {
        dispatch({ type: ADD_POST, payload: response.data.posts });
      } else {
        toast.error(response.data.message);
        dispatch({
          type: SET_LOADING,
          payload: false,
        });
      }
    } catch (error) {
      dispatch({
        type: SET_LOADING,
        payload: false,
      });
      console.log("error");
    }
  };

  const deleteItems = async (id) => {
    dispatch({
      type: SET_LOADING,
      payload: true,
    });
    try {
      const response = await axios.delete(`${apiUrl}/posts/${id}`);
      if (response.data.success) {
        dispatch({
          type: DELETE_POST,
          payload: {
            postItems: postState.postItems.filter((item) => item.postId !== id),
          },
        });
        return response.data;
      } else {
        dispatch({
          type: SET_LOADING,
          payload: false,
        });
        return response.data;
      }
    } catch (error) {
      dispatch({
        type: SET_LOADING,
        payload: false,
      });
      return error.response.data
        ? error.response.data
        : { success: false, message: "Server error" };
    }
  };

  const updateItems = async (newItems, id) => {
    try {
      const response = await axios.put(`${apiUrl}/posts/${id}`, {
        items: newItems,
      });
      if (response.data.success) {
        dispatch({ type: UPDATE_POST, payload: response.data.posts, id });
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };
  return (
    <PostContext.Provider
      value={{
        addItems,
        deleteItems,
        getItems,
        getItem,
        updateItems,
        postState,
        items,
        setItems,
        certificate,
        setCertificate,
        data1,
        setData1,
        showManagerModal,
        setShowManagerModal,
        showAdminBoard,
        setShowAdminBoard,
      }}
    >
      {children}
    </PostContext.Provider>
  );
};
export default PostContextProvider;
