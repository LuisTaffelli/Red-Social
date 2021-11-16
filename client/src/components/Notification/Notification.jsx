import UserCard from "../UserCard/UserCard";

import styles from "./Notification.module.css";

export default function Notification({ notification }) {
  let action;

  if (notification.type === 1) {
    action = "liked";
  } else if (notification.type === 2) {
    action = "commented";
  } else {
    action = "shared";
  }

  console.log(notification);

  return (
    <div className={styles.notification}>
      <UserCard
        user={{
          username: notification.senderName,
          image: notification.userImage,
        }}
        showName
        showImage
        toRight
        other={`${action} your post`}
        small
      />
    </div>
  );
}
