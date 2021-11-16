import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import image from "../../images/userCard.png";
import UserCard from "../UserCard/UserCard";
import Tags from "../Tags/Tags";
import { NavLink } from "react-router-dom";
import {
  commentPost,
  deletePost,
  updatePost,
  likePost,
} from "../../Redux/actions/Post";

import Comment from "../Comment/Comment";

import styles from "./Post.module.css";

//Icons
import {
  MdFavoriteBorder,
  MdOutlineModeComment,
  MdSend,
  MdFavorite,
} from "react-icons/md";

import { GoTrashcan } from "react-icons/go";

import { BsFillPencilFill } from "react-icons/bs";

import { FaPlay } from "react-icons/fa";

import { BiCommentDetail, BiDotsVerticalRounded } from "react-icons/bi";
import validate from "../../utils/validate";

import axios from "axios";

// CodeMirror
import CodeMirror from "@uiw/react-codemirror";
import "codemirror/theme/dracula.css";
import "codemirror/keymap/vim";
import "codemirror/keymap/sublime";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";

const parseContent = (text) => {
  const mentions = text && text.match(/@\w+/gi);

  if (!mentions) return [text];

  const parsed = text.split(" ").map((value) => {
    if (mentions.includes(value)) {
      return (
        <NavLink
          activeClassName={styles.active}
          className={styles.mention}
          to={`/profile/${value.slice(1, value.length)}`}
        >
          {value}
        </NavLink>
      );
    } else return " " + value + " ";
  });

  return parsed;
};

