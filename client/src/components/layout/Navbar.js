import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { logout } from "../../actions/auth";
import { Popover, Button } from 'antd';
import axiosInstance from '../../axiosInstance';
import { SettingOutlined, NotificationOutlined } from '@ant-design/icons'
//the span arround the text is to let just the icon to show in mobile devices
const Navbar = ({ auth: { isAuthenticated, loading }, logout }) => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    callApi()
  }, []);
  const callApi = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user_infor"));
      const res = await axiosInstance().get(`/api/posts/yourpost/${user._id}`);
      const data = res.data.filter(x => !x.isApproval);
      setPosts(data);
    } catch {
      setPosts([]);
    }
  }
  const user = JSON.parse(localStorage.getItem("user_infor")) || {};
  const content = (
    <div style={{ display: 'block' }}>
      <h1>{user.name}</h1>
      <div >
        <div style={{ textAlign: 'center', marginTop: "10px", marginBottom: "10px" }}>
          <Link to='/dashboard'>
            <i className='fas fa-user'></i>{" "}
            <span className='hide-sm'>Your Profile</span>
          </Link>
        </div>
        <div style={{ textAlign: 'center', marginTop: "10px", marginBottom: "10px" }}>
          <Link to='/yourpost'>
            <i className='fas fa-user'></i>{" "}
            <span className='hide-sm'>Your Posts</span>
          </Link>
        </div>
        {user.authentication === "admin" ? <div style={{ textAlign: 'center', marginTop: "10px", marginBottom: "10px" }}>
          <Link to='/managerPost'>
            <NotificationOutlined />
            <span style={{ marginLeft: "9px" }} className='hide-sm'>Approval</span>
            <span className='hide-sm'>{`(${posts.length})`}</span>
          </Link>
        </div> : ""}
        {user.authentication === "admin" ? <div style={{ textAlign: 'center', marginTop: "10px", marginBottom: "10px" }}>
          <Link to='/managerUser'>
            <span style={{ marginLeft: "9px" }} className='hide-sm'>User</span>
          </Link>
        </div> : ""}
        <div style={{ textAlign: 'center', marginTop: "10px", marginBottom: "10px" }}>
          <li>
            <a onClick={logout} href='/login'>
              <i className='fas fa-sing-out-alt'></i>{" "}
              <span className='hide-sm'>Logout</span>
            </a>
          </li>
        </div>
      </div>
    </div>
  );
  const authLinks = (
    <ul>
      <li>
        <Link to='/profiles'>Developers</Link>
      </li>
      <li>
        <Link to='/videocall'>Call Dev Online</Link>
      </li>
      <li>
        <Link to='/posts'>Posts</Link>
      </li>
      <li>
        <Popover placement="bottom" content={content} trigger="click">
          <Button style={{ backgroundColor: "gray" }}>
            Setting
          <SettingOutlined />
          </Button>
        </Popover>
      </li>

    </ul>
  );
  const guestLinks = (
    <ul>
      <li>
        <Link to='/profiles'>Developers</Link>
      </li>
      <li>
        <Link to='/register'>Register</Link>
      </li>
      <li>
        <Link to='/login'>Login</Link>
      </li>
    </ul>
  );

  return (
    <div>
      {" "}
      <nav className='navbar bg-dark'>
        <h1>
          <Link to={localStorage.getItem("token") ? '/posts' : "/"}>
            <i className='fas fa-code'></i> Social Network
          </Link>
        </h1>
        {<>{window.location.pathname.includes("login") || window.location.pathname.includes("register") ? guestLinks : authLinks}</>}
      </nav>
    </div>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired, //ptfr
  auth: PropTypes.object.isRequired, //ptor
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { logout })(Navbar);
