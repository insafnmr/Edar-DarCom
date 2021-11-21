import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { login, googleLogin } from '../redux/userSlice'
import { Link } from 'react-router-dom';
import '../styles/login.css';
import { GoogleLogin } from 'react-google-login';


const LoginPage = ({ history }) => {
    const dispatch = useDispatch()

    const [userInput, setUserInput] = useState({})
    const [showpassword, setshowPassword] = useState(false);

    const user = useSelector((state) => state.user)
    useEffect(() => {
        if (!user.isAuth) {

            history.push('/login');
        }
        else {
            if (user.userInfo.role !== "admin") {
                history.push('/');
            }
            else {
                history.push('/admin');

            }
        }
    }, [user.isAuth]);

    const handleShowPassword = () => {
        setshowPassword(!showpassword)
    }
    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(login(userInput))
    }

    const googleSuccess = async (response) => {
        const obj = {
            tokenId: response.tokenId
        }
        dispatch(googleLogin(obj))
    }

    const googleFailure = (error) => {
        console.log(error);
        console.log("Login with google was unsuccessful, Try again!");
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
                    <div className="container" style={{ paddingTop: 80 }}>
                        <div className="row justify-content-center">
                            <div className="col-xl-10">
                                <div className="card border-0">
                                    <div className="card-body p-0">
                                        <div className="row no-gutters">
                                            <div className="col-lg-5">
                                                <div className="p-5">
                                                    <div className="mb-5">
                                                        <h3 className="h4 font-weight-bold text-theme">Login</h3>
                                                    </div>

                                                    <h6 className="h2 mb-0">Welcome back!</h6>
                                                    <p className="text-muted mt-2 mb-5">Enter your email address and password to Sign in.</p>

                                                    <form>
                                                        <div className="form-group">
                                                            <label htmlFor="exampleInputEmail1">Email address</label>
                                                            <div className="input-group">
                                                                <div className="input-group-btn">
                                                                    <a className="btn btn-default reveal" disabled><i className="glyphicon glyphicon-envelope" ></i></a>
                                                                </div>
                                                                <input type="email" name="email" className="form-control shadow-danger" id="exampleInputEmail1" onChange={handleChange} placeholder="Enter your email address" />
                                                            </div>
                                                        </div>
                                                        <div className="form-group mb-5">
                                                            <label htmlFor="exampleInputPassword1">Password</label>
                                                            <div className="input-group">
                                                                <div className="input-group-btn">
                                                                    <a className="btn btn-default reveal" disabled><i className="glyphicon glyphicon-lock" ></i></a>
                                                                </div>
                                                                <input type={showpassword ? "text" : "password"} name="password" className="form-control shadow-danger" id="exampleInputPassword1" onChange={handleChange} placeholder="Enter your password" />
                                                                <div className="input-group-btn">
                                                                    <button className="btn btn-default reveal" type="button"><i className={showpassword ? "glyphicon glyphicon-eye-open" : " glyphicon glyphicon-eye-close"} onClick={handleShowPassword} ></i></button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </form>
                                                    <div className="row justify-content-center">
                                                        <button type="submit" style={{ width: "94%" }} className="btn btn-secondary" onClick={handleSubmit}>Sign in</button>
                                                        <Link to="/forgot_password" className="mt-3 mr-5 d-flex flex-wrap justify-content-end">Forgot your password?</Link>
                                                    </div>
                                                    {user && user.errors && <h5 style={{ color: "red" }}>{user.errors}</h5>}

                                                    <div className="hr text-center">Or Login With</div>
                                                    <div className="social">
                                                        <GoogleLogin
                                                            clientId="165359739596-p99c3ltp2upk4s6ofcq9irp5hbpd4dq8.apps.googleusercontent.com"
                                                            buttonText="Login with Google"
                                                            onSuccess={googleSuccess}
                                                            onFailure={googleFailure}
                                                            cookiePolicy={'single_host_origin'}
                                                        />
                                                    </div>
                                                    <p className="text-muted float-right text-primary text-center">Don't have an account? <a href="/register" className="text-primary ml-1">Register</a></p>

                                                </div>
                                            </div>

                                            <div className="col-lg-7 d-none d-lg-inline-block">
                                                <div className="account-block rounded-right">
                                                    <div className="overlay rounded-right"></div>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div >
                </>
            }
        </>
    )

}
export default LoginPage;