function Post({ post, customClass, user, socket, admin, type }) {
  const dispatch = useDispatch();

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

  const [options, setOptions] = useState(false);

  const [edit, setEdit] = useState({
    title: post.title,
    content: post.content,
    image: post.image,
    tag: post.tag,
  });


  const createdAt = new Date(post.updatedAt).getTime();
  const now = new Date().getTime();
  const TimeSpan = Math.round(Math.abs(now - createdAt) / 36e5);

  const [code, setCode] = useState("a = 0");

  useEffect(() => {
    if (socket && Object.keys(socket).length) {
      socket.on("getPost", (data) => {
        if (post.idPost === data.idPost) {
          setCurrentPost(data);
        }
      });
    }
  }, [socket, post.idPost]);

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
  }, [
    liked,
    post.idPost,
    post.username,
    session.image,
    session.username,
    socket,
    post.user.username,
  ]);

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
      tag: post.tag,
    });
    setLiked(post.userLikes.filter((like) => like.user.username === session.username)
      .length
      ? true
      : false)
      setEditMode(false)
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
      tag: post.tag,
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

  function handleSelect(e) {
    setEdit((old) => ({ ...old, tag: e.map((tag) => tag.value) }));
  }

  const submitEdit = (e) => dispatch(updatePost(post.idPost, edit));

  const handleOptions = () => setOptions((old) => !old);

  const submitCode = () => {
    // axios
    //   .get("http://localhost:3001/challenge/comment/atalesam", {
    //     code,
    //     username: "atalesam",
    //     postid: 1,
    //     description: "asd",
    //   })
    //   .then((res) => console.log(res))
    //   .catch((e) => console.log(e));
  };

  const [result, setResult] = useState(null);

  const testing = () => {
    axios
      .post("http://localhost:3001/challenge/testing/", { code: newComment })
      .then((res) => {
        console.log(res.data);
        if (res?.data.error) {
          setErrorTest(true);
          setResult(null)
        }else {
          setErrorTest(false);
          setResult(res.data.tested);
        }
      })
      .catch((e) => console.log(e));
  };

  const tags = new Set();
  post.tag.filter((tag) => (!!tag ? tags.add(tag) : false));
  post.tag = Array.from(tags);

  let test;
  if (post.content) test = parseContent(post.content);


  const [errorTest, setErrorTest] = useState(null);


  return (
    <div className={styles.container + ` ${customClass}`}>
      {session.username === post.user.username ? (
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
            <button onClick={() => handleEditMode(true)}>
              <BsFillPencilFill />
              Edit
            </button>
            <button
              className={styles.danger}
              onClick={() => {
                handleDelete();
              }}
            >
              <GoTrashcan style={{ color: "#fff" }} />
              Delete
            </button>
          </div>
        </div>
      ) :
        ""
      }

      <Tags tags={post.tag} mode={editMode} handleSelect={handleSelect} editTags={edit.tag}/>

      <NavLink
        activeClassName={styles.active}
        className={styles.userContainer}
        to={`/profile/${post.user.username}`}
      >
        <UserCard
          toRight
          showImage
          showName
          user={{ username: post.user.username }}
          other={`Posted ${TimeSpan}hr ago`}
        />
      </NavLink>
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
        <button className={styles.favorite} onClick={handleLike}>
          {liked ? (
            <MdFavorite className={styles.icons} color="#f55" />
          ) : (
            <MdFavoriteBorder className={styles.icons} />
          )}
          {post.userLikes.length}
        </button>

        <button>
          <MdOutlineModeComment className={styles.icons} />
          {currentPost
            ? currentPost.comments && currentPost.comments.length
            : post.comments && post.comments.length}
        </button>
      </div>

      {session.username && post.type !== "challenge" ? (
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
        <div className={styles.newChallengeContainer}>
          {/* <button className={styles.button} onClick={submitCode}>
            Submit
          </button>
          <button
            onClick={() =>
              axios
                .get("http://localhost:3001/challenge/post")
                .then((res) => console.log(res))
            }
          >
            AXIOS
          </button> */}
          {/* Pop Up */}
          <a className={styles.toButton} href="#popup">
            <FaPlay style={{ color: "white" }} />
          </a>
          <div id="popup" class="overlay">
            <div id="popupBody">
              <h2>Create a function that adds two numbers in JavaScript</h2>
              <CodeMirror
                className={styles.CodeMirror}
                options={{
                  theme: "dracula",
                  mode: "javascript",
                  keyMap: "sublime",
                  autoCloseTags: true,
                  autoCloseBrackets: true,
                }}
                value={code}
                height="80%"
                width="100%"
                onChange={(editor, viewUpdate) => {
                  setNewComment(editor.getValue());
                }}
              />
              <a id="cerrar" href="#">
                <img src="https://img.icons8.com/ios-glyphs/30/000000/macos-close.png" />
              </a>
              <div class="popupContent">
                {errorTest ? (
                  <img
                    className={styles.icon}
                    src="https://img.icons8.com/color/48/000000/fail.png"
                  />
                ) : (
                  <img
                    className={styles.icon}
                    src="https://img.icons8.com/color/48/000000/pass.png"
                  />
                )}

                <h2>{result}</h2>

                <button onClick={submitComment}>Submitt</button>
                <button onClick={testing}>Test</button>
              </div>
            </div>
          </div>
          {/* <div className={styles.inline}>
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
          </form> */}
        </div>
      )}

      {currentPost ? (
        currentPost.comments && currentPost.comments.length ? (
          <ul className={styles.comments}>
            <h5 style={{ margin: "1em 0 0 0" }}>Comments</h5>
            {currentPost.comments.map((comment, i) =>
              i < 3 ? <Comment key={i} comment={comment} /> : <></>
            )}
          </ul>
        ) : (
          ""
        )
      ) : post.comments && post.comments.length ? (
        <ul className={styles.comments}>
          <h5 style={{ margin: "1em 0 0 0" }}>Comments</h5>
          {post.comments.map((comment, i) =>
            i < 3 ? (
              <Comment key={i} comment={comment} type={post.type} />
            ) : (
              <></>
            )
          )}
        </ul>
      ) : (
        ""
      )}
    </div>
  );
}

export default Post;
