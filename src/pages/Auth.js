import React from "react";
import Login from "./Login";
import { useAuthContext } from "../context/AuthContext";
import { Navigate } from "react-router-dom";
import Register from "./Register";
import Loading from "../components/Loading/Loading";
const Auth = ({ authRoute }) => {
  const { authState } = useAuthContext();

  const { isAuthenticated, authLoading } = authState;
  let body;
  if (authLoading)
    body = (
      <div className="d-flex justify-content-center mt-2">
        <Loading />
      </div>
    );
  else if (isAuthenticated && authRoute === "login") return <Navigate to="/" />;
  else
    body = (
      <>
        {authRoute === "login" && <Login />}
        {authRoute === "register" && <Register />}
      </>
    );
  return <>{body}</>;
};

export default Auth;
