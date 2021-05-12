import React, { Component } from "react";
import ChatSocketServer from "./chatSocket";
import "./style.css";
import io from "socket.io-client";
import axiosInstance from "../../axiosInstance";
import { Comment, Avatar, Form, Button, List, Input } from 'antd';
const { TextArea } = Input;
const CommentList = ({ conversations }) => (
  <List
    dataSource={conversations}
    header={`${conversations.length} ${conversations.length > 1 ? 'replies' : 'reply'}`}
    itemLayout="horizontal"
    renderItem={item => (
      <List.Item>
        <List.Item.Meta
          avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
          title={<a><span><a style={{color:"green"}}>{`${item.author}:`}</a></span><span>{item.message}</span></a>}
        />
      </List.Item>
    )}
  />
);

const Editor = ({ onChange, onSubmit, submitting, value }) => (
  <>
    <Form.Item>
      <TextArea rows={4} onChange={onChange} value={value} />
    </Form.Item>
    <Form.Item>
      <Button htmlType="submit" loading={submitting} onClick={onSubmit} type="primary">
        Send
      </Button>
    </Form.Item>
  </>
);
let socket;
class Conversation extends Component {
  messageContainer = null;
  constructor(props) {
    super(props);
    this.state = {
      messageLoading: true,
      conversations: [],
      selectedUser: null,
      conversations: [],
      submitting: false,
      value: ""
    };
    this.messageContainer = React.createRef();
    socket = io(`http://localhost:5000`);;
  }

  componentDidMount() {
    socket.on('add-message-response', (message) => {
      const user = JSON.parse(localStorage.getItem('user_infor'));
      const { conversations } = this.state;
      if (user._id === message.toUserId || user._id === message.fromUserId) {
        conversations.push(message)
      }
      this.setState({ conversations, value: "" })
    })
    this.getMessages();

  }
  componentDidUpdate(prevProps) {
    if (
      prevProps.newSelectedUser === null ||
      this.props.newSelectedUser.id !== prevProps.newSelectedUser.id
    ) {
      this.getMessages();
    }
  }

  static getDerivedStateFromProps(props, state) {

    if (
      state.selectedUser === null ||
      state.selectedUser.id !== props.newSelectedUser.id
    ) {
      return {
        selectedUser: props.newSelectedUser,
      };
    }
    return null;
  }

  receiveSocketMessages = (socketResponse) => {
    const { selectedUser } = this.state;
    if (
      selectedUser !== null &&
      selectedUser.id === socketResponse.fromUserId
    ) {
      this.setState({
        conversations: [...this.state.conversations, socketResponse],
      });
      this.scrollMessageContainer();
    }
  };
  getMessagesFromApi = (userId, toUserId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const body = JSON.stringify({ from: userId, to: toUserId });
        const res = await axiosInstance().post("api/message", body, config);
        resolve(res.data);
      } catch (error) {
        reject(error);
      }
    });
  };
  getMessages = async () => {
    try {
      const { userId, newSelectedUser } = this.props;
      const messageResponse = await this.getMessagesFromApi(
        userId,
        newSelectedUser
      );
      if (!messageResponse.error) {
        this.setState({
          conversations: messageResponse.messages,
        });
        ChatSocketServer.establishSocketConnection(userId);
        this.scrollMessageContainer();
      } else {
        alert("Unable to fetch messages");
      }
      this.setState({
        messageLoading: false,
      });
    } catch (error) {
      this.setState({
        messageLoading: false,
      });
    }
  };
  sendAndUpdateMessages(message) {
    try {
      ChatSocketServer.sendMessage(message);
      this.scrollMessageContainer();
    } catch (error) {
      alert(`Can't send your message`);
    }
  }

  scrollMessageContainer() {
    if (this.messageContainer.current !== null) {
      try {
        setTimeout(() => {
          this.messageContainer.current.scrollTop = this.messageContainer.current.scrollHeight;
        }, 100);
      } catch (error) {
        console.warn(error);
      }
    }
  }

  handleSubmit = async () => {
    if (!this.state.value) {
      return;
    }
    const message = this.state.value;
    const { userId, newSelectedUser } = this.props;
    if (message === "" || message === undefined || message === null) {
      alert(`Message can't be empty.`);
    } else if (userId === "") {
    } else if (newSelectedUser === undefined) {
      alert(`Select a user to chat.`);
    } else {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const user = JSON.parse(localStorage.getItem("user_infor"));
      const body = JSON.stringify({
        from: userId, to: newSelectedUser, message,
        author: user.name
      });
      const res = await axiosInstance().post("api/message/new", body, config);
      if (res) {
        this.sendAndUpdateMessages({
          fromUserId: userId,
          message: message.trim(),
          toUserId: newSelectedUser,
          author: user.name
        });
      }
    }

  };

  handleChange = e => {
    this.setState({
      value: e.target.value
    });
  };
  render() {
    const { conversations, submitting, value } = this.state;
    return (
      <>
        {conversations.length > 0 && <CommentList conversations={conversations} />}
        <Comment
          avatar={
            <Avatar
              src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"
              alt="Han Solo"
            />
          }
          content={
            <Editor
              onChange={this.handleChange}
              onSubmit={this.handleSubmit}
              submitting={submitting}
              value={value}
            />
          }
        />
      </>
    );
  }
}
export default Conversation;
