import React, { useEffect, useState } from "react";
import Moment from "react-moment";
import axiosInstance from '../../axiosInstance';
import { Button, Menu, Dropdown } from 'antd';
import { DashOutlined } from '@ant-design/icons';
import "./style.css";
import _ from 'lodash';
function ManagerPost() {
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [type, setType] = useState("default");
  const [loading, setLoading] = useState(true);
  const [visible, setVisibled] = useState(true);
  const [postSelected, setPostSelected] = useState({});
  useEffect(() => {
    callApi()
  }, []);
  const callApi = async () => {
    try {
      const res = await axiosInstance().get(`/api/posts`);
      const users = await axiosInstance().get(`/api/users`);
      const sortedArray = _.orderBy(res.data,
        function (object) {
          return new Date(object.date);
        }, "desc")
      setLoading(false);
      setPosts(sortedArray);
      setUsers(users.data)
    } catch {
      setPosts([]);
      setUsers([]);
      setLoading(false)
    }
  }
  const deletePost = async () => {
    try {
      setLoading(true)
      const id = postSelected._id;
      const res = await axiosInstance().delete(`/api/posts/${id}`);
      if (res) {
        const data = posts.filter(x => x._id !== id);
        const sortedArray = _.orderBy(data,
          function (object) {
            return new Date(object.date);
          }, "desc")
        setPosts(sortedArray);
        setLoading(false)
      }
    } catch {
      setLoading(false)
    }
  }
  const approve = async () => {
    try {
      setLoading(true)
      const id = postSelected._id;
      const res = await axiosInstance().put(`/api/posts/${id}`);
      if (res) {
        let data = posts;
        const index = data.findIndex(x => x._id === id);
        data[index].isApproval = true;
        const sortedArray = _.orderBy(data,
          function (object) {
            return new Date(object.date);
          }, "desc")
        setPosts(sortedArray);
        setLoading(false)
      }
    } catch {
      setLoading(false)
    }
  }
  const menu = (
    <Menu>
      <Menu.Item onClick={() => deletePost()}>

        <a target="_blank" rel="noopener noreferrer" >
          Delete
          </a>
      </Menu.Item>
      {!postSelected.isApproval ? <Menu.Item onClick={() => approve()}>
        <a target="_blank" rel="noopener noreferrer" >
          Approve
          </a>
      </Menu.Item> : ""}

    </Menu>
  );
  return (
    <>
      { loading ? (
        <div className="spinner-border loading-full-screen" role="status">
          <span className="block-loading">
            <>
              <i className="fa fa-spinner fa-spin"></i>
         Loading...
       </>
          </span>
        </div>
      ) : ""}

      <>
        <h1 className='large text-primary'>Posts To Approve</h1>
        <div>
          <p className='lead'>
            <i className='fas fa-user'></i>Welcome to the community
          </p>
          <Button onClick={() => setType("default")} type={type === "approve" ? "default" : "primary"}>
            All Posts
          </Button  >
          <Button style={{ marginLeft: "10px" }} onClick={() => setType("approve")} type={type === "approve" ? "primary" : "default"}>Approve Posts</Button>
        </div>
        <div className='posts'>
          {posts.length ? posts.map((post) => {
            if (!post.isApproval && type === "approve") {
              const you = users.find(x => x._id.toString() === post.user.toString())
              return (
                <>
                  <div className='post bg-white p-1 my-1'>
                    <div>
                      <img className='round-img' src={you && you.avatar} alt='' />
                      <h4>{you && you.name}</h4>
                    </div>
                    <div>
                      <p className='my-1'>{post.text}</p>
                      <p className='post-date'>
                        Posted on <Moment format='YYYY/MM/DD'>{post.date}</Moment>
                      </p>
                      <>
                        <button
                          type='button'
                          className='btn btn-light'
                        >
                        </button>
                        <button
                          type='button'
                          className='btn btn-light'
                        >
                        </button>
                      </>
                    </div>
                    <div className="icon-more">
                      <Dropdown visible={visible && post === postSelected} onVisibleChange={(visible) => { setVisibled(visible) }} trigger={"click"} overlay={menu} placement="bottomRight">
                        <Button onClick={(el) => {
                          el.stopPropagation();
                          setPostSelected(post);
                        }}>
                          <DashOutlined />
                        </Button>
                      </Dropdown>
                    </div>
                  </div>
                </>
              );
            } else if (type === "default") {
              const you = users.find(x => x._id.toString() === post.user.toString())
              return (
                <>
                  <div className='post bg-white p-1 my-1'>
                    <div>
                      <img className='round-img' src={you && you.avatar} alt='' />
                      <h4>{you && you.name}</h4>
                    </div>
                    <div>
                      <p className='my-1'>{post.text}</p>
                      <p className='post-date'>
                        Posted on <Moment format='YYYY/MM/DD'>{post.date}</Moment>
                      </p>
                      <>
                        <button
                          type='button'
                          className='btn btn-light'
                        >
                        </button>
                        <button
                          type='button'
                          className='btn btn-light'
                        >
                        </button>
                      </>
                    </div>
                    <div className="icon-more">
                      <Dropdown visible={visible && post === postSelected} onVisibleChange={(visible) => { setVisibled(visible) }} trigger={"click"} overlay={menu} placement="bottomRight">
                        <Button onClick={(el) => {
                          el.stopPropagation();
                          setPostSelected(post);
                        }}>
                          <DashOutlined />
                        </Button>
                      </Dropdown>
                    </div>
                  </div>
                </>
              );
            }
          })
         : ""}
        </div>
      </>
    </>
  );
};
export default (ManagerPost);
