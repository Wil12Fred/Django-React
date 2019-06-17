import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import { Router, Route, Switch, Redirect } from "react-router-dom";
//import createHistory from "history/createBrowserHistory";
import {createBrowserHistory} from "history";
//import {createHistory} from "history";

import { store } from "./store";
import { PrivateRoute, AuthenticatedRoute } from "./customRoutes/ProtectedRoutes";

import Navigation from "./containers/NavigationContainer";
import HomePage from "./containers/HomePageContainer";
import Login from "./containers/auth/LoginContainer";
import Register from "./containers/auth/RegisterContainer";
import ChangePassword from "./containers/auth/ChangePasswordContainer";
import {Publisher, Book, Author} from "./components/App";
import FormAuthor from "./containers/RegisterAuthor";
//import Products from "./components/EditableTable";

export const history = createBrowserHistory();

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <div>
        <Navigation />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <PrivateRoute exact path="/publisher" component={Publisher} />
          <PrivateRoute exact path="/author" component={Author} />
          <PrivateRoute exact path="/author/register" component={FormAuthor} />
          <PrivateRoute exact path="/book" component={Book} />
          <AuthenticatedRoute exact path="/login" component={Login} />
          <AuthenticatedRoute exact path="/register" component={Register} />
          <Route exact path="/signout" render={() => <Redirect to="/" />} />
          <Route exact path="/changepassword" component={ChangePassword} />
        </Switch>
      </div>
    </Router>
  </Provider>,
  document.getElementById("root")
);

//ReactDOM.render( < Products / > , document.getElementById('container'));
