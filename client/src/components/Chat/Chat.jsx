import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers, newMsg } from "../../Redux/actions/Users.js";
import Message from "./Message.jsx";

export default function Chat() {
  const dispatch = useDispatch();
  let user = useSelector((state) => {
    return state.sessionReducer.username;
  });
  let userConvers = useSelector((state) => state.usersReducer.convers);

  let [msg, setMsg] = useState({
    message: "",
    userId: user,
    converId: "",
  });

  let handleChange = (e) => {
    e.preventDefault();
    setMsg({ ...msg, message: e.target.value });
  };

  let handleSubmit = async (e) => {
    e.preventDefault();
    e.target.value = "";
    setMsg({ userId: user, converId: msg.converId, message: "" });
    dispatch(newMsg(msg));
    dispatch(getUsers(user));
  };

  useEffect(() => dispatch(getUsers(user)), [dispatch, user]);
  useEffect(() => dispatch(getUsers(user)), [dispatch, user]);

  return (
    <div>
      {userConvers.id ? (
        userConvers.convers.map((e) => (
          <Message key={e.id} dates={e} setMsg={setMsg} msg={msg} />
        ))
      ) : (
        <></>
      )}
      <textarea
        value={msg.message}
        onChange={(e) => {
          handleChange(e);
        }}
        name="asjdkla"
        id="1231245"
        cols="30"
        rows="10"
      />
      <button onClick={(e) => handleSubmit(e)}>submit</button>
    </div>
  );
}

