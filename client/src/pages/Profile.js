import '../styles/profile.css'
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import { updateUserImage, updateUser, deleteUser, changePassword, getUser } from '../redux/userSlice';
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { deleteFav, getFavorites } from '../redux/favoriteSlice';
import { deleteRes, getReservationsByClient } from '../redux/reservationSlice'

import ReactStars from "react-rating-stars-component";
import moment from 'moment'
import { Alert, Snackbar } from '@mui/material';


const Profile = ({ history }) => {
    const ref1 = useRef();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user);
    const favorite = useSelector((state) => state.favorite);
    const reservation = useSelector((state) => state.reservation);

    const [updatedUserInfo, setUpdatedUserInfo] = useState({});
    const [password, setPassword] = useState('')


    const handleChangePassword = (e) => {
        setPassword({ ...password, [e.target.name]: e.target.value })
    }

    const handleSubmitPassword = (e, userId) => {
        e.preventDefault();
        dispatch(changePassword({ id: userId, data: password }));
        handleOpen();
    }


    const handleChange = (e) => {
        setUpdatedUserInfo({ ...updatedUserInfo, [e.target.name]: e.target.value });
    };
    const handleSubmit = (e, userId) => {
        e.preventDefault();
        dispatch(updateUser({ id: userId, data: updatedUserInfo }));
        handleOpen();
    };

    const handleUpdateImage = (e, userId) => {
        dispatch(updateUserImage({ id: userId, file: e.target.files[0] }));
        handleOpen();
    };
    const handleDelete = (e, userId) => {
        e.preventDefault();
        dispatch(deleteUser({ id: userId }));
        history.push('/login')
    };

    const handleDeleteFav = (e, favId) => {
        e.preventDefault();
        dispatch(deleteFav({ id: favId }));
    };
    const handleDeleteRes = (e, resId) => {
        e.preventDefault();
        dispatch(deleteRes({ id: resId }));
    };
    const [showDelete, setShowDelete] = useState(false);
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = () => setShowDelete(true);

    const [reservationId, setReservationId] = useState('');

    const [showDeleteRes, setShowDeleteRes] = useState(false);
    const handleCloseDeleteRes = () => setShowDeleteRes(false);
    const handleShowDeleteRes = () => setShowDeleteRes(true);


    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const handleOpen = () => setOpen(true);


    useEffect(() => {
        if (!user.isAuth) {
            history.push('/login');
        } else {
            dispatch(getFavorites())
            dispatch(getReservationsByClient())
        }
    }, [user.isAuth]);

    return (
        <>
            {user.isAuth && (<>
                {favorite.loading ?
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
                        <div className="container mt-5" style={{ paddingTop: 100 }}>
                            <div className="row">
                                <div className="wizard">
                                    <div className="col-lg-4">
                                        <div className="user-info-wrapper">
                                            <div className="user-cover" style={{ backgroundImage: "linear-gradient(217deg,rgba(238, 80, 87,0.8), rgba(128, 128, 128, 0.5))" }}>
                                            </div>
                                            <div className="user-info">
                                                <div className="user-avatar">
                                                    <img src={user.userInfo.image.imageURL} style={{ height: 180, width: 180 }} alt="User" />
                                                    <input className="fa fa-fw fa-camera" name="picture" type="file" style={{ marginLeft: 80 }} onChange={(e) => handleUpdateImage(e, user.userInfo._id)}>
                                                    </input>
                                                </div>
                                                <div className="user-data">
                                                    <h4>{user.userInfo.firstName} {" "} {user.userInfo.lastName}</h4>
                                                    <span>Joined {moment(user.userInfo.joinedAt).format("DD/MM/YYYY")}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <ul className="list-group nav nav-tabs ">
                                            <li className="active">
                                                <a data-toggle="tab" href="#settings">
                                                    <i className="fa fa-user"></i> Profile Settings
                                                </a>
                                            </li>
                                            {user.userInfo.role !== "admin" && (
                                                <li  >
                                                    <a href='#wishlist' data-toggle="tab">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <div><i className="fe-icon-heart mr-1 text-muted"></i>
                                                                <div className="d-inline-block font-weight-medium text-uppercase"><i className="fa fa-heart"></i>My Wishlist</div>
                                                            </div><span className="badge badge-secondary">{favorite.favorites.length}</span>
                                                        </div>
                                                    </a>
                                                </li>
                                            )}
                                            {user.userInfo.role !== "admin" && (
                                                <li>
                                                    <a href="#reservations" data-toggle="tab">
                                                        <div className="d-flex justify-content-between align-items-center">
                                                            <div><i className="fe-icon-shopping-bag mr-1 text-muted"></i>
                                                                <div className="d-inline-block font-weight-medium text-uppercase"><i className="glyphicon glyphicon-calendar"></i>Reservations List</div>
                                                            </div><span className="badge badge-secondary">{reservation.reservations.length}</span>
                                                        </div>
                                                    </a>
                                                </li>
                                            )}
                                        </ul>
                                    </div>

                                    {/* <!-- Profile Settings--> */}
                                    <div className="tab-content">
                                        <div className="tab-pane active" id="settings">
                                            <div className="col-lg-8 pb-5">
                                                <form className="row">
                                                    <h4 className="mb-3 font-weight-bold" style={{ color: '#ee5057' }}>User info</h4>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label htmlFor="account-fn">First Name</label>
                                                            <input className="form-control shadow-danger" type="text" id="account-fn" name="firstName" placeholder={user.userInfo.firstName} onChange={handleChange} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label htmlFor="account-ln">Last Name</label>
                                                            <input className="form-control shadow-danger" type="text" id="account-ln" name="lastName" placeholder={user.userInfo.lastName} onChange={handleChange} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label htmlFor="gender">Gender</label>
                                                            <select className="form-control shadow-danger" id="gender" style={{ height: '100%' }} name="gender" onChange={handleChange} >
                                                                <option selected disabled> {user.userInfo.gender} </option>
                                                                <option value="Male"> Male </option>
                                                                <option value="Female"> Female </option>
                                                            </select>
                                                        </div>
                                                    </div>

                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label htmlFor="birthdate">Date of birth</label>
                                                            <div className="form-group tm-form-element tm-form-element-50 tm-form-element-2">
                                                                <i className="fa fa-calendar tm-form-element-icon" style={{ color: "gray", marginLeft: "85%" }}></i>
                                                                <input name="birthDate" type="text" className="form-control shadow-danger" ref={ref1} onFocus={() => (ref1.current.type = "date")} onChange={handleChange} placeholder={moment(user.userInfo.birthDate).format("DD/MM/YYYY")} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label htmlFor="account-email">E-mail Address</label>
                                                            <input className="form-control shadow-danger" type="email" id="account-email" name="email" placeholder={user.userInfo.email} onChange={handleChange} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label htmlFor="account-phone">Phone Number</label>
                                                            <input className="form-control shadow-danger" type="text" id="account-phone" minLength="8" maxLength="8" name="phone" placeholder={user.userInfo.phone} onChange={handleChange} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label htmlFor="account-country">Country</label>
                                                            <input className="form-control shadow-danger" type="text" id="account-country" name="country" placeholder={user.userInfo.country} onChange={handleChange} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label htmlFor="account-city">City</label>
                                                            <input className="form-control shadow-danger" type="text" id="account-city" name="city" placeholder={user.userInfo.city} onChange={handleChange} />
                                                        </div>
                                                    </div>
                                                    <div className="col--md-12">
                                                        <div className="d-flex flex-wrap justify-content-start ml-2 mb-3">
                                                            <button className="btn btn-style-1 btn-secondary" type="submit" data-toast="" data-toast-position="topRight" data-toast-type="success" data-toast-icon="fe-icon-check-circle" data-toast-title="Success!" data-toast-message="Your profile updated successfuly." onClick={(e) => handleSubmit(e, user.userInfo._id)}>Update Profile</button>
                                                        </div>
                                                    </div>
                                                    <hr className="mt-2 mb-3" />
                                                    <h4 className="mb-3 font-weight-bold" style={{ color: '#ee5057' }}>Change Password</h4>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label htmlFor="account-pass">Current Password</label>
                                                            <input className="form-control" type="password" name="currentPassword" id="account-pass" onChange={handleChangePassword} />
                                                        </div>
                                                    </div>
                                                    <div className="col-md-6">
                                                        <div className="form-group">
                                                            <label htmlFor="account-confirm-pass">New Password</label>
                                                            <input className="form-control" type="password" name="newPassword" id="account-confirm-pass" onChange={handleChangePassword} />
                                                        </div>
                                                    </div>

                                                    <div className="col-md-12">
                                                        {user.userInfo.role !== "admin" && (
                                                            <>
                                                                <div className="d-flex flex-wrap justify-content-between align-items-center">
                                                                    <button className="btn btn-style-1 btn-secondary" type="submit" data-toast="" data-toast-position="topRight" data-toast-type="success" data-toast-icon="fe-icon-check-circle" data-toast-title="Success!" data-toast-message="Your profile updated successfuly." onClick={(e) => handleSubmitPassword(e, user.userInfo._id)}>Save</button>
                                                                    <a className="btn btn-style-1 btn-danger" style={{ color: "white" }} data-toast-position="topRight" onClick={handleShowDelete}> Delete Profile </a>
                                                                    <Modal style={{ backgroundColor: 'transparent', padding: 50 }} show={showDelete} onHide={handleCloseDelete} animation={false} >
                                                                        <Modal.Body className="ml-2 mr-2">
                                                                            <Form.Group as={Row} className="mb-3" >
                                                                                <Col sm="2">
                                                                                    <img src="https://img.icons8.com/glyph-neue/64/fa314a/warning-shield.png" />
                                                                                </Col>
                                                                                <Form.Label column sm="10">Are you sure you want to delete this account?
                                                                                    <h5 > It will be deleted immediately.You can't undo this action.</h5></Form.Label>
                                                                            </Form.Group>
                                                                        </Modal.Body>
                                                                        <Modal.Footer>
                                                                            <Button variant="secondary" style={{ width: 100, height: 30 }} type='submit'
                                                                                onClick={(e) => handleDelete(e, user.userInfo._id)}> Yes </Button>
                                                                            <Button variant="danger" style={{ width: 100, height: 30 }} type='submit' onClick={handleCloseDelete} > No </Button>
                                                                        </Modal.Footer>
                                                                    </Modal>

                                                                </div>
                                                            </>
                                                        )}

                                                        {
                                                            user.userInfo.role === "admin" && (
                                                                <>
                                                                    <div className="d-flex flex-wrap justify-content-start">
                                                                        <button className="btn btn-style-1 btn-secondary" type="submit" data-toast="" data-toast-position="topRight" data-toast-type="success" data-toast-icon="fe-icon-check-circle" data-toast-title="Success!" data-toast-message="Your profile updated successfuly." onClick={(e) => handleSubmitPassword(e, user.userInfo._id)}>Save</button>
                                                                    </div>
                                                                </>
                                                            )
                                                        }
                                                    </div>
                                                </form>
                                            </div>
                                        </div >

                                        {/* <!--My Wish List--> */}
                                        <div className="tab-pane" id="wishlist">
                                            <div className="col-lg-8 pb-5">
                                                {favorite.favorites.length > 0 ?
                                                    <>
                                                        {
                                                            favorite.favorites.map((fav) => (
                                                                <>
                                                                    <div key={fav._id} className="cart-item d-md-flex justify-content-between"><span className="remove-item" onClick={(e) => handleDeleteFav(e, fav.house._id)}><i className="fa fa-times"></i></span>
                                                                        <div className="px-3 my-3">
                                                                            <Link className="cart-item-product" to={{
                                                                                pathname: `/housedetails/${fav.house._id}`
                                                                            }}>
                                                                                <div className="cart-item-product-thumb"><img src={fav.house.image[0].imageURL} style={{ width: 150, height: 150 }} alt="Liked House" /></div>

                                                                                <div className="cart-item-product-info ml-5 pl-5">
                                                                                    <div className="text-lg text-body font-weight-medium ">
                                                                                        <ReactStars
                                                                                            edit={false}
                                                                                            isHalf={true}
                                                                                            value={fav.house.rating}
                                                                                            size={20}
                                                                                        />
                                                                                    </div>
                                                                                    <h4 className="cart-item-product-title">{fav.house.title}</h4>
                                                                                    <div className="text-lg text-body font-weight-medium pb-1"><img src="https://img.icons8.com/ios-glyphs/30/000000/map-marker.png" style={{ width: 20, height: 20 }} /> {fav.house.country} , {fav.house.city}</div>
                                                                                    <div className="text-lg text-body font-weight-medium pb-1"><img src="https://img.icons8.com/ios-glyphs/30/000000/price-tag-euro.png" style={{ width: 20, height: 20 }} /> {fav.house.price} DT</div>
                                                                                    <div className="text-lg text-body font-weight-medium pb-1"><img src="https://img.icons8.com/ios-glyphs/30/000000/compare-heights.png" style={{ width: 20, height: 20 }} /> {fav.house.capacity} people</div>
                                                                                </div>

                                                                            </Link>
                                                                        </div>
                                                                    </div>

                                                                </>
                                                            ))}
                                                    </>
                                                    : <h3> Empty Wishlist </h3>
                                                }
                                            </div>
                                        </div>
                                        {/* <!--My Reservations--> */}
                                        <div className="tab-pane" id="reservations">
                                            <div className="col-lg-8 pb-5">
                                                {reservation.reservations.length > 0 ?
                                                    <>
                                                        {
                                                            reservation.reservations.map((reservation) => (
                                                                <>
                                                                    <div key={reservation._id} /* style={!reservation.isDone &&  { backgroundColor: 'gray' } } */ className="cart-item d-md-flex justify-content-between">{!reservation.isDone && <span className="remove-item" onClick={() => {
                                                                        handleShowDeleteRes()
                                                                        setReservationId(reservation._id)
                                                                    }} ><i className="fa fa-times"></i></span>}

                                                                        <div className="px-3 my-3">
                                                                            <Link className="cart-item-product" to={{
                                                                                pathname: `/housedetails/${reservation.house._id}`
                                                                            }}>
                                                                                <div className="cart-item-product-thumb"><img src={reservation.house.image[0].imageURL} style={{ width: 150, height: 150 }} alt="Reserved House" /></div>

                                                                                <div className="cart-item-product-info ml-5 pl-5">
                                                                                    <div className="text-lg text-body font-weight-medium ">
                                                                                        <ReactStars
                                                                                            edit={false}
                                                                                            isHalf={true}
                                                                                            value={reservation.house.rating}
                                                                                            size={20}
                                                                                        />
                                                                                    </div>
                                                                                    <h4 className="cart-item-product-title">{reservation.house.title}</h4>
                                                                                    <div className="text-lg text-body font-weight-medium pb-1"><img src="https://img.icons8.com/ios-glyphs/30/000000/map-marker.png" style={{ width: 20, height: 20 }} /> {reservation.house.country} , {reservation.house.city}</div>
                                                                                    <div className="text-lg text-body font-weight-medium pb-1"><img src="https://img.icons8.com/ios-glyphs/30/000000/price-tag-euro.png" style={{ width: 20, height: 20 }} /> {reservation.total_price} DT</div>
                                                                                    <div className="text-lg text-body font-weight-medium pb-1"><img src="https://img.icons8.com/ios-glyphs/30/000000/compare-heights.png" style={{ width: 20, height: 20 }} /> {reservation.total_guests} people</div>
                                                                                    <div className="text-lg text-body font-weight-medium pb-1"><img src="https://img.icons8.com/ios-glyphs/30/000000/calendar.png" style={{ width: 20, height: 20 }} /> from {moment(reservation.arrivalDate).format("DD/MM/YYYY")} to {moment(reservation.releaseDate).format("DD/MM/YYYY")}  </div>
                                                                                </div>

                                                                            </Link>
                                                                        </div>
                                                                    </div>
                                                                    <Modal style={{ backgroundColor: 'transparent', padding: 50 }} show={showDeleteRes} onHide={handleCloseDeleteRes} animation={false} >
                                                                        <Modal.Body className="ml-2 mr-2">
                                                                            <Form.Group as={Row} className="mb-3" >
                                                                                <Col sm="2">
                                                                                    <img src="https://img.icons8.com/glyph-neue/64/fa314a/warning-shield.png" />
                                                                                </Col>
                                                                                <Form.Label column sm="10">Are you sure you want to Cancel this reservation?
                                                                                    <h5 > It will be deleted immediately.You can't undo this action.</h5></Form.Label>
                                                                            </Form.Group>
                                                                        </Modal.Body>
                                                                        <Modal.Footer>
                                                                            <Button variant="secondary" style={{ width: 100, height: 30 }} type='submit'
                                                                                onClick={(e) => {
                                                                                    handleDeleteRes(e, reservationId)
                                                                                    setShowDeleteRes(false)
                                                                                }}> Yes
                                                                                <Link to="/login"></Link></Button>
                                                                            <Button variant="danger" style={{ width: 100, height: 30 }} type='submit' onClick={handleCloseDeleteRes} > No </Button>
                                                                        </Modal.Footer>
                                                                    </Modal>
                                                                </>

                                                            ))}


                                                    </>
                                                    : <div style={{ paddingBottom: 340 }}>

                                                        <h3 className="text-center">No available reservations</h3>
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>

                                </div >
                            </div >
                        </div >
                    </>
                }
                {user.errors && (
                    <>
                        <Snackbar open={open} onClose={handleClose} autoHideDuration={5000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} >
                            <Alert onClose={handleClose} style={{ fontSize: 14, marginTop: 60 }} sx={{ width: '100%' }} severity="error">
                                {user.errors}
                            </Alert>
                        </Snackbar>
                    </>)}
                {user.successMessage && (
                    <>
                        <Snackbar open={open} onClose={handleClose} autoHideDuration={5000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} >
                            <Alert onClose={handleClose} style={{ fontSize: 14, marginTop: 60 }} sx={{ width: '100%' }} variant="outlined" severity="success">
                                {user.successMessage}
                            </Alert>
                        </Snackbar>
                    </>)}
            </>
            )}
        </>
    )
}

export default Profile
