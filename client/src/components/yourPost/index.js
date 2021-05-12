import React, { useEffect, useForm, useState } from "react";
import PostItem from "./PostItem";
import axiosInstance from '../../axiosInstance';
import { Button, Menu, Dropdown, Modal, Input, Form } from 'antd';
import { DashOutlined } from '@ant-design/icons';
import "./style.css"
import _ from 'lodash'
const { TextArea } = Input;
function YourPostComponent() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisibled] = useState(true);
  const [postSelected, setPostSelected] = useState({});
  const [form] = Form.useForm()
  const [ValueEdit, setValueEdit] = useState("");
  const [visibleModal, setVisibleModal] = useState(false);
  useEffect(() => {
    callApi()
  }, []);
  const callApi = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user_infor"));
      const res = await axiosInstance().get(`/api/posts/yourpost/${user._id}`);
      const sortedArray = _.orderBy(res.data,
        function (object) {
          return new Date(object.date);
        }, "desc")
      setPosts(sortedArray);
      setLoading(false);
    } catch {
      setPosts([]);
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
  const EditPost = async (el) => {
    try {
      setLoading(true)
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const formData = { id: postSelected._id, text: ValueEdit }
      const res = await axiosInstance().put(`/api/posts`, formData, config);
      if (res) {
        const index = posts.findIndex(x => x._id === postSelected._id);
        posts[index].text = ValueEdit
        setPosts(posts);
        setLoading(false)
        setVisibleModal(false)
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
      <Menu.Item onClick={() => {
        setValueEdit(postSelected.text);
        setVisibleModal(true)
      }}>
        <a target="_blank" rel="noopener noreferrer" >
          Edit
          </a>
      </Menu.Item>
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
        <h1 className='large text-primary'>Posts</h1>
        <p className='lead'>
          <i className='fas fa-user'></i>Welcome to the community
          </p>
        <Modal footer={null} onCancel={() => {
          setVisibleModal(false)
          setValueEdit("")
        }} visible={visibleModal}>
          <div>
            {loading ? (
              <div className="spinner-border loading-full-screen" role="status">
                <span className="block-loading">
                  <>
                    <i className="fa fa-spinner fa-spin"></i>
         Loading...
       </>
                </span>
              </div>
            ) : ""}
            <h2>{`Post by ${postSelected?.name}`}</h2>
            <TextArea value={ValueEdit} onChange={(el) => setValueEdit(el.target.value)} rows={4} />
            <div style={{ marginTop: "15px" }}>
              <Button disabled={ValueEdit ? false : true} onClick={(el) => EditPost(el)} type="primary" style={{ marginRight: "10px" }}>Save</Button>
              <Button onClick={() => setVisibleModal(false)} type="primary" danger >Cancel</Button>
            </div>
          </div>
        </Modal>
        <div className='posts'>
          {posts.map((post,index) => {
            if (post.isApproval) {
              return (
                <div style={{ display: 'grid' }} key={index}>
                  <PostItem key={Math.random()}  post={post} />
                  <div className="icon-more-2">
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
              )
            }
          }
          )}
        </div>
      </>
    </>
  );
};
export default (YourPostComponent);
