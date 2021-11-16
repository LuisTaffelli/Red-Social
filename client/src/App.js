import { Redirect, Route, Switch, useLocation } from "react-router-dom";

import LandingPage from "./Pages/LandingPage/LandingPage";
import Home from "./Pages/Home/Home";
import Profile from "./Pages/Profile/Profile.jsx";

import Signup from "./components/Signup/Signup";
import Login from "./components/Login/Login";
import NavBar from "./components/NavBar/NavBar.js";

import Messenger from "./Pages/Messenger/Messenger";
import Support from "./components/Support/Support";
import Settings from "./Pages/Settings/Settings";

//Admin
import AdminLogin from "./components/Admin/AdminLogin";
import AdminSupport from "./components/Admin/AdminSupport";
import HomeAdmin from "./components/Admin/HomeAdmin/HomeAdmin";
import ProfileAdmin from "./components/Admin/ProfileAdmin/ProfileAdmin";

import NewRegister from "./components/NewRegister/NewRegister.jsx";

import PrivateRoute from "./components/TypeRoutes/PrivateRoute";

import ForgetPassword from "./components/ForgetPassword/ForgetPassword.jsx";
import ResetPassword from "./components/ResetPassword/ResetPassword.jsx";

// Variables CSS
import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { removeError } from "./Redux/actions/Errors";
import { Link } from "react-router-dom";
import { BiMessageAltDetail } from "react-icons/bi";

// chat v.2
import Challenge from "./Pages/Challenge/Challenge";
import ChallengeComment from "./Pages/ChallengeComment/ChallengeComment";
import { changeTheme } from "./Redux/actions/Theme";

function App() {
  const dispatch = useDispatch();

  const isLanding = useLocation().pathname === "/";

  const errors = useSelector((state) => state.errorsReducer);
  const session = useSelector((state) => !!state.sessionReducer.username);
  const isDark = useSelector((state) => state.themeReducer.theme);

  const handleDelete = (id) => dispatch(removeError(id));

  return (
    <div className={`App ${isDark ? "dark" : ""}`}>
      {/*<button
        className="top"
        onClick={() => {
          dispatch(changeTheme(!isDark));
        }}
      >
        Change Theme
      </button>*/}
      {errors && errors.length ? (
        <ul className="errors">
          {errors.map((error) => (
            <li className="error" onClick={() => handleDelete(error.id)}>
              {error.message}
            </li>
          ))}
        </ul>
      ) : (
        ""
      )}

      {!isLanding && session && (
        <Link className="message" to="/messenger">
          <BiMessageAltDetail
            style={{ margin: "0", width: "1.5em", height: "1.5em" }}
          />
          <span>Messages</span>
        </Link>
      )}

      <NavBar />

      <Switch>
        <Route exact path="/" component={LandingPage} />
        <Route path="/home" component={Home} />
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route path="/loginAdmin" component={AdminLogin} />
        <Route path="/supportAdmin" component={AdminSupport} />
        <Route exact path="/challenge" component={Challenge} />
        <Route path="/homeAdmin" component={HomeAdmin} />
        <Route path="/challenge/comment" component={ChallengeComment} />
        <Route
          path="/profileAdmin/:username"
          render={({
            match: {
              params: { username },
            },
          }) => <ProfileAdmin username={username} />}
        />
        <Route path="/n/signup" component={NewRegister} />

        <Route
          exact
          path="/accounts/password/reset/"
          component={ResetPassword}
        />
        <Route exact path="/auth/reset-password" component={ForgetPassword} />

        {/* Profile */}
        <Route
          path="/profile/:username"
          render={({
            match: {
              params: { username },
            },
          }) => <Profile username={username} />}
        />

        <PrivateRoute path="/settings" component={Settings} />
        <PrivateRoute exact path="/messenger" component={Messenger} />
        <PrivateRoute path="/support" component={Support} />
        <PrivateRoute path="/supportAdmin" component={AdminSupport} />
        <PrivateRoute path="/challenge" component={Challenge} />
        <PrivateRoute path="/homeAdmin" component={HomeAdmin} />
        <PrivateRoute
          path="/profileAdmin/:username"
          render={({ match: { params: username } }) => (
            <ProfileAdmin username={username} />
          )}
        />

        <Route path="/" render={() => <Redirect to="/home" />} />
      </Switch>
    </div>
  );
}

export default App;
