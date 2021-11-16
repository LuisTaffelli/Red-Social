import { useState, useEffect } from "react";
import { Link, NavLink, useHistory, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logOut } from "../../Redux/actions/Session.js";
import styles from "./NavBar.module.css";
import { logOutAdmin } from "../../Redux/actions/Admin.js";

import { BiBell } from "react-icons/bi";
import Notification from "../Notification/Notification";
import SearchBar from "../SearchBar/SearchBar";

import Menu from "./Menu/Menu.jsx";
import { BiHomeAlt } from "react-icons/bi";

import { CgProfile } from "react-icons/cg";
import { FiLogOut } from "react-icons/fi";

import logo from "../../images/deco.svg";
import UserCard from "../UserCard/UserCard";

export default function Navbar(props) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  const history = useHistory();
  const isLanding = useLocation().pathname === "/";

  const user = useSelector((store) => store.sessionReducer);
  const admin = useSelector((store) => store.adminReducer);
  const socket = useSelector((state) => state.usersReducer.socket);

  const dispatch = useDispatch();

  useEffect(() => {
    if (Object.keys(socket).length) {
      socket.on("getNotification", (data) => {
        if (data.type === 1) {
          setNotifications((prev) => {
            if (
              !prev.find(
                (notif) =>
                  notif.senderName === data.senderName && notif.id === data.id
              )
            ) {
              return [data, ...prev];
            } else {
              return [...prev];
            }
          });
        } else {
          setNotifications((prev) => [data, ...prev]);
        }
      });
    }
  }, [socket]);

  const [showMenu, setShowMenu] = useState(false);
  const handleMenu = () => setShowMenu(!showMenu);

  const logOutAdminR = () => {
    dispatch(logOutAdmin());
    history.push("/home");
  };

  const logOutR = () => {
    dispatch(logOut());
    history.push("/home");
  };

  const handleRead = () => {
    setNotifications([]);
    setOpen(false);
  };

  const handleClick = (e) => {
    setOpen(!open);

    if (!open) {
      // setNotifications([]);
    }
  };

  return (
    <header className={styles.navbar + ` ${isLanding ? styles.landing : ""}`}>
      <nav className={styles.nav}>
        <div className={styles.left}>
          <Link className={styles.brand} to="/">
            <img src={logo} width="20px" alt="" />
            Code<span>Net</span>
          </Link>
          <SearchBar />
        </div>

        <ul className={styles.menu}>
          <li>
            <NavLink
              className={styles.nav__link}
              activeClassName={styles.active}
              to="/home"
            >
              <BiHomeAlt className={styles.icon} />
            </NavLink>
          </li>

          {!isLanding && (user.username || admin.admin === true) ? (
            <li>
              <button onClick={handleClick} className={styles.nav__link}>
                <BiBell className={styles.icon} />
                {notifications.length > 0 && (
                  <div className={styles.counter}>{notifications.length}</div>
                )}
                {open && (
                  <div className={styles.notifications}>
                    <button className={styles.markRead} onClick={handleRead}>
                      Mark as read
                    </button>
                    {notifications.map((notification, i) => (
                      <li key={i}>
                        <Notification notification={notification} />
                      </li>
                    ))}
                  </div>
                )}
              </button>
            </li>
          ) : (
            <></>
          )}

          <Menu />
        </ul>

        <div className={styles.right}>
          {/* Mostrar en cualquier pagina menos Landing page */}

          {!isLanding &&
            (user.username || admin.admin === true ? (
              <div className={styles.profile__container}>
                <button onClick={handleMenu} className={styles.profile}>
                  <UserCard
                    toLeft
                    showName
                    showImage
                    user={{ username: user.username, image: user.image }}
                  />
                </button>
                <div
                  className={
                    `${showMenu ? styles.show : styles.hide} ` +
                    styles.profile__menu
                  }
                >
                  <li className={styles.profile__menu__res}>
                    <Menu column />
                  </li>

                  <Link
                    className={`${styles.profile__link}`}
                    to={`/profile/${user.username}`}
                  >
                    Profile <CgProfile />
                  </Link>

                  {admin.admin === true ? (
                    <button
                      className={`${styles.profile__link} ${styles.logout}`}
                      onClick={() => logOutAdminR()}
                    >
                      Log Out
                      <FiLogOut />
                    </button>
                  ) : (
                    <button
                      className={`${styles.profile__link} ${styles.logout}`}
                      onClick={() => logOutR()}
                    >
                      Log Out
                      <FiLogOut />
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <NavLink
                className={styles.signup}
                activeClassName={styles.active}
                to="/login"
              >
                Log In
              </NavLink>
            ))}
        </div>
      </nav>
    </header>
  );
}
