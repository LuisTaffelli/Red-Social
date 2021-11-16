import { useState } from "react";
import { useDispatch } from "react-redux";
// import { Redirect } from "react-router";
import { Link } from "react-router-dom";

import { validateAccount, sendResetPassword } from "../../Redux/actions/Session.js";

import { FaUserCircle } from "react-icons/fa";

import style from "./ResetPassword.module.css";

function ResetPassword(props) {
  const dispatch = useDispatch();

  const [newUser, setNewUser] = useState(false)

  const [inputs, setInputs] = useState({
    account:""
  });

  const [err, setErr] = useState({
    success:false,
    msg:"Couldn't find your CodeNet account"
  });
 
  const handleChange = ({ target: { name, value } }) => {
    setInputs((old) => ({ ...old, [name]: value }));
  };

  const handleBlur = async ()=>{
    if(inputs.account){
      const user = await dispatch(validateAccount(inputs))
      setErr(user.payload.data)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(err.success){
      setNewUser(true)
      dispatch(sendResetPassword({email:inputs.account,username:inputs.account}))
    }
  };
  return (
    <div className={style.container}>
      {
        !newUser?
        <>
          <form onSubmit={(e) => handleSubmit(e)}>
            <h2>Trouble Logging In?</h2>
            <br/>
            <p>Enter your email or username and we'll send you a link to get back into your account.</p>
            <section>
              <label>
                <div className="input-group">
                  <FaUserCircle />
                  <input
                    onChange={(e) => handleChange(e)}
                    onBlur={(e)=> handleBlur(e)}
                    className={style.input}
                    value={inputs.account}
                    name="account"
                    type="text"
                    placeholder="Username or Email"
                  />
                </div>
              </label>
            </section>
            <div className="buttonContainer">
              <button className="btn" type="submit" disabled={!inputs.account}>
                Send Reset Link
              </button>
              <br/>
              <div className={style.strike}>
                <div>or</div>
              </div>
              <Link className="btn" to="/n/signup">
                Create New Account
              </Link>
            </div>
          </form>
        </>
        :
        <>
            <section className={style["card-check"]}>
            <div>
              <i>✓</i>
            </div>
              <h1>Verify Your Email</h1> 
              <br/>
              <p>We have sent an email, with a link to return to your account<br/></p>
            </section>            
        </>
      }

    </div>
  );
}

export default ResetPassword;
