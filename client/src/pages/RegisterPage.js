import React, { useRef } from 'react';
import '../styles/login.css';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { postNewUser } from '../redux/userSlice'
import { Alert } from 'react-bootstrap';

const Register = ({ history }) => {

    const birthDate = useRef();

    const dispatch = useDispatch()
    const [userInput, setUserInput] = useState({})
    const user = useSelector((state) => state.user)
    const [showpassword, setshowPassword] = useState(false);
    const [showConfirmedpassword, setshowConfirmedPassword] = useState(false);

    const handleShowPassword = () => {
        setshowPassword(!showpassword)
    }

    const handleShowConfirmedPassword = () => {
        setshowConfirmedPassword(!showConfirmedpassword)
    }

    useEffect(() => {
        if (!user.isAuth) {
            history.push('/register');
        }
    }, [user.isAuth]);

    const handleChange = (e) => {
        setUserInput({ ...userInput, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(postNewUser(userInput))
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
                                    <div className="col-lg-6">
                                        <div className="p-5">
                                            <div className="mb-5">
                                                <h3 className="h4 font-weight-bold text-theme">Register</h3>
                                            </div>

                                            <form>
                                                <div className="form-group mb-3">
                                                    <label htmlFor="firstName">First name</label>
                                                    <input type="text" id="firstName" className="form-control shadow-danger" placeholder="First name" name="firstName" onChange={handleChange} required={true} />
                                                </div>

                                                <div className="form-group mb-3">
                                                    <label htmlFor="lastName">Last name</label>
                                                    <input type="text" id="lastName" className="form-control shadow-danger" placeholder="Last name" name="lastName" onChange={handleChange} />
                                                </div>

                                                <div className="form-group mb-3">
                                                    <label>Gender</label><br />
                                                    <input type="radio" name="gender" value="Male" onChange={handleChange} /> Male
                                                    <input type="radio" name="gender" value="Female" onChange={handleChange} />     Female
                                                </div>

                                                <div className="form-group mb-3">
                                                    <label htmlFor="birthdate">Date of birth</label>
                                                    <div className="form-group tm-form-element tm-form-element-50 tm-form-element-2">
                                                        <i className="fa fa-calendar tm-form-element-icon" style={{ color: "gray", marginLeft: "90%" }}></i>
                                                        <input name="birthDate" type="text" className="form-control shadow-danger" ref={birthDate} onFocus={() => (birthDate.current.type = "date")} onChange={handleChange} placeholder="Enter your date of birth" />
                                                    </div>
                                                </div>

                                                <div className="form-group mb-3">
                                                    <label>Phone number</label>
                                                    <input type="tel" className="form-control shadow-danger" placeholder="--------" name="phone" minLength="8" maxLength="8" onChange={handleChange} />
                                                </div>


                                                <div className="form-group mb-3">
                                                    <label htmlFor="exampleInputEmail1">Email address</label>
                                                    <input type="email" name="email" className="form-control shadow-danger" id="exampleInputEmail1" onChange={handleChange} placeholder="Enter your email address" />

                                                </div>

                                                <div className="form-group mb-3">
                                                    <label htmlFor="exampleInputPassword1">Password</label>
                                                    <div className="input-group">
                                                        <input type={showpassword ? "text" : "password"} name="password" className="form-control shadow-danger" id="exampleInputPassword1" onChange={handleChange} placeholder="Enter your password" />
                                                        <div className="input-group-btn">
                                                            <button className="btn btn-default reveal" type="button"><i className={showpassword ? "glyphicon glyphicon-eye-open" : " glyphicon glyphicon-eye-close"} onClick={handleShowPassword} ></i></button>
                                                        </div>
                                                    </div>
                                                </div>


                                                <div className="form-group mb-3">
                                                    <label htmlFor="exampleInputConfirmedPassword1">Confirm Password</label>
                                                    <div className="input-group">
                                                        <input type={showConfirmedpassword ? "text" : "password"} name="confirmedPassword" className="form-control shadow-danger" id="exampleInputConfirmedPassword1" onChange={handleChange} placeholder="Confirm your password" />

                                                        <div className="input-group-btn">
                                                            <button className="btn btn-default reveal" type="button"><i className={showConfirmedpassword ? "glyphicon glyphicon-eye-open" : " glyphicon glyphicon-eye-close"} onClick={handleShowConfirmedPassword} ></i></button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <button type="submit" className="btn btn-secondary" onClick={handleSubmit}>Sign up</button>
                                                <p className="text-muted float-right text-primary text-center">You have an account? <a href="/login" className="text-primary ml-1">Login</a></p>
                                            </form>
                                        {user && user.errors && <h5 style={{ color: "red" }}>{user.errors}</h5>}
                                        {user && user.successMessage && <h5 style={{ color: "green" }}>{user.successMessage}</h5>}
                                        </div>
                                    </div>

                                    <div className="col-lg-6 d-none d-lg-inline-block">
                                        <div className="register-block rounded-right">
                                            <div className="overlay rounded-right"></div>
                                        </div>
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
export default Register