import React, { useEffect, useState } from 'react';
import "../styles/chats.css";
import { useDispatch, useSelector } from "react-redux";
import { getConversation } from "../redux/chatSlice"
import Pusher from "pusher-js"
import ChatList from "../components/ChatList";
import Conversation from "../components/Conversation"

const Chat = ({ history }) => {

    const dispatch = useDispatch()
    const chat = useSelector((state) => state.chat);
    const user = useSelector((state) => state.user);

    useEffect(() => {
        if ((!user.isAuth) || (user.isAuth && user.userInfo.role === "admin")) {
            history.push('/login');
        }
    }, [user.isAuth]);

    useEffect(() => {
        const pusher = new Pusher('dff4d6fa624781b71843', {
            cluster: 'eu'
        });

        const channel = pusher.subscribe("messages");
        channel.bind("newMessage", (data) => {
            dispatch(getConversation(chat._id))
        });
        return () => {
            channel.unbind_all();
            channel.unsubscribe();
        };
    }, [chat]);

    return (
        <div style={{ marginTop: 130 }}>
            <div className="container">
                <div className="panel messages-panel">

                    <ChatList />
                    <Conversation />

                </div>
            </div>
        </div>

    );
}

export default Chat;