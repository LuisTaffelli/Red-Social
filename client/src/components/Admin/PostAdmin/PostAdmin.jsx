import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import image from "../../../images/userCard.svg";
import Tags from "../../Tags/Tags";


import {
  commentPost,
  deletePost,
  updatePost,
  updatePage,
  likePost,
  banPost,
  banComment,
  deleteComment
} from "../../../Redux/actions/Post";

import CommentAdmin from "../CommentAdmin/CommentAdmin";

import styles from "./PostAdmin.module.css";

//Icons
import {
  MdFavoriteBorder,
  MdOutlineModeComment,
  MdShare,
  MdSend,
  MdFavorite,
} from "react-icons/md";

import { GoTrashcan } from "react-icons/go";

import { BsFillPencilFill } from "react-icons/bs";

import { BiCommentDetail, BiDotsVerticalRounded } from "react-icons/bi";
import validate from "../../../utils/validate";
import UserCardAdmin from "../UserCardAdmin/UserCardAdmin";

const parseContent = (text) => {
  const mentions = text && text.match(/@\w+/gi);

  if (!mentions) return [text];

  const parsed = text.split(" ").map((value) => {
    if (mentions.includes(value)) {
      return (
        <Link
          className={styles.mention}
          to={`/profile/${value.slice(1, value.length)}`}
        >
          {value}
        </Link>
      );
    } else return " " + value + " ";
  });

  return parsed;
};
function PostAdmin({  post, customClass, socket, admin  }) {
  const dispatch = useDispatch();

  const page = useSelector(({ postsReducer: { page } }) => page);
  const session = useSelector((state) => state.sessionReducer || {});

  const [firstLoad, setFirstLoad] = useState(true);
  const [seeMore, setSeeMore] = useState(false);
  const [liked, setLiked] = useState(
    post.userLikes.filter((like) => like.user.username === session.username)
      .length
      ? true
      : false
  );
  const [currentPost, setCurrentPost] = useState(null);

  const [newComment, setNewComment] = useState("");

  const [commentError, setCommentError] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [editErrors, setEditErrors] = useState({});
  const [reload, setReload] = useState(false);

  const [options, setOptions] = useState(false);

  const [edit, setEdit] = useState({
    title: post.title,
    content: post.content,
    image: post.image,
  });

  const createdAt = new Date(post.updatedAt).getTime();
  const now = new Date().getTime();
  const TimeSpan = Math.round(Math.abs(now - createdAt) / 36e5);

  // useEffect(() => {
  //   if(currentPost){
  //     post = currentPost

  //     // console.log(post)
  //     setReload((prev) => !prev)
  //   }
  // }, [currentPost])


  useEffect(() => {
    if(!socket) return;
    if (Object.keys(socket).length) {
      socket.on("getPost", (data) => {
        if (post.idPost === data.idPost) {
          setCurrentPost(data);
        }
      });
    }
  }, [socket]);

  useEffect(() => {
    if (liked) {
      socket.emit("sendNotification", {
        senderName: session.username,
        userImage: session.image,
        receiverName: post.user.username,
        id: post.idPost,
        type: 1,
      });
    }
  }, [liked]);

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
    }
  }, [firstLoad, setFirstLoad]);

  useEffect(() => {
    setEdit({
      title: post.title,
      content: post.content,
      image: post.image,
    });
  }, [post]);

  const handleComment = ({ target: { name, value } }) => {
    setNewComment(value);
    setCommentError(validate(name, value));
  };

  const submitComment = (e) => {
    e.preventDefault();
    if (commentError) return;
    dispatch(commentPost(post.idPost, newComment, session.username, socket));
    socket.emit("sendNotification", {
      senderName: session.username,
      userImage: session.image,
      receiverName: post.user.username,
      type: 2,
    });
  };

  const handleDelete = () => dispatch(deletePost(post.idPost));

  const handleEditMode = (mode) => {
    setEdit({
      title: post.title,
      content: post.content,
      image: post.image,
    });
    setEditMode(mode);
  };

  const handleLike = (e) => {
    if (session.username) {
      dispatch(
        likePost({ postIdPost: post.idPost, userId: session.username }, socket)
      );

      liked ? setLiked(false) : setLiked(true);
    }
  };

  function handleChange({ target: { name, value } }) {
    if (
      value === "" &&
      ((!edit.content && name === "image") ||
        (!edit.image && name === "content") ||
        name === "title")
    ) {
      return;
    }
    setEdit((old) => ({ ...old, [name]: value }));
  }

  const submitEdit = (e) => dispatch(updatePost(post.idPost, edit));

  const handleOptions = () => setOptions((old) => !old);

  const tags = new Set();
  post.tag.filter((tag) => (!!tag ? tags.add(tag) : false));
  post.tag = Array.from(tags);

  let test;
  if (post.content) test = parseContent(post.content);

  const hanbleBanPost = (e) =>{
    e.preventDefault();
    dispatch(banPost(e.target.value));
    socket.emit("sendNotification", {
      senderName: session.username,
      userImage: session.image,
      receiverName: post.user.username,
      type: 2,
    });
    alert('Ban, successfully applied');
  }


  const handleBanComment = (e) => {
    e.preventDefault();
    dispatch(deleteComment(e.target.value));
    alert('Comment deleted successfully')
  }

  return (
    <div className={styles.container + ` ${customClass}`}>
     {session.username !== post.user.username ? (
      <div className={styles.options}>
      <button onClick={handleOptions} className={styles.optionsHandler}>
        <BiDotsVerticalRounded
          style={{ color: "#1e1e1e", width: "2em", height: "2em" }}
        />
      </button>

      {editMode ? (
        <li>
          <button
            onClick={() => {
              handleEditMode(false);
            }}
          >
            cancel
          </button>
        </li>
      ) : (
        ""
      )}

      <div
        className={`${options ? styles.show : styles.hide} ${
          styles.optionsMenu
        }`}
      >
        <button value={post.idPost}
          name="Ban Post"
          onClick={(e) => hanbleBanPost(e)}>
          <BsFillPencilFill />
          Ban
        </button>
        <button
          className={styles.danger}
          onClick={() => {
            handleDelete();
          }}
        >
          <GoTrashcan style={{ color: "#fff" }} />
          Ban 
        </button>
        </div>
        </div>
      ) : (
            ""
      )}
      
      <Tags tags={post.tag} />
     
      {/* <button value={post.idPost}
        name="Ban Post"
        onClick={(e) => hanbleBanPost(e)}>Ban POST</button> */}
      <Link
        className={styles.userContainer}
        to={`/profileAdmin/${post.user.username}`}
      >
        
        <UserCardAdmin
          toRight
          showImage
          showName
          user={{ username: post.user.username }}
          other={`Posted ${TimeSpan}hr ago`}
        />
      </Link>

      <div className={styles.postBody}>
        {editMode ? (
          <label>
            <div className="input-group">
              <input
                value={edit.title}
                name="title"
                onChange={(e) => handleChange(e)}
              />
            </div>
          </label>
        ) : (
          <h3>{post.title}</h3>
        )}

        {editMode ? (
          <div>
            <label>
              <div className="input-group">
                <textarea
                  value={edit.content}
                  name="content"
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </label>
            <button className={styles.submitEdit} onClick={submitEdit}>
              Submit
            </button>
          </div>
        ) : (
          <div
            className={styles.mainContent + ` ${seeMore ? styles.expand : ""}`}
            style={seeMore ? { overflowY: "visible" } : { overflowY: "hidden" }}
          >
            <p
              className={styles.text}
              style={seeMore ? { marginBottom: "1em" } : { marginBottom: "0" }}
            >
              {test && test.map((value) => value)}
            </p>
            <button
              className={styles.seeMore}
              style={seeMore ? { bottom: "-2em" } : { bottom: "0" }}
              onClick={() => setSeeMore((old) => !old)}
            >
              {seeMore ? "...See less" : "...See more"}
            </button>
          </div>
        )}
      </div>
      


      {post.imageData ? (
        <img
          className={styles.postImage}
          src={`data:${post.imageType};base64, ${post.imageData}`}
          alt={post.imageName}
        />
      ) : (
        ""
      )}
      <div className={styles.actions}>
        <button className={!session.username ? "" : ""} onClick={handleLike}>
          {liked ? (
            <MdFavorite className={styles.icons} color="#f55" />
          ) : (
            <MdFavoriteBorder className={styles.icons} />
          )}
          {post.userLikes.length}
        </button>

        <button>
          <MdOutlineModeComment />{" "}
          {currentPost
            ? currentPost.comments && currentPost.comments.length
            : post.comments && post.comments.length}
        </button>
      </div>

      {session.username ? (
        <div className={styles.newCommentContainer}>
          <div className={styles.inline}>
            <span className={styles.maxLength}>{newComment.length} / 1000</span>
            <span>{commentError}</span>
          </div>
          <form className={styles.newComment} onSubmit={submitComment}>
            <label className={commentError ? "error" : ""}>
              <div className="input-group">
                <input
                  onChange={handleComment}
                  name="comment"
                  type="text"
                  value={newComment}
                  placeholder="New comment..."
                />
              </div>
            </label>
            {newComment.length && !commentError ? (
              <button type="submit">
                <MdSend
                  className={styles.icons}
                  style={{ margin: "0", color: "#fff" }}
                />
              </button>
            ) : (
              <></>
            )}
          </form>
        </div>
      ) : (
        ""
      )}

      {currentPost ? (
        currentPost.comments && currentPost.comments.length ? (
          <ul className={styles.comments}>
            <h5 style={{ margin: "1em 0 0 0" }}>Comments</h5>
            {currentPost.comments.map((comment, i) =>
              i < 3 ? <CommentAdmin key={i} comment={comment} handleBanComment={handleBanComment}/> : <></>
            )}
          </ul>
        ) : (
          ""
        )
      ) : post.comments && post.comments.length ? (
        <ul className={styles.comments}>
          <h5 style={{ margin: "1em 0 0 0" }}>Comments</h5>
          {post.comments.map((comment, i) =>
            i < 3 ? <CommentAdmin key={i} comment={comment} handleBanComment={handleBanComment}/> : <></>
          )}
        </ul>
      ) : (
        ""
      )}
      </div>
  );
}

export default PostAdmin;

