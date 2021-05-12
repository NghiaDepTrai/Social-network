import React from "react";
import { Route, Redirect } from "react-router-dom";
//to interact with the auth state in the Auth reducer connect must be imported
/**
 * @description the PrivateRoute component forces the user to another route when not Authenticated
 */
const PrivateRoute = ({ component: Component, ...rest }) => {
  const token = localStorage.getItem("token");
  return (
    <Route
      {...rest}
      render={(props) => (token ? <Component {...props} /> : <Redirect to={{ pathname: "/login" }} />)}
    />
  );
};
export default PrivateRoute;
