import React from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { updatePassword, SearchToken } from "../../Redux/actions/Session.js";
import style from "./ForgetPassword.module.css";
import { FaKey } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function ForgetPassword() {
  const dispatch = useDispatch();
  const { search } = useLocation();

  const email = new URLSearchParams(search).get("email");

  const [validate, setValidate] = useState(false);

  const [generated, setGenerated] = useState(false);

  const [inputs, setInputs] = useState({});
  const [err, setErr] = useState({});

  const handleChange = async (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputs.password || !inputs.repeat) {
      setErr({ ...err, inputs: "Inputs vacio" });
      return;
    }
    if (inputs.password !== inputs.repeat) {
      setErr({ ...err, inputs: "Deben ser iguales" });
      return;
    }
    if (inputs.password.length < 6 || inputs.password.length > 16) {
      setErr({ ...err, inputs: "Deben contener entre 6 y 16 caracteres" });
      return;
    }
    setErr({});
    setGenerated(true);
    dispatch(updatePassword({ password: inputs.password }, search));
  };

  dispatch(SearchToken(search)).then((e) =>
    setValidate(e.payload.data.success)
  );
  return (
    <div className={style.container}>
      {generated ? (
        <section className={style["card-check"]}>
          <div>
            <i className={style.check}>✓</i>
          </div>
          <h1>Updated password</h1>
          <br />
          <p>Your password has been updated</p>
        </section>
      ) : validate ? (
        <form onSubmit={handleSubmit}>
          <section>
            <label>
              Email
              <div className="input-group" disabled>
                <MdEmail />
                <input
                  className={style.input}
                  value={email}
                  name="email"
                  type="email"
                  placeholder="email"
                  disabled
                />
              </div>
            </label>
            <label htmlFor="password">
              New Password
              <div className="input-group">
                <FaKey />
                <input
                  onChange={(e) => handleChange(e)}
                  value={inputs.password}
                  name="password"
                  type="password"
                  placeholder="password..."
                />
              </div>
            </label>
            <label htmlFor="repeat">
              Repeat password
              <div className="input-group">
                <FaKey />
                <input
                  onChange={(e) => handleChange(e)}
                  value={inputs.repeat}
                  name="repeat"
                  type="password"
                  placeholder="repeat password..."
                />
              </div>
            </label>
            <span>{err.inputs}</span>
            <div className="buttonContainer">
              <button className="btn" type="submit">
                Reset Password
              </button>
            </div>
          </section>
        </form>
      ) : (
        <section className={style["card-check"]}>
          <div>
            <i className={style["no-check"]}>✗</i>
          </div>
          <h1>Request error</h1>
          <br />
          <p>Could not find your request</p>
        </section>
      )}
    </div>
  );
}
