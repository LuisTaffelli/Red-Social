import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import UserList from "../UserList/UserList";
import style from "./SearchBar.module.css";
import { BiSearch } from "react-icons/bi";
import { searchUser } from "../../Redux/actions/Users";

export default function SearchBar(props) {
  const dispatch = useDispatch();

  const users = useSelector((state) => state.usersReducer.users);

  const [input, setInput] = useState("");
  const [show, setShow] = useState(false);

  useEffect(() => dispatch(searchUser(input)), [input, dispatch]);

  const handleChange = ({ target: { value } }) => {
    setInput(value);
  };

  const handleList = (e) => {
    setShow(e);
  };

  return (
    <label className={style.inputData}>
      <BiSearch className={style.icon} />
      <input
        onBlur={() => handleList(false)}
        onFocus={() => handleList(true)}
        onChange={handleChange}
        placeholder="Search Users"
      />
      <UserList show={show} users={users} input={input} />
    </label>
  );
}
