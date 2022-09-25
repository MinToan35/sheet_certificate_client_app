import React, { useState } from "react";
import { toast } from "react-toastify";
import { useAuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";
const Register = () => {
  const { registerUser } = useAuthContext();
  const [hidePassword, setHidePassword] = useState(false);
  const [registerForm, setRegisterForm] = useState({
    username: "",
    password: "",
    role: "user",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const { username, password } = registerForm;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Mật khẩu xác nhận sai");
    } else {
      try {
        const register = await registerUser(registerForm);
        if (!register.success) {
          toast.error(register.message);
        }
      } catch (error) {
        toast.error(error.message);
      }
    }
  };
  return (
    <div className="helmet">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Đăng ký</h2>
        <div className="input-group_login">
          <input
            type="text"
            className="info"
            value={username}
            onChange={(event) =>
              setRegisterForm({
                ...registerForm,
                username: event.target.value,
              })
            }
            required
          />
          <label className={`label-text ${username && "valid"}`}>
            Tên người dùng
          </label>
        </div>
        <div className="input-group_login">
          <input
            type={hidePassword ? "text" : "password"}
            className="info"
            value={password}
            onChange={(event) =>
              setRegisterForm({
                ...registerForm,
                password: event.target.value,
              })
            }
            required
          />
          <label className={`label-text ${password && "valid"}`}>
            Mật khẩu
          </label>
        </div>
        <div className="input-group_login">
          <input
            type={hidePassword ? "text" : "password"}
            className="info"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            required
          />
          <label className={`label-text ${confirmPassword && "valid"}`}>
            Xác nhận mật khẩu
          </label>
        </div>
        <select
          onChange={(event) =>
            setRegisterForm({
              ...registerForm,
              role: event.target.value,
            })
          }
        >
          <option value="user">User</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit" className="btn-submit">
          Đăng ký
        </button>
        <Link to="/">
          <button className="button-home">Quay về</button>
        </Link>
      </form>
    </div>
  );
};

export default Register;
