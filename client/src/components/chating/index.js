import React from "react";
import Conversation from "./component";
import "./style.css";
function ChattingComponent(props) {
  const user = localStorage.getItem("user_infor");
  const userId = JSON.parse(user)._id;
  const userIdSelected = props.match.params.id;
  return (
    <>
      <Conversation newSelectedUser={userIdSelected} userId={userId} />
    </>
  );
}
export default ChattingComponent
