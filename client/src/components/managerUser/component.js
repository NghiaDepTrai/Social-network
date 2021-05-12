import React, { useEffect, useState } from "react";
import axiosInstance from '../../axiosInstance';
import { Button, Menu, Dropdown } from 'antd';
import { DashOutlined } from '@ant-design/icons';
import _ from 'lodash';
import { Link } from "react-router-dom";
function ManagerUser() {
  const user_infor = JSON.parse(localStorage.getItem('user_infor'));
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisibled] = useState(true);
  const [postSelected, setPostSelected] = useState({});
  useEffect(() => {
    callApi()
  }, []);
  const callApi = async () => {
    try {
      const users = await axiosInstance().get(`/api/profile`);
      setLoading(false);
      setUsers(users.data)
    } catch {
      setUsers([]);
      setLoading(false)
    }
  }
  const deleteUser = async () => {
    try {
      setLoading(true)
      const id = postSelected._id;
      const res = await axiosInstance().delete(`/api/profile/`, { user: { id: id } });
      if (res) {
        const data = users.filter(x => x._id !== id);
        setUsers(data);
        setLoading(false)
      }
    } catch {
      setLoading(false)
    }
  }
  const menu = (
    <Menu>
      <Menu.Item onClick={() => deleteUser()}>
        <a target="_blank" rel="noopener noreferrer" >
          Delete
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
        <h1 className='large text-primary'>Manager User</h1>
        <div>
          <p className='lead'>
            <i className='fas fa-user'></i>Welcome to the community
          </p>
        </div>
        <div className='posts'>
          {users.map((user) => {
            return (
              <>
                <div className='profile bg-light'>
                  <img src={user.user.avatar} alt='avatar' className='round-img' />
                  <div>
                    <h2>{user.user.name}</h2>
                    <p>
                      {user.company && <span> at {user.company} </span>}
                    </p>
                    <p className='my-1'>{user.location && <span> {user.location} </span>}</p>
                    <Link to={`profile/${user.user._id}`} className='btn btn-primary'>
                      View Profile
          </Link>

                  </div>
                  <ul>
                    {user.skills.slice(0, 4).map((skill, index) => (
                      <li key={index} className='text-primary'>
                        <i className='fas fa-check' /> {skill}
                      </li>
                    ))}
                  </ul>
                  {user.user._id !== user_infor._id ? <div className="icon-more">
                    <Dropdown visible={visible && user === postSelected} onVisibleChange={(visible) => { setVisibled(visible) }} trigger={"click"} overlay={menu} placement="bottomRight">
                      <Button onClick={(el) => {
                        el.stopPropagation();
                        setPostSelected(user);
                      }}>
                        <DashOutlined />
                      </Button>
                    </Dropdown>
                  </div> : ""}

                </div>
              </>
            );
          })}

        </div>
      </>
    </>
  );
};
export default (ManagerUser);