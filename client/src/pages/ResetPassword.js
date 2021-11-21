import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword } from '../redux/userSlice'

const ResetPassword = () => {

    const dispatch = useDispatch()
    const user = useSelector((state) => state.user);

    const [password, setPassword] = useState('')


    const handleChange = (e) => {
        setPassword({ ...password, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(resetPassword(password));
    }

    const [showpassword, setshowPassword] = useState(false);
    const [showConfirmedpassword, setshowConfirmedPassword] = useState(false);

    const handleShowPassword = () => {
        setshowPassword(!showpassword)
    }

    const handleShowConfirmedPassword = () => {
        setshowConfirmedPassword(!showConfirmedpassword)
    }

    return (
        <>
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
                    <div style={{ paddingTop: 100, paddingBottom: 330 }} className="container">
                        <div className="row justify-content-center mt-5">
                            <div className="col-xl-8">
                                <div className="card border-0">
                                    <div className="card-body p-0">
                                        <div className="row no-gutters">
                                            <div className="col-lg-6 align-self-center ">
                                                <h2 className="mb-5">Reset your password</h2>
                                                {user && user.errors && <h5 style={{ color: "red" }}>{user.errors}</h5>}
                                                {user && user.successMessage && <h5 style={{ color: "green" }}>{user.successMessage}</h5>}

                                                <form>
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="exampleInputPassword1">Password</label>
                                                        <div className="input-group">
                                                            <input type={showpassword ? "text" : "password"} name="password" className="form-control" id="exampleInputPassword1" onChange={handleChange} placeholder="Enter your password" />
                                                            <div className="input-group-btn">
                                                                <button className="btn btn-default reveal" type="button"><i className={showpassword ? "glyphicon glyphicon-eye-open" : " glyphicon glyphicon-eye-close"} onClick={handleShowPassword} ></i></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="form-group mb-3">
                                                        <label htmlFor="exampleInputPassword1">Confirm Password</label>
                                                        <div className="input-group">
                                                            <input type={showConfirmedpassword ? "text" : "password"} name="confirmedPassword" className="form-control" id="exampleInputPassword1" onChange={handleChange} placeholder="Confirm your password" />
                                                            <div className="input-group-btn">
                                                                <button className="btn btn-default reveal" type="button"><i className={showConfirmedpassword ? "glyphicon glyphicon-eye-open" : " glyphicon glyphicon-eye-close"} onClick={handleShowConfirmedPassword} ></i></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <button type="submit" className="btn btn-secondary mt-3" onClick={handleSubmit}> Save new password</button>
                                                </form>
                                            </div>
                                            {/* <div className="col-lg-7 d-lg-inline-block">
                                                <img src="../assets/images/authentication.png" alt="auth" />
                                            </div> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            }
        </>
    )
}

export default ResetPassword