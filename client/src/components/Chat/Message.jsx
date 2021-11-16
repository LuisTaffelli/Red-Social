import React from "react";
import styles from "./Chat.module.css";
export default function Message({ dates, setMsg, msg }) {
  return (
    <div>
      <button
        onClick={() => {
          setMsg({ ...msg, converId: dates.id });
        }}
      >
        {dates ? (
          dates.users.map((e) => <strong key={e.id}>{e.username} </strong>)
        ) : (
          <></>
        )}
      </button>
      <div className={styles.scroll}>
        {dates.msgs.map((e) => (
          <div key={e.user.id}>
            <strong>{e.user.username}</strong>
            <p>{e.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

