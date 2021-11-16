import { useState } from "react";
import { useDispatch } from "react-redux";
// import { Redirect } from "react-router";
import { Link } from "react-router-dom";

import { newRegister, validateEmail, validateUsername } from "../../Redux/actions/Session.js";
import validate from "../../utils/validate";

import { MdEmail } from "react-icons/md";
import { FaKey, FaUserCircle } from "react-icons/fa";

import style from "./NewRegister.module.css";

function NewRegister(props) {
  const dispatch = useDispatch();

  const [newUser, setNewUser] = useState(false)

  const [inputs, setInputs] = useState({
    username:"",
    email:"",
    password:""
  });

  const [err, setErr] = useState({
    username: "",
    password: "",
    email: "",
  });

  const handleChange = ({ target: { name, value } }) => {
    setInputs((old) => ({ ...old, [name]: value }));
    setErr((old) => ({ ...old, [name]: validate(name, value) }));
  };

  const handleBlur = async ({ target: { name, value } })=>{
    if(name === "username" && value){
      let username = await dispatch(validateUsername(value))
      if(!username.payload.data.success){
        setErr((old)=>({...old, [name]:username.payload.data.username}))
      }
    }
    if(name === "email" && value){
      let email = await dispatch(validateEmail(value))
      if(!email.payload.data.success){
        setErr((old)=>({...old,[name]:email.payload.data.email}))
      }
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if(err.username || err.password || err.email) return
    if(inputs.username && inputs.email && inputs.password){
      setErr({
        username: "",
        password: "",
        email: "",
      });
      setInputs({
        username:"",
        email:"",
        password:""
      });
      setNewUser(true)
      dispatch(newRegister(inputs))
    }
  };

  return (
    <div className={style.container}>
      {
        !newUser?
        <>
          <form onSubmit={(e) => handleSubmit(e)}>
            <h1>Sign Up</h1>
            <section>
              <label>
                Username
                <div className="input-group">
                  <FaUserCircle />
                  <input
                    onChange={(e) => handleChange(e)}
                    onBlur={(e)=> handleBlur(e)}
                    className={style.input}
                    value={inputs.username}
                    name="username"
                    type="text"
                    placeholder="username"
                  />
                </div>
              </label>
              <span>{err.username}</span>
              <label>
                Email
                <div className="input-group">
                  <MdEmail />
                  <input
                    onChange={(e) => handleChange(e)}
                    onBlur={(e)=> handleBlur(e)}
                    className={style.input}
                    value={inputs.email}
                    name="email"
                    type="email"
                    placeholder="email"
                  />
                </div>
              </label>
              <span>{err.email}</span>
              <label>
                Password
                <div className="input-group">
                  <FaKey />
                  <input
                    onChange={(e) => handleChange(e)}
                    className={style.input}
                    value={inputs.password}
                    name="password"
                    type="password"
                    placeholder="password"
                  />
                </div>
              </label>
              <span>{err.password}</span>
            </section>
            <div className="buttonContainer">
              <button className="btn" type="submit">
                SignUp
              </button>
              <Link className="btn" to="/login">
                LogIn
              </Link>
            </div>
          </form>
        </>
        :
            <section className={style["card-check"]}>
              <div>
                <i>✓</i>
              </div>
                <h1>Verify Your Email</h1>
                <br/>
                <p>Please check your email for a link to verify your email address.<br/>Once verified, you'll be able to continue</p>
            </section>            
      }

    </div>
  );
}

export default NewRegister;
