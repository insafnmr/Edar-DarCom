import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { forgotPassword } from '../redux/userSlice'

const ForgotPassword = () => {

    const dispatch = useDispatch()
    const user = useSelector((state) => state.user);

    const [email, setEmail] = useState('')


    const handleChange = (e) => {
        setEmail(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(forgotPassword({ "email": email }));
        setEmail('');
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
                    <div className="container" style={{ paddingTop: 100, paddingBottom: 100 }}>
                        <div className="row justify-content-center mt-5">
                            <div className="col-xl-10">
                                <div className="card border-0">
                                    <div className="card-body p-0">
                                        <div className="row no-gutters">
                                            <div className="col-lg-5 align-self-center ">
                                                <h2 className="mb-5">Forgot your password?</h2>

                                                {user && user.errors && <h5 style={{ color: "red" }}>{user.errors}</h5>}
                                                {user && user.successMessage && <h5 style={{ color: "green" }}>{user.successMessage}</h5>}

                                                <form>

                                                    <label htmlFor="exampleInputEmail1">Email address</label>
                                                    <input type="email" value={email} className="form-control shadow-danger" id="exampleInputEmail1" onChange={handleChange} placeholder="Enter your email address" />
                                                    <button type="submit" className="btn btn-secondary mt-3" onClick={handleSubmit}> Verify your email </button>

                                                </form>
                                            </div>
                                            <div className="col-lg-7 d-lg-inline-block">
                                                <img src="../assets/images/Forgot_password.png" />
                                            </div>
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

export default ForgotPassword
