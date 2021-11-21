import React, { useState } from 'react'
import { useSelector, useDispatch } from "react-redux"
import "../styles/chats.css";
import { addMessage } from '../redux/chatSlice';
import { format } from "timeago.js";

const Conversation = () => {


    const [textMessage, setTextMessage] = useState("")

    const dispatch = useDispatch()
    const user = useSelector((state) => state.user);
    const chat = useSelector((state) => state.chat);
    const handleChange = (e) => {
        setTextMessage(e.target.value )
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addMessage({ "textMessage": textMessage, "conversation":chat.currentConversation._id  }));
        setTextMessage("")
    }

    return (
        <>
            <div className="tab-content">
                {chat.currentConversation ?
                    <>
                        <div className="tab-pane message-body active">
                            <div class="message-top">
                                {chat.currentConversation.members[0]._id === user.userInfo._id ?
                                    <h4 className="ml-5 mt-4 font-weight-bold">{chat.currentConversation.members[1].firstName} {chat.currentConversation.members[1].lastName}</h4>
                                    :
                                    <h4 className="ml-5 mt-4 font-weight-bold">{chat.currentConversation.members[0].firstName} {chat.currentConversation.members[0].lastName}</h4>
                                }
                            </div>
                            <div className="chat-body">
                                {chat.messages.map((msg) => (
                                    <div className={`message ${msg.sender._id === user.userInfo._id ? "info" : "my-message"}`}>

                                        <img alt="user_avatar" className="img-circle medium-image" src={`${msg.sender._id === user.userInfo._id ? user.userInfo.image.imageURL : msg.sender.image.imageURL}`} />
                                        <div className="message-body">
                                            <div className="message-text">
                                                {msg.textMessage}
                                            </div>
                                            <div class="message-info">
                                                <h6> <i class="fa fa-clock-o"></i> {format(msg.createdAt)}</h6>
                                            </div>
                                        </div>
                                        <br />
                                    </div>
                                ))}
                            </div>
                            <div className="chat-footer mb-3">
                                <textarea className="send-message-text" value={textMessage} onChange={handleChange}></textarea>
                                <button type="submit" className="btn-secondary send-message-button " onClick={(e) => handleSubmit(e, chat.currentConversation._id)}> <i className="fa fa-send"></i> </button>
                            </div>
                        </div>
                    </>
                    : true}
            </div>
        </>
    )
}

export default Conversation
