import { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { socketConnection } from "../../Redux/actions/Users";
import { getPosts, updatePage, getTags, loadTags } from "../../Redux/actions/Post";
import { Link } from "react-router-dom";

import axios from "axios";

import Post from "../../components/Post/Post";
import NewPost from "../../components/NewPost/NewPost";
import UserCard from "../../components/UserCard/UserCard";
import Loader from "../../components/Loader/Loader";

import { BiChevronUp } from "react-icons/bi";

import styles from "./Home.module.css";

function Home(props) {
  const posts = useSelector((state) => state.postsReducer.posts);
  const allTags = useSelector((state) => state.postsReducer.tags);
  const session = useSelector((state) => state.sessionReducer);

  const socket = useSelector((state) => state.usersReducer.socket);

  const [page, totalPages] = useSelector(
    ({ postsReducer: { page, totalPages } }) => [page, totalPages]
  );
  const dispatch = useDispatch();
  const [orden, setOrden] = useState("cronologico");
  const [createPost, setCreatePost] = useState(false);
  const [newPosts, setNewPosts] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [first, setFirst] = useState(true);
  const [tags, setTags] = useState(session.tags);
  const [tagsOptions, setTagsOptions] = useState([]); //El select no funciona sin un array de objetos con value y label
  const options = [
    { value: "cronologico", label: "Cronologico" },
    { value: "userLikes", label: "Likes" },
    { value: "comments", label: "Comentarios" },
    { value: "combinados", label: "Inicial" },
  ];
  useEffect(() => {
    dispatch(socketConnection(session.username));
  }, [dispatch, session.username]);
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
    dispatch(getPosts(page, tags, orden));
  }, [dispatch, page, first, totalPages, orden]);

  useEffect(async () => {
    if (allTags.length === 0) {
      await dispatch(loadTags());
      await dispatch(getTags())
      setFirst(false);
    }
    setTagsOptions(
      allTags.map((tag) => {
        return { value: tag.label, label: tag.label };
      })
    );
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  /*
  const handleSelect = (e) => {
    setOrden(e.value);
  };
  <li>
    <Select onChange={handleSelect} options={options} />
  </li>

  const handleSelect2 = (e) => {
    setTags(e.map((option) => option.value));
  };
  <li>
    <Select onChange={handleSelect2} options={tagsOptions} isMulti />
  </li>
  */

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

  useEffect(() => {
    let newPosts = setTimeout(() => setNewPosts(true), 60000);
    return () => clearTimeout(newPosts);
  });

  const handleCharge = (e) => {
    window.scrollTo(0, 0);
    dispatch(updatePage(0));
    dispatch(getPosts(page, tags, orden));
    setNewPosts(false);
  };

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
        {newPosts && (
          <button className={styles.newPosts} onClick={handleCharge}>
            Check new posts <BiChevronUp className={styles.icon} />
          </button>
        )}
        {createPost ? (
          <div
            className={styles.newPost}
            id="close"
            onClick={(e) =>
              e.target.id === "close" ? setCreatePost((old) => false) : ""
            }
          >
            <NewPost orden={orden} tags={tags}/>
          </div>
        ) : (
          ""
        )}

        <div className={styles.newPostOpen}>
          <UserCard
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
          {posts ? posts.map((post, i) => (
            <li key={i}>
              <Post post={post} socket={socket} />
            </li>
          )) : "No hay ningun post"}
        </ul>

        {page < totalPages - 1 && <Loader />}
      </section>

      <section className={styles.right}>
        {conversations?.length ? (
          <div>
            <h3>Friends</h3>
            <ul>
              {conversations.map(({ members }, i) => (
                <li key={i}>
                  <p>
                    {members.filter((member) => member !== session.username)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          ""
        )}
      </section>
    </div>
  );
}

export default Home;
