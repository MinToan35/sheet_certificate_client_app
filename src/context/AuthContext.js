import React, { createContext, useContext, useReducer, useEffect } from "react";
import { authReducer } from "../reducer/authReducer";
import { apiUrl, LOCAL_STORAGE_TOKEN_NAME, SET_AUTH } from "./constants";

import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import { toast } from "react-toastify";
const AuthContext = createContext();
export const useAuthContext = () => {
  return useContext(AuthContext);
};

const AuthContextProvider = ({ children }) => {
  const [authState, dispatch] = useReducer(authReducer, {
    authLoading: false,
    isAuthenticated: false,
    user: null,
    users: null,
  });

  const loadUser = async () => {
    if (localStorage[LOCAL_STORAGE_TOKEN_NAME]) {
      setAuthToken(localStorage[LOCAL_STORAGE_TOKEN_NAME]);
    }

    try {
      const response = await axios.get(`${apiUrl}/auth`);
      if (response.data.success) {
        dispatch({
          type: SET_AUTH,
          payload: {
            authLoading: false,
            isAuthenticated: true,
            user: response.data.user,
          },
        });
      }
    } catch (error) {
      localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
      setAuthToken(null);
      dispatch({
        type: SET_AUTH,
        payload: { authLoading: false, isAuthenticated: false, user: null },
      });
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  // Login
  const loginUser = async (userForm) => {
    dispatch({
      type: SET_AUTH,
      payload: { authLoading: true, isAuthenticated: false, user: null },
    });
    try {
      const response = await axios.post(`${apiUrl}/auth/login`, userForm);
      if (response.data.success)
        localStorage.setItem(
          LOCAL_STORAGE_TOKEN_NAME,
          response.data.accessToken
        );
      await loadUser();

      return response.data;
    } catch (error) {
      if (error.response) {
        dispatch({
          type: SET_AUTH,
          payload: {
            authLoading: false,
            isAuthenticated: false,
            user: null,
          },
        });
        return error.response.data;
      } else return { success: false, message: "Server error" };
    }
  };
  const registerUser = async (userForm) => {
    dispatch({
      type: "SET_LOADING",
      payload: true,
    });
    try {
      const response = await axios.post(`${apiUrl}/auth/register`, userForm);
      if (response.data.success) toast.success("Đăng ký thành công");
      dispatch({
        type: "SET_LOADING",
        payload: false,
      });

      return response.data;
    } catch (error) {
      dispatch({
        type: SET_AUTH,
        payload: {
          authLoading: false,
        },
      });
      if (error.response) {
        return error.response.data;
      } else return { success: false, message: "Server error" };
    }
  };

  const logoutUser = async () => {
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_NAME);
    dispatch({
      type: SET_AUTH,
      payload: { isAuthenticated: false, user: null },
    });
  };

  const getAllUser = async () => {
    try {
      const response = await axios.get(`${apiUrl}/auth/users`);
      if (response.data.success) {
        dispatch({
          type: "SET_USERS",
          payload: {
            users: response.data.users,
          },
        });
      }
    } catch (error) {
      dispatch({
        type: "SET_USERS",
        payload: {
          users: null,
        },
      });
    }
  };

  const deleteUser = async (id) => {
    try {
      const response = await axios.delete(`${apiUrl}/auth/${id}`);
      if (response.data.success) {
        dispatch({
          type: "DELETE_USERS",
          payload: { users: authState.users.filter((item) => item._id !== id) },
        });
        return response.data;
      }
    } catch (error) {
      return error.response.data
        ? error.response.data
        : { success: false, message: "Server error" };
    }
  };
  return (
    <AuthContext.Provider
      value={{
        loginUser,
        registerUser,
        logoutUser,
        getAllUser,
        deleteUser,
        authState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
