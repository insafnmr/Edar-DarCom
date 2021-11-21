import React from 'react'
import "../styles/chats.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { getMessages, currentConversation, getConversations, deleteConversation } from "../redux/chatSlice";
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom'
import moment from 'moment'

const ChatList = () => {

    const history = useHistory()
    const dispatch = useDispatch();
    const chat = useSelector((state) => state.chat);
    const user = useSelector((state) => state.user);


    const [showDelete, setShowDelete] = useState(false);
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = () => setShowDelete(true);

    useEffect(() => {
        dispatch(getConversations());
    }, []);


    const currentConv = (convId) => {
        dispatch(getMessages(convId._id))
        dispatch(currentConversation(convId))
    }

    const handleDelete = (e, chatId) => {
        e.preventDefault();
        dispatch(deleteConversation(chatId));
        handleCloseDelete();
        history.push('/chat');
    };

    return (
        <>
            <div className="contacts-list">
                <div className="tab-content">
                    <div id="inbox" className="contacts-outter-wrapper tab-pane active">
                        {/* <form className="panel-search-form info form-group has-feedback no-margin-bottom">
                                <input type="text" className="form-control" name="search" placeholder="Search" />
                                <span className="fa fa-search form-control-feedback"></span>
                            </form> */}
                        <h3 className="mb-3 font-weight-bold text-center" style={{ color: '#ee5057' }}> Chat List </h3>
                        <div className="contacts-outter">
                            <ul className="list-unstyled contacts">
                                {chat.conversations.map((conv) => (
                                    <>
                                        {conv.members[0]._id === user.userInfo._id ?
                                            <>
                                                <li data-toggle="tab" onClick={() => currentConv(conv)}>
                                                    <div className="d-flex justify-content-around">
                                                        <img alt="received_avatar" className="img-circle medium-image" src={conv.members[1].image.imageURL} />
                                                        <h5> {conv.members[1].firstName} {conv.members[1].lastName} </h5>
                                                        <div className="contacts-add">
                                                            <h6 style={{ fontSize: 6 }}><sup className="message-time"> {moment(conv.createdAt).format('h:mm A')}</sup></h6>
                                                            <i className="fa fa-trash-o" onClick={handleShowDelete}></i>
                                                            <Modal style={{ backgroundColor: 'transparent', marginLeft: 100, padding: 50 }} show={showDelete} onHide={handleCloseDelete} animation={false} >
                                                                <Modal.Body className="ml-2 mr-2">
                                                                    <Form.Group as={Row} className="mb-3" >
                                                                        <Col sm="2">
                                                                            <img src="https://img.icons8.com/glyph-neue/64/fa314a/warning-shield.png" />
                                                                        </Col>
                                                                        <Form.Label column sm="10">Are you sure you want to delete this conversation?
                                                                            <h5 > It will be deleted immediately.You can't undo this action.</h5></Form.Label>
                                                                    </Form.Group>
                                                                </Modal.Body>
                                                                <Modal.Footer>
                                                                    <Button variant="secondary" style={{ width: 100, height: 30 }} type='submit'
                                                                        onClick={(e) => handleDelete(e, conv._id)}> Yes </Button>
                                                                    <Button variant="danger" style={{ width: 100, height: 30 }} type='submit' onClick={handleCloseDelete} > No </Button>
                                                                </Modal.Footer>
                                                            </Modal>
                                                        </div>
                                                    </div>
                                                </li>
                                            </>
                                            :
                                            <>
                                                <li data-toggle="tab" onClick={() => currentConv(conv)}>
                                                    <div className="d-flex justify-content-around">
                                                        <img alt="received_avatar" className="img-circle medium-image" src={conv.members[0].image.imageURL} />
                                                        <h5> {conv.members[0].firstName} {conv.members[0].lastName} </h5>
                                                        <div className="contacts-add">
                                                            <h6 style={{ fontSize: 6 }}><sup className="message-time"> {moment(conv.createdAt).format('h:mm A')}</sup></h6>
                                                            <i className="fa fa-trash-o" onClick={handleShowDelete}></i>
                                                            <Modal style={{ backgroundColor: 'transparent', marginLeft: 100, padding: 50 }} show={showDelete} onHide={handleCloseDelete} animation={false} >
                                                                <Modal.Body className="ml-2 mr-2">
                                                                    <Form.Group as={Row} className="mb-3" >
                                                                        <Col sm="2">
                                                                            <img src="https://img.icons8.com/glyph-neue/64/fa314a/warning-shield.png" />
                                                                        </Col>
                                                                        <Form.Label column sm="10">Are you sure you want to delete this conversation?
                                                                            <h5 > It will be deleted immediately.You can't undo this action.</h5></Form.Label>
                                                                    </Form.Group>
                                                                </Modal.Body>
                                                                <Modal.Footer>
                                                                    <Button variant="secondary" style={{ width: 100, height: 30 }} type='submit'
                                                                        onClick={(e) => handleDelete(e, conv._id)}> Yes </Button>
                                                                    <Button variant="danger" style={{ width: 100, height: 30 }} type='submit' onClick={handleCloseDelete} > No </Button>
                                                                </Modal.Footer>
                                                            </Modal>
                                                        </div>
                                                    </div>
                                                </li>
                                            </>
                                        }
                                    </>
                                ))}
                            </ul>
                        </div>

                    </div>
                </div>
            </div>
        </>
    )
}

export default ChatList
