import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Post from "../../Post/Post";
import PostAdmin from "../PostAdmin/PostAdmin";
import NewPost from "../../NewPost/NewPost";
import UserCardAdmin from "../UserCardAdmin/UserCardAdmin";

import styles from "./stalesAdmin.css";
import { clearPosts, getPosts, updatePage } from "../../../Redux/actions/Post";
import { FaLeaf } from "react-icons/fa";
import { Link } from "react-router-dom";

import { socketConnection } from "../../../Redux/actions/Users";


import axios from "axios";

function HomeAdmin(props) {
  const posts = useSelector((state) => state.postsReducer.posts);
  const session = useSelector((state) => state.sessionReducer);

  const socket = useSelector((state) => state.usersReducer.socket);
  // console.log(socket);
  const [page, totalPages] = useSelector(
    ({ postsReducer: { page, totalPages } }) => [page, totalPages]
  );

  const dispatch = useDispatch();

  const [createPost, setCreatePost] = useState(false);
  const [conversations, setConversations] = useState([]);
  const [first, setFirst] = useState(true);

  useEffect(() => {
    dispatch(socketConnection(session.username));
  }, []);

  // useEffect(() => {
  //   if(Object.keys(socket).length){
  //     socket.emit("addUser", session.username);
  //   }
  // }, [socket, session.username]);

  const handleScroll = useCallback(() => {
    if (
      Math.ceil(window.innerHeight + window.scrollY) >=
      document.documentElement.scrollHeight
    )
      dispatch(updatePage(page + 1 < totalPages ? page + 1 : page));
  }, [dispatch, page, totalPages]);

  useEffect(() => {
    if (page === -1) {
      window.scroll(0, 0);
      dispatch(updatePage(0));
      return;
    }
    dispatch(getPosts(page));
  }, [dispatch, page, first, totalPages]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  console.log(posts.length);

  useEffect(() => {
    const getConversations = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3001/conversation/" + session.username
        );
        setConversations(res.data);
      } catch (err) {}
    };
    getConversations();
  }, [session.username]);

    return (
    <div className={styles.home + ` ${createPost ? styles.noScroll : ""} `}>
      <section className={styles.left}>
        <div className={styles.filters}>
          <h3>My tags</h3>
          <ul className={styles.tags}>
            {session.tags && session.tags.length ? (
              session.tags.map((tag, i) => (
                <li key={i}>
                  <Link className={styles.tag} to="/home">
                    # {tag}
                  </Link>
                </li>
              ))
            ) : (
              <></>
            )}
          </ul>
        </div>
      </section>

      <section className={styles.center}>
        {createPost ? (
          <div
            className={styles.newPost}
            id="close"
            onClick={(e) =>
              e.target.id === "close" ? setCreatePost((old) => false) : ""
            }
          >
            <NewPost />
          </div>
        ) : (
          ""
        )}

        <div className={styles.newPostOpen}>
          <UserCardAdmin
            toRight
            showImage
            user={{ user: session.username, image: session.image }}
          />
          <button
            className={styles.createPost}
            onClick={() => setCreatePost(true)}
          >
            Create Post
          </button>
        </div>

        <ul>
          {posts.length >0? posts.map((post, i) => (
            <li key={i}>
              <PostAdmin post={post} socket={socket} />
            </li>
          )):""}
        </ul>

        {totalPages > page && (
          <div className={styles.cargando}>Cargando...</div>
        )}
      </section>

      <section className={styles.right}>
        <div>
          <h3>Friends.</h3>
          <ul>
            {conversations.map(({ members }) => (
              <li>
                <p>{members.filter((member) => member !== session.username)}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

export default HomeAdmin;


