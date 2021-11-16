import { Redirect, Route } from "react-router";
import { isLogin } from "../../utils/session";

function PrivateRoute({ component: Component, restricted, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        isLogin() ? <Component {...props} /> : <Redirect to="/login" />
      }
    />
  );
}

export default PrivateRoute;
