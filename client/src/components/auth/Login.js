import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import axiosInstance from '../../axiosInstance';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Modal, Input } from 'antd';
import { FacebookOutlined } from '@ant-design/icons';

export default function LoginComponent() {
  const FB = window.FB;
  const history = useHistory();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    isShowModal: false,
    name: ""
  });
  const { email, password } = formData;
  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: '1034138297118080',
        cookie: true,
        xfbml: true,
        version: "v10.0"
      });
    };

    // Load the SDK asynchronously
    (function (d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = '//connect.facebook.net/en_US/sdk.js';
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  }, [])
  function testAPI() {
    window.FB.api('/me',
      'GET',
      { "fields": "id,name,email,picture" }, function (res) {
        if (res.id) {
          const account = {
            email: res.email, name: res.name, facebookID: res.id
          }
          submitByFacebook(account)
        }
      });
  }

  function statusChangeCallback(response) {
    if (response.status === 'connected') {
      testAPI(response);
    }
  }
  function checkLoginState() {
    window.FB.getLoginStatus(function (response) {
      statusChangeCallback(response);
    });
  }
  function handleClick(e) {
    e.preventDefault();
    window.FB.login(
      function (resp) {
        console.log(resp);
        checkLoginState()
      }.bind(this), { scope: 'email,user_location,public_profile' });
  }
  const handleSubmit = async (e) => {
    if (e) {
      e.preventDefault();
    }
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify({ email, password });
      const res = await axiosInstance().post("api/auth", body, config);
      if (res) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user_infor", JSON.stringify(res.data.user));
        history.push("/dashboard")
      }
    } catch {
      toast.dark('🦄 Something Wrong!', {
        position: "bottom-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };
  const submitByFacebook = async ({ email, name, facebookID }) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const body = JSON.stringify({ email, name, facebookID });
      const res = await axiosInstance().post("/api/users/facebook", body, config);
      if (res) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user_infor", JSON.stringify(res.data.user));
        history.push("/dashboard")
      }
    } catch {
    }
  }
  const handleForgotPassword = async () => {
    history.push("/reset")

  }
  return (
    <>
      <h1 className='large text-primary'>Sign In</h1>
      <p className='lead'>
        <i className='fas fa-user'></i> Sign Into Your Account
      </p>
      <form className='form' onSubmit={(e) => handleSubmit(e)}>
        <div className='form-group'>
          <input
            type='email'
            placeholder='Email Address'
            value={email}
            onChange={(e) => handleInput(e)}
            name='email'
          />
        </div>
        <div className='form-group'>
          <input
            type='password'
            placeholder='Password'
            name='password'
            minLength='6'
            value={password}
            onChange={(e) => handleInput(e)}
          />
        </div>

        <input type='submit' className='btn btn-primary' value='Login' />
        <Button onClick={handleClick} type="primary" shape="round" icon={<FacebookOutlined />} size={24}>
          Login as Facebook
        </Button>
        <Button onClick={handleForgotPassword} type="primary" shape="round" size={24}>
          Forgot Password
        </Button>
      </form>

      <p className='my-1'>
        Don't have an account? <Link to='/register'>Sign Up</Link>
      </p>
      <ToastContainer />
    </>
  );
};
