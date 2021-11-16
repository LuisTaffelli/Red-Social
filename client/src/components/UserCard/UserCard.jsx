import React from "react";

import styles from "./UserCard.module.css";

import image from "../../images/userCard.svg";

export default function UserCard({
  user,
  showName,
  showImage,
  toLeft,
  toRight,
  small,
  other,
}) {
  const ImgElement = (
    <img
      className={user.image ? "" : styles.noImage}
      src={user.image || image}
      alt=""
    />
  );

  return (
    <div className={`${styles.container} ${small ? styles.small : ""}`}>
      {toRight && showImage && ImgElement}
      <div className={styles.column}>
        {showName && <span className={styles.username}>{user.username}</span>}
        {other && <span className={styles.other}>{other}</span>}
      </div>
      {toLeft && showImage && ImgElement}
    </div>
  );
}
