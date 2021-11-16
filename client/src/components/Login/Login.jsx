import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logIn } from "../../Redux/actions/Session.js";
import validate from "../../utils/validate.js";
import style from "./Login.module.css";
import { Redirect } from "react-router";

import { FaUserCircle, FaKey } from "react-icons/fa";

export default function Login() {
  const dispatch = useDispatch();
  const session = useSelector((state) => state.sessionReducer);

  const [input, setInput] = useState({
    username: process.env.REACT_APP_LOGIN_USERNAME || "",
    password: process.env.REACT_APP_LOGIN_PASSWORD || "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  function handleChange({ target: { name, value } }) {
    setInput({ ...input, [name]: value.replaceAll(/^\s+/g, "") });
    setErrors({ ...errors, [name]: validate(name, value) });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!Object.values(errors).filter((error) => error).length) {
      let errores = await dispatch(logIn(input));
      if (errores.type === "ERROR") {
        alert("Usuario o Contrasena invalidos")
      }else{
        setInput({
          username: "",
          password: "",
        });
        setErrors({
          username: "",
          password: "",
        });
      }
    }
  }

  return session.username ? (
    <Redirect to="/home" />
  ) : (
    <div className={style.container}>
      {/*<img
        src="https://images.pexels.com/photos/1851415/pexels-photo-1851415.jpeg"
        alt=""
      />*/}

      <form onSubmit={(e) => handleSubmit(e)}>
        <h1>Log In</h1>
        <label className={errors.username ? "error" : ""}>
          Username
          <div className="input-group">
            <FaUserCircle />
            <input
              type="text"
              value={input.username}
              name="username"
              onChange={(e) => handleChange(e)}
              placeholder="Enter username"
            />
          </div>
        </label>
        <span>{errors.username}</span>

        <label className={errors.password ? "error" : ""}>
          Password
          <div className="input-group">
            <FaKey />
            <input
              type="password"
              value={input.password}
              name="password"
              onChange={(e) => handleChange(e)}
              placeholder="Enter password"
            />
          </div>
        </label>
        <span>{errors.password}</span>
        <Link className="btn simple" to="/accounts/password/reset/">
          forgot password?
        </Link>

        <div className="buttonContainer">
          <button className="btn" type="submit">
            LogIn
          </button>
          <Link className="btn" to="/signup">
            SignUp
          </Link>
          <Link to="/loginAdmin">Login Admin</Link>
        </div>
      </form>
    </div>
  );
}
