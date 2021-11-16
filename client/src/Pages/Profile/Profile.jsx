import { useEffect, useState } from "react";
import userimg from "../../images/userCard.svg";
import { useDispatch, useSelector } from "react-redux";
import { removeProfile } from "../../Redux/actions/Users";
import { getTags, loadTags } from "../../Redux/actions/Post";
import Post from "../../components/Post/Post";
import Follow, {FollowBtn} from "../Follow/Follow.jsx"
import { getUser, socketConnection } from "../../Redux/actions/Users";
import { conversation, updateUser } from "../../Redux/actions/Session";
import validate from "../../utils/validate";
import styles from "./Profile.module.css";
import Select from "react-select";
import { BsFillPencilFill } from "react-icons/bs";
import Tags from "../../components/Tags/Tags";
import { Link } from "react-router-dom";

const selectStyles = {
  control: (styles) => ({ ...styles, width: "100%" }),
};

// cambiar a estado traido de la DB

export default function Profile(props) {
  const dispatch = useDispatch();
  const [editar, setEditar] = useState(false);

  const session = useSelector((state) => state.sessionReducer);
  const profile = useSelector((state) => state.usersReducer.profile);

  const allTags = useSelector((state) => state.postsReducer.tags);
  const socket = useSelector((state) => state.usersReducer.socket);
  const myProfile = session.username === profile.username;
  useEffect(() => {
    dispatch(getUser(props.username));
    return () => dispatch(removeProfile());
  }, [dispatch, props.username]);
  console.log(allTags)
  useEffect(() => {
    if (!Object.keys(socket).length) {
      dispatch(socketConnection(session.username));
    }
  }, [dispatch, socket, session.username]);

  useEffect(async () => {
    if (allTags.length === 0) {
      await dispatch(loadTags());
      dispatch(getTags())
    }
  }, [allTags]);

  const [inputs, setInputs] = useState({
    name: session.name || "",
    lastname: session.lastname || "",
    about: session.about || "",
    tags: session.tags || [],
  });

  const [errors, setErrors] = useState({
    name: "",
    lastname: "",
  });

  const handleChange = ({ target: { name, value } }) => {
    setInputs((old) => ({ ...old, [name]: value }));
    setErrors((old) => ({ ...old, [name]: validate(name, value) }));
  };

  const handleSelect = (e) => {
    setInputs((old) => ({ ...old, tags: e.map((option) => option.value) }));
  };

  const handleSubmit = () => {
    const errs = validate(inputs);
    if (Object.values(errs).filter((e) => e).length) return setErrors(errs);

    dispatch(updateUser(profile.username, inputs));
    setEditar(false);
  };

  const sendMessage = () => {
    if (session.username && profile.username !== session.username) {
      dispatch(conversation(session.username, profile.username));
    }
  };
  console.log(profile.strike)
  let git = profile.gitaccount && profile.gitaccount.split("/");
  git = git && git[git.length - 1];
  return profile ? (
    <div>
      {profile.strike?.length === 3 ? (
        <div>
          <img
            src="https://instagramers.com/wp-content/uploads/2020/11/Portada-Cuenta-inhabilitada-Instagram.png"
            alt=""
          />
        </div>
      ) : (
        <main className={styles.container}>
          <div className={styles.left}>
            <section>
              <div className={styles.tags}>
                {session.tags ? <Tags tags={session.tags} mode={editar} handleSelect={handleSelect} editTags={inputs.tags}/> : ""}
              </div>
              {myProfile && editar ? (
                <button onClick={handleSubmit}>Change</button>
              ) : (
                ""
              )}
              {myProfile ? (
                <Link to="/settings" className={styles.edit}>
                  <BsFillPencilFill style={{ color: "#C94F4F" }} />
                  Edit
                </Link>
              ) : (
                ""
              )}

              <img
                className={styles.image}
                src={profile.image || userimg}
                alt=""
              />
              {profile.following && !myProfile?
                <FollowBtn props={{user:session.username,follow:profile.username, info:profile.following,socket:socket}} />:
                <></>
              }

              {myProfile && editar ? (
                <form>
                  <label>
                    <div className="input-group">
                      <input
                        name="name"
                        onChange={handleChange}
                        value={inputs.name}
                        placeholder={session.name}
                      />
                    </div>
                  </label>
                  <span>{errors.name}</span>

                  <label>
                    <div className="input-group">
                      <input
                        name="lastname"
                        onChange={handleChange}
                        value={inputs.lastname}
                        placeholder={session.lasnName}
                      />
                    </div>
                  </label>
                  <span>{errors.lastname}</span>
                </form>
              ) : (
                <p className={styles.name}>
                  {profile.name} {profile.lastname}
                </p>
              )}

              <p className={styles.email}>{profile.email} </p>
              {socket !== undefined?
              <Follow  props={{profile:profile.username,follow:profile.username,followers:profile.followers,following:profile.following,socket:socket}} />:
              <></>
              }

              <a className={styles.github} href={profile.gitaccount}>
                {git}
              </a>

              <button onClick={sendMessage}>Send Message</button>
            </section>
            <section>
              <h3>About</h3>
              {myProfile && editar ? (
                <label>
                  <div className="input-group">
                    <textarea
                      name="about"
                      onChange={handleChange}
                      value={inputs.about}
                      placeholder={session.about}
                    ></textarea>
                  </div>
                </label>
              ) : (
                <p>{profile.about}</p>
              )}
            </section>
            <section className={styles.posts}>
              {profile.posts
                ? profile.posts.map((post) => (
                    <Post
                      customClass={styles.post}
                      post={{ ...post, user: profile}}
                    />
                  ))
                : ""}
            </section>
          </div>
          <div className={styles.right}>
            <section>
              <h3>Recomendaciones?</h3>
            </section>
          </div>
        </main>
      )}
    </div>
  ) : (
    ""
  );
}
