import React from "react";
import Register from "../auth/Register";
import LoginComponent from "../auth/Login";
import ForgotPasswordComponent from "../forgot";
import Alert from "../layout/Alert";
import Dashboard from "../dashboard/Dashboard";
import CreateProfile from "../profile-form/CreateProfile";
import EditProfile from "../profile-form/EditProfile";
import AddExperience from "../profile-form/AddExperience";
import AddEducation from "../profile-form/AddEducation";
import Profiles from "../profiles/Profiles";
import Profile from "../profile/Profile";
import Posts from "../posts/Posts";
import ChattingComponent from "../chating/index"
import Post from "../post/Post";
import YourPostComponent from '../yourPost/index'
import ManagerPost from '../managerPost/component'
import ManagerUser from '../managerUser/component'
import NotFound from "../layout/NotFound";
import PrivateRoute from "../routing/PrivateRoute";
import VideoCallComponent from "../video-call/component";
import { Route, Switch, Redirect } from "react-router-dom";
export const Routes = () => {
  return (
    <>
      <section className='container'>
        <Alert />
        <Switch>
          <Route path='/register' component={Register} />
          <Route path='/login' component={LoginComponent} />
          <Route path='/reset' component={ForgotPasswordComponent} />
          <Route path='/reset/:token' component={ForgotPasswordComponent} />
          <Route path='/profile/:id' component={Profile} />
          <Redirect from="/" exact to="/dashboard" />
          <PrivateRoute path='/dashboard' component={Dashboard} />
          <PrivateRoute path='/posts' component={Posts} />
          <PrivateRoute path='/yourpost' component={YourPostComponent} />
          <PrivateRoute path='/managerPost' component={ManagerPost} />
          <PrivateRoute path='/managerUser' component={ManagerUser} />
          <PrivateRoute path='/postsById/:id' component={Post} />
          <PrivateRoute path='/inbox/:id' component={ChattingComponent} />
          <PrivateRoute path='/videocall' component={VideoCallComponent} />
          <PrivateRoute path='/profiles' component={Profiles} />
          <PrivateRoute
            path='/create-profile'
            component={CreateProfile}

          />
          <PrivateRoute path='/edit-profile' component={EditProfile} />
          <PrivateRoute
            path='/add-experience'
            component={AddExperience}

          />
          <PrivateRoute path='/add-education' component={AddEducation} />
          <Route component={NotFound} />
        </Switch>
      </section>
    </>
  );
};

export default Routes;
