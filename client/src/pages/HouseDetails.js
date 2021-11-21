import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import '../templateStyle/style.css';

import ReservationModal from '../components/ReservationModal'
import { deleteHouse, getHouseDetails, updateHouse, updateHouseImages, updateHouseReview } from '../redux/houseSlice'

import { Link, useParams } from "react-router-dom";
import { Modal, Button, Form, Row, Col, Card } from 'react-bootstrap';
import ReactStars from "react-rating-stars-component";
import { checkAvailability, addReservation } from '../redux/reservationSlice'
import moment from 'moment'
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import { addNewReport } from '../redux/reportSlice';

import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker, DateRange } from 'react-date-range';
import { addDays } from 'date-fns';
import * as dayjs from 'dayjs'

import { useAlert } from 'react-alert'
import { addNewConversation } from '../redux/chatSlice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const HouseDetails = ({ history }) => {

  const house = useSelector((state) => state.house.house);
  const success = useSelector((state) => state.house.success);
  const user = useSelector((state) => state.user);
  const reservation = useSelector((state) => state.reservation);

  const dispatch = useDispatch();
  const params = useParams();
  const alert = useAlert()

  useEffect(() => {
    dispatch(getHouseDetails(params.id));
  }, []);

  const [updatedHouseInfo, setUpdatedHouseInfo] = useState({});
  const [commentInfo, setCommentInfo] = useState('');
  const [rate, setRate] = useState(0);
  const [message, setMessage] = useState('');
  const [show, setShow] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [showEditImage, setShowEditImage] = useState(false);
  const [showDelete, setShowDelete] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const handleCloseReport = () => setShowReport(false);
  const handleShowReport = () => setShowReport(true);


  const handleCloseEditImage = () => setShowEditImage(false);
  const handleShowEditImage = () => setShowEditImage(true);

  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = () => setShowDelete(true);


  const [checkedInfo, setCheckedInfo] = useState(house.assets);
  const handleChecked = (e) => {
    setCheckedInfo({ ...checkedInfo, [e.target.name]: e.target.checked })
  }

  const handleUpdateImages = (e, houseId) => {
    e.preventDefault();
    dispatch(updateHouseImages({ id: houseId, file: e.target.files }));
    if (success) {
      toast("Updating the pictures of the house in progress ...", { autoClose: 15000 })
    }
    handleCloseEditImage();

  };

  const handleChange = (e) => {
    setUpdatedHouseInfo({ ...updatedHouseInfo, [e.target.name]: e.target.value });
  };
  const handleReservationChange = (e) => {
    //setReservationInfo({ ...reservationInfo, [e.target.name]: e.target.value });
  };
  const handleSubmit = (e, houseId) => {
    e.preventDefault();
    dispatch(updateHouse({ id: houseId, houseInfo: updatedHouseInfo, assets: checkedInfo }));
    handleClose();

  };

  const handleReviewSubmit = (e, houseId) => {
    e.preventDefault();
    if (user.userInfo.isBlocked === false) {
      dispatch(updateHouseReview({ id: houseId, comment: commentInfo, rating: rate }));
    }
    else {
      alert.error(<div style={{ textTransform: 'none' }}> Your account is banned ! Please contact the administrator for more information. </div>,
        { position: 'middle' })
    }
  };

  const handleSubmitReport = (e, hostId) => {
    e.preventDefault();
    if (user.userInfo.isBlocked === false) {
      dispatch(addNewReport({ hostId, message }));
    }
    else {
      alert.error(<div style={{ textTransform: 'none' }}> Your account is banned ! Please contact the administrator for more information. </div>,
        { position: 'middle' })
    }
    handleCloseReport();
  };

  const handleSend = (e, userId) => {
    e.preventDefault();
    if (user.userInfo.isBlocked === false) {
      dispatch(addNewConversation({ id: userId }));
      history.push('/chat')
    }
    else {
      alert.error(<div style={{ textTransform: 'none' }}> Your account is banned ! Please contact the administrator for more information. </div>,
        { position: 'middle' })
    }
  }


  const houseId = params.id
  const [dateInterval, setDateInterval] = useState([
    {
      startDate: addDays(new Date(), 1),
      endDate: addDays(new Date(), 7),
      key: 'selection'
    }
  ]);

  const arrivalDate = moment(dateInterval[0].startDate).format("YYYY/MM/DD");
  const releaseDate = moment(dateInterval[0].endDate).format("YYYY/MM/DD");

  /* const [showReserv, setShowReserv] = useState(false);
  const handleCloseReserv = () => setShowReserv(false);
  const handleShowReserv = (e) => {
    e.preventDefault();
    if (user.userInfo.isBlocked === false) {
    setShowReserv(true);
    }
    else {
alert.error(<div style={{ textTransform: 'none' }}> Your account is banned ! Please contact the administrator for more information. </div>,
                { position: 'middle' })
    }
  } */
  useEffect(() => {
    const houseId = house._id
    dispatch(checkAvailability({ houseId, arrivalDate, releaseDate }))


  }, [dateInterval])

  const handleCheckAvailability = (e) => {
    e.preventDefault();
    //const houseId = house._id

    //dispatch(checkAvailability({ houseId, arrivalDate, releaseDate }))
    reservation.reservation.reserved ? alert.error(reservation.reservation.message) : alert.success(reservation.reservation.message)
  }

  /* const handleShowBtn = (e) =>{
    e.preventDefault();
  setShow(true);
  } 
   */

  return (
    <>
      {house.loading ?
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
          <div>
            <div className="page-heading">
              <div className="container">
                <div className="row">
                  <div className="col-lg-8">
                    <div className="top-text header-text">

                      <h2>Details</h2>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {house && house.title &&

              <div className="recent-listing">
                <div className="container">
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="section-heading">

                        <h2>{house.title}</h2>
                        <h6>Hosted by: {house.host.firstName} {house.host.lastName} </h6>

                      </div>
                    </div>
                    <div className="row justify-content-md-center">
                      <div className="col-lg-10  justify-content-center">
                        <div>
                          <Carousel
                            infiniteLoop={true}
                            autoPlay={true}
                          >
                            {house.image.map((img) => (

                              <img key={img._id} src={img.imageURL} className="img-responsive" alt="house" />

                            ))}
                          </Carousel>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-8">

                      <div id="exTab2" style={{ marginTop: 20 }}>
                        <ul className="nav nav-tabs w-100" >
                          <li className="active">
                            <a href="#details" style={{ color: "#ee5057" }} data-toggle="tab">Details</a>
                          </li>
                          <li><a href="#reviews" data-toggle="tab">Reviews</a>
                          </li>
                          {user.isAuth ?
                            <>
                              {user.userInfo._id === house.host._id && (
                                <>
                                  <li>
                                    <a onClick={handleShow} className="book-now text-center" >
                                      <i className="fa fa-edit"></i></a>
                                    <Modal style={{ backgroundColor: 'transparent', padding: 50 }} show={show} onHide={handleClose} animation={false} >
                                      <Modal.Header >
                                        <Modal.Title > Edit House </Modal.Title>
                                        <button type="button" className="btn-close" aria-label="Close" onClick={handleClose}></button>
                                      </Modal.Header>
                                      <Modal.Body style={{ marginLeft: 20, marginRight: 20 }}>
                                        <Form>
                                          <Form.Group as={Row} className="mb-2" >
                                            <Form.Label column sm="5">Title </Form.Label>
                                            <Col sm="7">
                                              <Form.Control className=" shadow-danger" type='text' name='title' onChange={handleChange} placeholder={house.title} /><br />
                                            </Col>
                                          </Form.Group>

                                          <Form.Group as={Row} className="mb-3" >
                                            <Form.Label column sm="5">Description </Form.Label>
                                            <Col sm="7">
                                              <Form.Control className=" shadow-danger" as="textarea" type='text' name='description' onChange={handleChange} placeholder={house.description} /><br />
                                            </Col>
                                          </Form.Group>

                                          <Form.Group as={Row} className="mb-3" >
                                            <Form.Label column sm="5">Number of rooms </Form.Label>
                                            <Col sm="7">
                                              <Form.Select className=" shadow-danger" aria-label="Default select example" onChange={handleChange} name="nbr_room" >
                                                <option selected disabled> {house.nbr_room} </option>
                                                <option value="1" >1</option>
                                                <option value="2" >2</option>
                                                <option value="3" >3</option>
                                                <option value="4" >4</option>
                                                <option value="5" >5</option>
                                                <option value="6" >6</option>
                                                <option value="7" >7</option>
                                                <option value="8" >8</option>
                                                <option value="9" >9</option>
                                                <option value="10" >10</option>
                                              </Form.Select>
                                            </Col>
                                          </Form.Group>

                                          <Form.Group as={Row} className="mb-3" >
                                            <Form.Label column sm="5">Number of beds </Form.Label>
                                            <Col sm="7">
                                              <Form.Select className=" shadow-danger" aria-label="Default select example" name="nbr_bed" onChange={handleChange} >
                                                <option selected disabled> {house.nbr_bed}</option>
                                                <option value="1" >1</option>
                                                <option value="2" >2</option>
                                                <option value="3" >3</option>
                                                <option value="4" >4</option>
                                                <option value="5" >5</option>
                                                <option value="6" >6</option>
                                                <option value="7" >7</option>
                                                <option value="8" >8</option>
                                                <option value="9" >9</option>
                                                <option value="10" >10</option>
                                                <option value="11" >11</option>
                                                <option value="12" >12</option>
                                                <option value="13" >13</option>
                                                <option value="14" >14</option>
                                                <option value="15" >15</option>
                                              </Form.Select>
                                            </Col>
                                          </Form.Group>

                                          <Form.Group as={Row} className="mb-3" >
                                            <Form.Label column sm="5">Number of bathrooms </Form.Label>
                                            <Col sm="7">
                                              <Form.Select className=" shadow-danger" aria-label="Default select example" onChange={handleChange} name="nbr_bathroom">
                                                <option selected disabled>{house.nbr_bathroom}</option>
                                                <option value="1" >1</option>
                                                <option value="2" >2</option>
                                                <option value="3" >3</option>
                                                <option value="4" >4</option>
                                                <option value="5" >5</option>
                                              </Form.Select>
                                            </Col>
                                          </Form.Group>

                                          <Form.Group as={Row} className="mb-3" >
                                            <Form.Label column sm="5"> Governorate </Form.Label>
                                            <Col sm="7">
                                              <Form.Select className=" shadow-danger" aria-label="Default select example" name="country" onChange={handleChange} >
                                                <option selected disabled>{house.country}</option>
                                                <option value="Ariana" >Ariana</option>
                                                <option value="Béja" >Béja</option>
                                                <option value="Ben Arous" >Ben Arous</option>
                                                <option value="Bizerte" >Bizerte</option>
                                                <option value="Gabès" >Gabès</option>
                                                <option value="Gafsa" >Gafsa</option>
                                                <option value="Jendouba" >Jendouba</option>
                                                <option value="Kairouan" >Kairouan</option>
                                                <option value="Kasserine" >Kasserine</option>
                                                <option value="Kébili" >Kébili</option>
                                                <option value="Le Kef" >Le Kef</option>
                                                <option value="Mahdia" >Mahdia</option>
                                                <option value="La Manouba" >La Manouba</option>
                                                <option value="Médenine" >Médenine</option>
                                                <option value="Monastir" >Monastir</option>
                                                <option value="Nabeul" >Nabeul</option>
                                                <option value="Sfax" >Sfax</option>
                                                <option value="Sidi Bouzid" >Sidi Bouzid</option>
                                                <option value="Siliana" >Siliana</option>
                                                <option value="Sousse" >Sousse</option>
                                                <option value="Tataouine" >Tataouine</option>
                                                <option value="Tozeur" >Tozeur</option>
                                                <option value="Tunis">Tunis</option>
                                                <option value="Zaghouan" >Zaghouan</option>
                                              </Form.Select>
                                            </Col>
                                          </Form.Group>

                                          <Form.Group as={Row} className="mb-3" >
                                            <Form.Label column sm="5">City </Form.Label>
                                            <Col sm="7">
                                              <Form.Control className=" shadow-danger" type='text' name='city' onChange={handleChange} placeholder={house.city} /><br />
                                            </Col>
                                          </Form.Group>

                                          <Form.Group as={Row} className="mb-3" >
                                            <Form.Label column sm="5">Price </Form.Label>
                                            <Col sm="7">
                                              <Form.Control className=" shadow-danger" type='number' name='price' onChange={handleChange} min="10" max="5000" placeholder={house.price} /><br />
                                            </Col>
                                          </Form.Group>

                                          <Form.Group as={Row} className="mb-5" >
                                            <Form.Label column sm="5">Capacity </Form.Label>
                                            <Col sm="7">
                                              <Form.Select className=" shadow-danger" aria-label="Default select example" name="capacity" onChange={handleChange}>
                                                <option selected disabled>{house.capacity}</option>
                                                <option value="1" >1</option>
                                                <option value="2" >2</option>
                                                <option value="3" >3</option>
                                                <option value="4" >4</option>
                                                <option value="5" >5</option>
                                                <option value="6" >6</option>
                                                <option value="7" >7</option>
                                                <option value="8" >8</option>
                                                <option value="9" >9</option>
                                                <option value="10" >10</option>
                                                <option value="11" >11</option>
                                                <option value="12" >12</option>
                                                <option value="13" >13</option>
                                                <option value="14" >14</option>
                                                <option value="15" >15</option>
                                                <option value="16" >16</option>
                                                <option value="17" >17</option>
                                                <option value="18" >18</option>
                                                <option value="19" >19</option>
                                                <option value="20" >20</option>
                                              </Form.Select>
                                            </Col>
                                          </Form.Group>

                                          <Form.Group className="d-flex justify-content-xl-between" id="formGridCheckbox" style={{ fontSize: 12, color: 'grey' }}>
                                            <Form.Check type="checkbox" checked={checkedInfo ? checkedInfo.Wifi : house.assets.Wifi} name="Wifi" label="Wifi" onClick={handleChecked} />
                                            <Form.Check type="checkbox" checked={checkedInfo ? checkedInfo.swimmingPool : house.assets.swimmingPool} name="swimmingPool" label="Swimming pool" onClick={handleChecked} />
                                            <Form.Check type="checkbox" checked={checkedInfo ? checkedInfo.tv : house.assets.tv} name="tv" label="TV" onClick={handleChecked} />
                                            <Form.Check type="checkbox" checked={checkedInfo ? checkedInfo.airConditioner : house.assets.airConditioner} name="airConditioner" label="Air conditioner" onClick={handleChecked} />
                                            <Form.Check type="checkbox" checked={checkedInfo ? checkedInfo.carPark : house.assets.carPark} name="carPark" label="Car park" onClick={handleChecked} />
                                            <Form.Check type="checkbox" checked={checkedInfo ? checkedInfo.garden : house.assets.garden} name="garden" label="Garden" onClick={handleChecked} />
                                          </Form.Group>
                                        </Form>
                                      </Modal.Body>

                                      <Modal.Footer>
                                        <Button variant="secondary" style={{ width: 100, height: 30 }} type='submit' onClick={(e) => handleSubmit(e, house._id)}> Edit </Button>
                                      </Modal.Footer>
                                    </Modal>
                                  </li>
                                  <li>
                                    <a onClick={handleShowEditImage} className="book-now text-center" >
                                      <i className="fa fa-camera"></i></a>
                                    <Modal style={{ backgroundColor: 'transparent', padding: 50 }} show={showEditImage} onHide={handleCloseEditImage} animation={false} >
                                      <Modal.Header >
                                        <Modal.Title > Edit the pictures of the house </Modal.Title>
                                        <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseEditImage}></button>
                                      </Modal.Header>
                                      <Modal.Body className="ml-2 mr-2">
                                        <Form.Control className=" shadow-danger" type='file' name='file' multiple accept="image/png, image/jpeg" onChange={(e) => handleUpdateImages(e, house._id)} /><br />
                                      </Modal.Body>
                                    </Modal>
                                  </li>
                                  <li>
                                    <a onClick={handleShowDelete} className="book-now text-center" >
                                      <i className="fa fa-trash"></i></a>
                                    <Modal style={{ backgroundColor: 'transparent', padding: 50 }} show={showDelete} onHide={handleCloseDelete} animation={false} >
                                      <Modal.Body className="ml-2 mr-2">
                                        <Form.Group as={Row} className="mb-3" >
                                          <Col sm="2">
                                            <img src="https://img.icons8.com/glyph-neue/64/fa314a/warning-shield.png" />
                                          </Col>
                                          <Form.Label column sm="10">Are you sure you want to delete this house ?
                                            <h5 > It will be deleted immediately. You can't undo this action.</h5></Form.Label>
                                        </Form.Group>
                                      </Modal.Body>
                                      <Modal.Footer>
                                        <Button variant="secondary" style={{ width: 100, height: 30 }} type='submit' onClick={(e) => {
                                          e.preventDefault();
                                          dispatch(deleteHouse(house._id));
                                          history.push('/houseshost')
                                        }}> Yes </Button>
                                        <Button variant="danger" style={{ width: 100, height: 30 }} type='submit' onClick={handleCloseDelete} > No </Button>
                                      </Modal.Footer>
                                    </Modal>
                                  </li>
                                </>
                              )}
                            </> :
                            true}
                        </ul>

                        <div className="tab-content">
                          <div className="tab-pane active" id="details">
                            <br /><h2 style={{ marginLeft: 60, marginTop: 20 }}> Description</h2><br />
                            <div className="col-lg-10">
                              <div className="card overflow-auto" style={{ width: '100%', height: '100%', textAlign: 'justify', textJustify: 'inter-word', fontSize: '1.2em', marginLeft: 40, backgroundColor: 'transparent' }}>
                                <div className="card-body" >
                                  {house.description}
                                </div>
                              </div>
                            </div>

                            <div className="item">
                              <div className="right-content align-self-center">
                                <span className="price"><div className="icon"><img src="https://img.icons8.com/ios-glyphs/30/ffffff/map-marker.png" /></div> {house.country} , {house.city}</span>
                                <span className="price"><div className="icon"><img src="https://img.icons8.com/ios-glyphs/30/ffffff/price-tag-euro.png" /></div> {house.price} DT / night</span>
                                <span className="price"><div className="icon"><img src="https://img.icons8.com/ios-glyphs/30/ffffff/compare-heights.png" /></div> {house.capacity} people</span>

                                <br /><h2>What this place offers:</h2><br />
                                <ul className="info">
                                  <div className="row" style={{ margin: 20 }}>
                                    <ul className="col-lg-6">
                                      <li><img src="https://img.icons8.com/ios-glyphs/30/000000/bedroom.png" /> {house.nbr_room} Bedrooms</li>
                                      <li><img src="https://img.icons8.com/ios-glyphs/30/000000/empty-bed.png" /> {house.nbr_bed} Beds</li>
                                      <li><img src="https://img.icons8.com/ios-glyphs/30/000000/shower-and-tub.png" /> {house.nbr_bathroom} Bathrooms</li>
                                    </ul>
                                    <ul className="col-lg-6">
                                      {house.assets.Wifi ? <li><img src="https://img.icons8.com/ios-glyphs/30/000000/wifi--v1.png" /> {house.assets.Wifi} Wifi</li> : true}
                                      {house.assets.tv ? <li><img src="https://img.icons8.com/ios-glyphs/30/000000/tv.png" /> {house.assets.tv} TV </li> : true}
                                      {house.assets.airConditioner ? <li><img src="https://img.icons8.com/ios-glyphs/30/000000/air-conditioner.png" />{house.assets.airConditioner} Air conditioner </li> : true}
                                      {house.assets.swimmingPool ? <li><img src="https://img.icons8.com/ios-glyphs/30/000000/outdoor-swimming-pool--v2.png" /> {house.assets.swimmingPool}Swimming pool</li> : true}
                                      {house.assets.garden ? <li><img src="https://img.icons8.com/ios-glyphs/30/000000/garden.png" /> {house.assets.garden} Garden</li> : true}
                                      {house.assets.carPark ? <li><img src="https://img.icons8.com/ios-glyphs/50/000000/garage.png" /> {house.assets.carPark} Car park</li> : true}
                                    </ul>
                                  </div>

                                </ul>
                              </div>

                            </div>
                          </div>

                          <div className="tab-pane" id="reviews">
                            <div id="rate" style={{ paddingTop: "30px" }}>
                              <div className="row pl-2" style={{ overflowY: 'scroll', overflowX: 'hidden' }} >

                                <h2>Give your Review </h2>


                                {user.isAuth ?
                                  <div>
                                    {user.userInfo._id !== house.host._id && user.userInfo.role !== "admin" &&
                                      (
                                        <>
                                          <div className="col-lg-12">
                                            <div style={{ fontSize: "20px" }}>
                                              <ReactStars
                                                count={5}
                                                onChange={(value) => setRate(value)}
                                                size={24}
                                                activeColor="#ffd700"
                                              />

                                            </div>
                                          </div>
                                          <form>
                                            <div className="col-lg-7">
                                              <fieldset>
                                                <textarea name="message" type="text" className="form-control shadow-danger" id="message" placeholder="Message" required="" onChange={(e) => setCommentInfo(e.target.value)}></textarea>
                                              </fieldset>
                                            </div>
                                            <div className="col-lg-12">
                                              <fieldset>
                                                <button type="submit" id="form-submit" className="main-button " onClick={(e) => handleReviewSubmit(e, house._id)}> Send review</button>
                                              </fieldset>
                                            </div>
                                          </form>
                                        </>
                                      )}
                                  </div>
                                  :
                                  <Card className="mt-3 mb-2 ml-4 w-50" style={{ backgroundColor: 'transparent' }}>
                                    <Link to='/login'> Please Sign In to write your review. </Link>
                                  </Card>
                                }
                                {house.reviews.length === 0 && <h3 className="mt-4">No reviews</h3>}
                                {house.reviews.map((review) => {
                                  return (
                                    <>
                                      {!review.reviewOwner ?
                                        <>
                                          <div key={review._id} className="overflow-auto pt-2 pl-4 mt-3" >
                                            <span style={{ fontSize: "20px" }}> User of Edar DarCom </span>
                                            <span className="details">  {moment(review.createdAt).format("DD/MM/YYYY")} </span>
                                            <div style={{ fontSize: 18 }}>
                                              <ReactStars
                                                edit={false}
                                                value={review.rating}
                                              />
                                            </div>
                                            <span style={{ fontSize: 18 }}>{review.comment} </span>
                                            <hr className="w-50" />
                                          </div>
                                        </>
                                        :
                                        <>
                                          <div className="overflow-auto pt-2 pl-4 mt-3" >
                                            <span style={{ fontSize: "20px" }}> {review.reviewOwner.firstName} {review.reviewOwner.lastName} </span>
                                            <span className="details">  {moment(review.createdAt).format("DD/MM/YYYY")} </span>
                                            <div style={{ fontSize: 18 }}>
                                              <ReactStars
                                                edit={false}
                                                value={review.rating}
                                              />
                                            </div>
                                            <span style={{ fontSize: 18 }}>{review.comment} </span>
                                            <hr className="w-50" />
                                          </div>
                                        </>
                                      }
                                    </>
                                  );
                                })}
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 mt-5">
                      <div className="card mt-5">
                        <img className="img-responsive rounded-circle mb-3 mx-auto" src={house.host.image.imageURL} style={{ width: 200, height: 200 }} alt="host-avatar" />
                        <span className="text-center">
                          <h5>Member since {moment(house.host.joinedAt).format("DD/MM/YYYY")}</h5>

                        </span>
                        <div className="card-body">
                          <ul>
                            <h5 className="card-title text-center ">
                              <i className="glyphicon glyphicon-user"></i>
                              <span style={{ fontSize: "15px" }}> { } {house.host.firstName} {house.host.lastName} </span>
                            </h5>

                            <li className="card-text text-center">
                              <i className="fa fa-envelope"></i>
                              <span style={{ fontSize: "15px" }}>{ } {house.host.email}</span>
                            </li>
                            <li className="card-text text-center">
                              <i className="glyphicon glyphicon-earphone"></i>
                              <span style={{ fontSize: "15px" }}>{ } {house.host.phone}</span>
                            </li>
                            {user.isAuth ?
                              <>
                                {user.userInfo._id !== house.host._id ?
                                  <>
                                    {user.userInfo.role !== "admin" && (
                                      <>
                                        <li className="card-text text-center mt-3">
                                          <Button variant="secondary" onClick={(e) => handleSend(e, house.host._id)} className="book-now text-center" > Message </Button>
                                        </li>
                                        <li className="card-text text-center mt-3">
                                          <Button variant="outline-danger" onClick={handleShowReport} className="book-now text-center" >
                                            <i className="fa fa-ban"></i> Report host</Button>
                                          <Modal style={{ backgroundColor: 'transparent', padding: 50 }} show={showReport} onHide={handleCloseReport} animation={false} >
                                            <Modal.Header >
                                              <Modal.Title > Write a report </Modal.Title>
                                              <button type="button" className="btn-close" aria-label="Close" onClick={handleCloseReport}></button>
                                            </Modal.Header>
                                            <Modal.Body className="ml-2 mr-2">
                                              <Form.Group as={Row} className="mb-3" >
                                                <Form.Label column sm="4">Write the cause of report </Form.Label>
                                                <Col sm="8">
                                                  <Form.Control className=" shadow-danger" as="textarea" type='text' name='message' onChange={(e) => setMessage(e.target.value)} placeholder="" /><br />
                                                </Col>
                                              </Form.Group>
                                            </Modal.Body>
                                            <Modal.Footer>
                                              <Button variant="danger" style={{ width: 100, height: 30 }} type='submit' onClick={(e) => handleSubmitReport(e, house.host._id)}> Send </Button>
                                            </Modal.Footer>
                                          </Modal>
                                        </li>
                                      </>
                                    )}
                                  </>
                                  : true}
                              </>
                              : true}

                          </ul>
                        </div>
                      </div>
                      {user.isAuth ?
                        <>
                          {user.userInfo.role !== "admin" && (

                            <div className="card sticky mt-5" /* style={{paddingBottom:"25px", position:"sticky"}} */>

                              <DateRange className=""
                                //ranges={[selectionRange]}
                                //onChange={(range)=>console.log(range)}
                                editableDateInputs={false}
                                onChange={item => setDateInterval([item.selection])}
                                moveRangeOnFirstSelection={false}
                                ranges={dateInterval}
                                minDate={addDays(new Date(), 1)}
                                dateDisplayFormat="dd/MM/yyyy"
                              />
                              {user.userInfo._id !== house.host._id && (

                                <form id="contact">
                                  <div className="row">
                                    <button id="form-submit" className="main-button " onClick={(e) => handleCheckAvailability(e)}> Check availability</button>
                                  </div>
                                  <br />
                                  <Link to={{
                                    pathname: `/reservation/${houseId}`
                                  }}>
                                    <div className="row">

                                      <button id="form-submit" className="main-button " style={{ backgroundColor: "#ee5057" }}  > Reserve
                                      </button>
                                    </div>
                                  </Link>
                                </form>
                              )}
                              {/* <ReservationModal handleCloseReserv={handleCloseReserv}
                        showReserv={showReserv}
                        reservation={reservation}
                        startDate={arrivalDate}
                        endDate={releaseDate}
                        houseId={params.id} />*/}
                            </div>
                          )}
                        </>
                        :
                        <div className="card sticky mt-5" /* style={{paddingBottom:"25px", position:"sticky"}} */>

                          <DateRange className=""
                            //ranges={[selectionRange]}
                            //onChange={(range)=>console.log(range)}
                            editableDateInputs={false}
                            onChange={item => setDateInterval([item.selection])}
                            moveRangeOnFirstSelection={false}
                            ranges={dateInterval}
                            minDate={addDays(new Date(), 1)}
                            dateDisplayFormat="dd/MM/yyyy"
                          />
                          <form id="contact">
                            <div className="row">
                              <button id="form-submit" className="main-button " onClick={(e) => handleCheckAvailability(e)}> Check availability</button>
                            </div>
                            <br />
                            {user.isAuth ?
                              <>
                                {user.userInfo.isBlocked === false ?
                                  <Link to={{
                                    pathname: `/reservation/${houseId}`
                                  }}>
                                    <div className="row">

                                      <button id="form-submit" className="main-button " style={{ backgroundColor: "#ee5057" }}
                                      > Reserve
                                      </button>
                                    </div>
                                  </Link>
                                  :
                                  <div className="row">
                                    <button id="form-submit" className="main-button "
                                      onClick={() => alert.error(<div style={{ textTransform: 'none' }}> Your account is banned ! Please contact the administrator for more information. </div>,
                                        { position: 'middle' })
                                      } style={{ backgroundColor: "#ee5057" }}
                                    > Reserve
                                    </button>
                                  </div>
                                }
                              </>
                              :
                              <Link to={{
                                pathname: "/login"
                              }}>
                                <div className="row">

                                  <button id="form-submit" className="main-button " style={{ backgroundColor: "#ee5057" }}
                                  > Reserve
                                  </button>
                                </div>
                              </Link>
                              }
                          </form>
                        </div>
                      }
                    </div>
                  </div>

                  <hr />
                  <div className="col-lg-12">
                    <div id="map">
                      <br /><h2 className="ml-5 mt-5"> Location</h2><br />
                      <iframe src="https://maps.google.com/maps?q=Av.+L%C3%BAcio+Costa,+Rio+de+Janeiro+-+RJ,+Brazil&t=&z=13&ie=UTF8&iwloc=&output=embed" width="100%" height="350px" frameBorder="0" style={{ border: "0" }} allowFullScreen></iframe>
                    </div>

                  </div >
                </div >
              </div >

            }

            <br />
            <br />
          </div >
        </>
      }
      <ToastContainer />
    </>
  )
}
export default HouseDetails