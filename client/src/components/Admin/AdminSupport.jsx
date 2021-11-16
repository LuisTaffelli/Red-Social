import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getSupport } from "../../Redux/actions/Support";

export default function AdminSupport() {
  const dispatch = useDispatch();
  const message = useSelector((state) => state.supportReducer.messageSupport);

  const [flags, setFlags] = useState(false);

  useEffect(() => {
    dispatch(getSupport());
  }, [dispatch, flags]);

  const handleClick = (e) => {
    e.preventDefault();
    dispatch(getSupport());
    setFlags(true);
  };

  return (
    <div>
      {message.length > 0 ? (
        message.map((e) => (
          <div>
            <h3>{e.username}</h3>
            <h3>{e.title}</h3>
            <p>{e.content}</p>
          </div>
        ))
      ) : (
        <div>Welcom support</div>
      )}
      <button onClick={(e) => handleClick(e)}>recargar</button>;
    </div>
  );
}

