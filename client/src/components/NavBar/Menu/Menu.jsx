import { BiSupport } from "react-icons/bi";
import { RiMoneyDollarCircleLine } from "react-icons/ri";

import { NavLink, useLocation } from "react-router-dom";

import styles from "./Menu.module.css";

function Menu({ column }) {
  const isLanding = useLocation().pathname === "/";

  return (
    !isLanding && (
      <ul className={`${styles.menu} ${column ? styles.column : ""}`}>
        <li>
          <NavLink
            className={styles.menu__link}
            activeClassName={styles.active}
            to="/support"
          >
            {column ? "Support" : <></>}
            <BiSupport className={styles.icon} />
          </NavLink>
        </li>
        <li>
          <a
            className={styles.menu__link}
            href="https://commerce.coinbase.com/checkout/e3e478da-798c-44e4-8147-aab0b7832214"
            target="_blank"
            rel="noreferrer"
          >
            {column ? "Donate" : <></>}
            <RiMoneyDollarCircleLine
              className={styles.icon}
              style={{ color: "#ff0" }}
            />
          </a>
          <script src="https://commerce.coinbase.com/v1/checkout.js?version=201807"></script>
        </li>
      </ul>
    )
  );
}

export default Menu;
