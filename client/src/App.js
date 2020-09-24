import React, { Fragment, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./components/Layout/Navbar";
import Landing from "./components/Layout/Landing";
import "./App.css";
import Register from "./components/Auth/Register";
import Login from "./components/Auth/Login";
import store from "./store";
import { Provider } from "react-redux";
import Alert from "./components/Layout/Alerts";
import { loadUser } from "./actions/auth";
import { setAuthToken } from "./utils/setAuthToken";
import PrivateRoute from "./components/routing/PrivateRoute";
import Dashboard from "./components/Dashboard/Dashboard";
import CreateProfile from "./components/ProfileData/CreateProfile";
import EditProfile from "./components/ProfileData/editProfile";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}
const App = () => {
  useEffect(() => {
    store.dispatch(loadUser());
  }, []);
  return (
    <Provider store={store}>
      <Router>
        <Fragment>
          <Navbar />
          <Route exact path="/" component={Landing} />
          <section className="container">
            <Alert />
            <Switch>
              <PrivateRoute exact path="/dashboard" component={Dashboard} />
              <PrivateRoute
                exact
                path="/create-profile"
                component={CreateProfile}
              />
              <PrivateRoute
                exact
                path="/edit-profile"
                component={EditProfile}
              />
              <Route path="/register" component={Register} />
              <Route path="/login" component={Login} />
            </Switch>
          </section>
        </Fragment>
      </Router>
    </Provider>
  );
};

export default App;
