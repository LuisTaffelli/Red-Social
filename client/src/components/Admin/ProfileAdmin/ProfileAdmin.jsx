import { useEffect, useState } from "react";
import userimg from "../../../images/userCard.svg";
import { useDispatch, useSelector } from "react-redux";
import { removeProfile, getUser } from "../../../Redux/actions/Users";

import PostAdmin from "../../../components/Admin/PostAdmin/PostAdmin";

import { updateUser } from "../../../Redux/actions/Session";
import validate from "../../../utils/validate";
import styles from "./stylesProfile.css";
import Select from "react-select";
import { BiCog } from "react-icons/bi";
import { banUserAdmin } from "../../../Redux/actions/Users";

const selectStyles = {
  control: (styles) => ({ ...styles, width: "100%" }),
};

// cambiar a estado traido de la DB
const options = [
  { value: "js", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "c++", label: "C++" },
  { value: "php", label: "PHP" },
  { value: "java", label: "Java" },
  { value: "c", label: "C" },
  { value: "go", label: "Go" },
  { value: "kotlin", label: "Kotiln" },
  { value: "sql", label: "SQL" },
  { value: "mongodb", label: "MongoDB" },
  { value: "postgresql", label: "PostgreSQL" },
];

export default function ProfileAdmin(props) {
  const dispatch = useDispatch();
  const [editar, setEditar] = useState(false);

  const session = useSelector((state) => state.sessionReducer);
  const profile = useSelector((state) => state.usersReducer.profile);
  const profileAdmin = useSelector((state) => state);

  const myProfile = session.username === profile.username;

  useEffect(() => {
    dispatch(getUser(props.username));
    return () => dispatch(removeProfile());
  }, [dispatch, props.username]);

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

  let git = profile.gitaccount && profile.gitaccount.split("/");
  git = git && git[git.length - 1];

  const handleBanUser = (e) => {
    e.preventDefault();
    dispatch(banUserAdmin(e.target.value));
    alert("They have applied successfully");
  };

  return profile ? (
    <div>
      {profile.strike?.length === 3 ? (
        <div>
          <img
            src="https://instagramers.com/wp-content/uploads/2020/11/Portada-Cuenta-inhabilitada-Instagram.png"
            alt="Not found"
          />
        </div>
      ) : (
        <main className={styles.container}>
          <div className={styles.left}>
            <section>
              <div className={styles.tags}>
                {profile.tags &&
                  profile.tags
                    .filter((tag) => tag)
                    .map((tag, i) => (
                      <span key={i} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
              </div>
              {myProfile && editar ? (
                <button onClick={handleSubmit}>Change</button>
              ) : (
                ""
              )}
              {myProfile ? (
                <button
                  className={styles.edit}
                  onClick={() => setEditar((old) => !old)}
                >
                  <BiCog />
                  Edit
                </button>
              ) : (
                ""
              )}

              <img
                className={styles.image}
                src={profile.image || userimg}
                alt=""
              />
              <button
                value={profile.username}
                name="banUser"
                onClick={(e) => handleBanUser(e)}
              >
                Ban User
              </button>
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

              <p className={styles.email}>{profile.email}</p>

              <a className={styles.github} href={profile.gitaccount}>
                {git}
              </a>

              {myProfile && editar ? (
                <Select
                  onChange={handleSelect}
                  className={styles.select_container}
                  options={options}
                  styles={selectStyles}
                  isMulti
                />
              ) : (
                ""
              )}
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
                    <PostAdmin
                      customClass={styles.post}
                      post={{ ...post, user: profile }}
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
