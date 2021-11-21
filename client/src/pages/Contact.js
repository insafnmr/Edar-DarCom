import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { addNewMessage } from '../redux/contactSlice'

const Contact = () => {

    const dispatch = useDispatch()
    const [messageInput, setMessageInput] = useState({})
    const user = useSelector((state) => state.user)

    const handleChange = (e) => {
        setMessageInput({ ...messageInput, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(addNewMessage(messageInput))
    }
    return (
        <div>
            {user.loading ?
                <div id="js-preloader" className="js-preloader">
                    <div className="preloader-inner">
                        <span className="dot"></span>
                        <div className="dots">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div> :
                <>
                    <div className="page-heading">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-8">
                                    <div className="top-text header-text">
                                        <h6>Keep in touch with us</h6>
                                        <h2>Feel free to send us a message about your interest needs</h2>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="contact-page">
                        <div className="container">
                            <div className="row">
                                <div className="col-lg-12">
                                    <div className="inner-content">
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <div id="map">
                                                    <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d207231.33200524384!2d10.590090526510712!3d35.75106129908631!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x12fd8b840813200d%3A0x5f3bbefb88f9835d!2sGOMYCODE%20Sousse!5e0!3m2!1sfr!2stn!4v1633289047284!5m2!1sfr!2stn" width="100%" height="650px" frameBorder="0" style={{ border: "0" }} allowFullScreen></iframe>
                                                </div>
                                            </div>
                                            <div className="col-lg-6 align-self-center">
                                                <form id="contact" action="" method="get">
                                                    <div className="row">
                                                        <div className="col-lg-6">
                                                            <fieldset>
                                                                <input type="text" id="firstName" className="form-control" placeholder="First name" name="firstName" onChange={handleChange} autoComplete="on" required={true} />
                                                            </fieldset>
                                                        </div>
                                                        <div className="col-lg-6">
                                                            <fieldset>
                                                                <input type="text" id="lastName" className="form-control" placeholder="First name" name="lastName" onChange={handleChange} autoComplete="on" required={true} />
                                                            </fieldset>
                                                        </div>
                                                        <div className="col-lg-12">
                                                            <fieldset>
                                                                <input type="email" name="email" onChange={handleChange} className="form-control" pattern="[^ @]*@[^ @]*" placeholder="Your Email" required={true} />
                                                            </fieldset>
                                                        </div>

                                                        <div className="col-lg-12">
                                                            <fieldset>
                                                                <textarea name="message" type="text" className="form-control" id="message" placeholder="Message" onChange={handleChange}></textarea>
                                                            </fieldset>
                                                        </div>
                                                        <div className="col-lg-12">
                                                            <fieldset>
                                                                <button type="submit" id="form-submit" className="main-button" onClick={handleSubmit}><i className="fa fa-paper-plane"></i> Send Message</button>
                                                            </fieldset>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
        </div>
    )
}

export default Contact
