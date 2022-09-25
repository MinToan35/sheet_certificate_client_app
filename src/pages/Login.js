import React, { useState } from "react";
import "./login.scss";
import { useAuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
const Login = () => {
  const { loginUser } = useAuthContext();
  const [hidePassword, setHidePassword] = useState(false);
  const [loginForm, setLoginForm] = useState({
    username: "",
    password: "",
  });
  const { username, password } = loginForm;
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const loginData = await loginUser(loginForm);

      if (!loginData.success) {
        toast.error(loginData.message || "Lỗi đăng nhập");
      }
    } catch (error) {
      //console.log(error);
      console.log(error);
    }
  };
  return (
    <div className="helmet">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Đăng nhập</h2>
        <div className="input-group_login">
          <input
            type="text"
            className="info"
            //placeholder="Tên đăng nhập"
            value={username}
            onChange={(event) =>
              setLoginForm({
                ...loginForm,
                username: event.target.value,
              })
            }
            required
          />
          <label className={`label-text ${username && "valid"}`}>
            Tên đăng nhập
          </label>
        </div>
        <div className="input-group_login">
          <input
            type={hidePassword ? "text" : "password"}
            className="info"
            //placeholder="Tên đăng nhập"
            value={password}
            onChange={(event) =>
              setLoginForm({
                ...loginForm,
                password: event.target.value,
              })
            }
            required
          />
          <label className={`label-text ${password && "valid"}`}>
            Mật khẩu
          </label>
        </div>
        <button type="submit" className="btn-submit">
          Đăng nhập
        </button>
        <Link to="/">
          <button className="button-home">Quay về</button>
        </Link>
      </form>
    </div>
  );
};

export default Login;
