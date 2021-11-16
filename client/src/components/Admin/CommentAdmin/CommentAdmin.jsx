import { Link } from "react-router-dom";
import image from "../../../images/userCard.svg";
import styles from "./CommentAdmin.css";

function CommentAdmin({ comment,handleBanComment }) {
    console.log(comment)
  return (
    <li className={styles.comment}>
      <Link className={styles.user} to={`/profile/${comment.user.username}`}>
        <img
          className={styles.userImage}
          src={comment.user.image || image}
          alt=""
        />
        <h4>{comment.user.username}</h4>
      </Link>
      <p>{comment.content}</p>
      <button value={comment.id} onClick={(e) => handleBanComment(e)}>ban</button>
    </li>
  );
}

export default CommentAdmin;
