
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getHouseDetails } from '../redux/houseSlice'
import { useParams, useHistory } from "react-router-dom";
import MultiStep from 'react-multistep';
import { Modal, Form, Row, Col, Card } from 'react-bootstrap';
import 'react-date-range/dist/styles.css'; // main style file
import 'react-date-range/dist/theme/default.css'; // theme css file
import { DateRangePicker, DateRange } from 'react-date-range';
import moment from 'moment'
import { addDays } from 'date-fns';
import * as dayjs from 'dayjs'
import { MultiStepForm, Step } from 'react-multi-form';
import Input from './input';
import Button from './button'
import { useAlert } from 'react-alert'

import { checkAvailability, addReservation } from '../redux/reservationSlice'


const ReservationProcess = () => {
  const house = useSelector((state) => state.house.house);
  const user = useSelector((state) => state.user);
  const reservation = useSelector((state) => state.reservation);

  const dispatch = useDispatch();
  const params = useParams();
  let history = useHistory();
  const alert = useAlert()

  useEffect(() => {
    if (!user.isAuth)
      history.push('/login');
  }, [user.isAuth]);

  useEffect(() => {
    dispatch(getHouseDetails(params.id));
  }, []);

  const [dateInterval, setDateInterval] = useState([
    {
      startDate: addDays(new Date(), 1),
      endDate: addDays(new Date(), 7),
      key: 'selection'
    }
  ]);
  const arrivalDate = moment(dateInterval[0].startDate).format("YYYY/MM/DD");
  const releaseDate = moment(dateInterval[0].endDate).format("YYYY/MM/DD");

  const [info, setInfo] = useState({
    adult: '',
    child: '',
  });
  const handleChange = e => {
    setInfo({ ...info, [e.target.name]: e.target.value });
  };

  const [payment, setPayment] = useState({
    card_nbr: '',
    name: '',
    expiry: '',
    CVC: '',
  });
  const handlePaymentChange = e => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };
  const [msg, setMsg] = useState('')


  const [active, setActive] = React.useState(1)
  const nbr_nights = moment(dateInterval[0].endDate).diff(moment(dateInterval[0].startDate), 'days')
  const total_guests = Number(info.adult) + Number(info.child)
  const total_price = nbr_nights * house.price;
  useEffect(() => {
    const houseId = house._id
    dispatch(checkAvailability({ houseId, arrivalDate, releaseDate }))
  }, [dateInterval])


  const checkReserv = (e) => {
    e.preventDefault()
    if ((nbr_nights < 1) || (total_guests < 1) || (Number(info.adult) < 1)) {
      setMsg("Please fill all the fields")
    } else if (house.capacity < total_guests) {
      setMsg('You exceeded the house capacity')
    } else if (reservation.reservation.reserved) {
      setMsg(reservation.reservation.message)
      console.log(reservation)
    } else {
      setMsg('')
      setActive(active + 1)
    }
  };

  const onReservSubmit = e => {
    e.preventDefault()
    const houseId = house._id
    const paymentMode = "Cash"
    const payed = true
    if (user.userInfo.isBlocked === false) {
      dispatch(addReservation({ arrivalDate, releaseDate, paymentMode, payed, house: houseId, total_price, total_guests, nbr_nights }))
    }
    else {
      alert.error(<div style={{ textTransform: 'none' }}> Your account is banned ! Please contact the administrator for more information. </div>,
        { position: 'middle' })
    }

    console.log(payment)
    history.push(`/profile#reservations`);
  };

  return (
    <div style={{ margin: "100px" }}>
      <>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="inner-content">
                <div className="row">
                  <div className="col-lg-6">
                    <div style={{ paddingTop: "90px" }}>
                      <img src="../assets/images/datePicker.png" />
                    </div>
                  </div>
                  <div className="col-lg-6 align-self-center">
                    <form  >
                      <div className="row" >
                        {/*                                              <center>  <MultiStep showNavigation={true} nextStyle={{backgroundColor:"red"}} steps={steps} handleChange={handleChange} startDate={startDate} endDate={endDate} /> </center>
 */}
                        <MultiStepForm activeStep={active} accentColor="#ee5057">
                          <Step label='Reservation Details' >

                            <div style={{ marginTop: "100px" }}>
                              <h3 style={{ textAlign: 'center' }}>Reservation Details</h3>
                              <div className="col-lg-12"><b>Number of guests</b>
                              </div>
                              <div className="col-lg-6">
                                <fieldset>
                                  <div className="form-group tm-form- element tm-form-element-2">
                                    <select name="adult" className="form-control tm-select" style={{ height: "40px" }} id="adult" onChange={handleChange} >
                                      <option value="">Adult</option>
                                      <option value="1">1</option>
                                      <option value="2">2</option>
                                      <option value="3">3</option>
                                      <option value="4">4</option>
                                      <option value="5">5</option>
                                      <option value="6">6</option>
                                      <option value="7">7</option>
                                      <option value="8">8</option>
                                      <option value="9">9</option>
                                      <option value="10">10</option>
                                    </select>
                                    {/* <i className="fa fa-2x fa-user tm-form-element-icon"></i>  */}
                                  </div>
                                </fieldset>
                              </div>

                              <div className="col-lg-6">
                                <fieldset>
                                  <div className="form-group tm-form-element tm-form-element-2">
                                    <select name="child" className="form-control tm-select" style={{ height: "40px" }} id="child" onChange={handleChange}>
                                      <option value="">Child</option>
                                      <option value="0">0</option>
                                      <option value="1">1</option>
                                      <option value="2">2</option>
                                      <option value="3">3</option>
                                      <option value="4">4</option>
                                      <option value="5">5</option>
                                      <option value="6">6</option>
                                      <option value="7">7</option>
                                      <option value="8">8</option>
                                      <option value="9">9</option>
                                    </select>
                                    {/*  <i className="fa fa-2x fa-user tm-form-element-icon"></i> */}
                                  </div>
                                </fieldset>
                              </div>
                              <div className="col-lg-12"> <b>Select Dates</b>
                              </div>

                              <DateRange className="col-lg-12"
                                //ranges={[selectionRange]}
                                //onChange={(range)=>console.log(range)}
                                editableDateInputs={false}
                                months={2}
                                direction="horizontal"
                                onChange={item => setDateInterval([item.selection])}
                                moveRangeOnFirstSelection={false}
                                ranges={dateInterval}
                                minDate={addDays(new Date(), 1)}
                                dateDisplayFormat="dd/MM/yyyy"
                              />

                              <p style={{ color: "red" }}>{msg}</p>
                            </div>
                          </Step>
                          <Step label='confirmation'>

                            <div style={{ margin: "100px 0px" }}>
                              <h3 style={{ textAlign: 'center' }}>Confirmation</h3>
                              <div className="col-lg-12">
                                <fieldset>
                                  <div className="form-group tm-form- element tm-form-element-2">
                                    {/*                                     <i className="fa fa-map-marker fa-2x tm-form-element-icon"></i> */}
                                    <b> Total nights to stay:  </b><br />
                                    <input name="nbr_nights" type="text" className="form-control" disable value={nbr_nights} style={{ height: "40px", marging: "20px 0px" }} />

                                  </div>
                                </fieldset>
                              </div>
                              <div className="col-lg-12">
                                <fieldset>
                                  <div className="form-group tm-form- element tm-form-element-2">
                                    {/*                                     <i className="fa fa-map-marker fa-2x tm-form-element-icon"></i> */}
                                    <b> Total Price (DT):  </b><br />
                                    <input name="totalPrice" type="text" className="form-control" disable value={nbr_nights * house.price} style={{ height: "40px", marging: "20px 0px" }} />

                                  </div>
                                </fieldset>
                              </div>
                              <div className="col-lg-12">
                                <fieldset>
                                  <div className="form-group tm-form- element tm-form-element-2">
                                    {/*                                     <i className="fa fa-map-marker fa-2x tm-form-element-icon"></i> */}
                                    <b> Total guests:  </b><br />
                                    <input name="guests" type="text" className="form-control" disable value={total_guests} style={{ height: "40px", marging: "20px 0px" }} />

                                  </div>
                                </fieldset>
                              </div>

                            </div>

                          </Step>
                          <Step label='payement'>
                            <div style={{ margin: "100px 0px" }}>
                              <h3 style={{ textAlign: 'center' }}>Payment Information</h3>
                              <Input type="text" required placeholder="4444-4444-4444" label="Card Number" name="card_nbr" onChange={handlePaymentChange} />
                              <Input type="text" required placeholder="John Doe" label="Name on Card" name="name" onChange={handlePaymentChange} />

                              <div style={{ display: 'flex' }}>
                                <div style={{ flex: 1, paddingRight: 10 }}>
                                  <Input type="text" required placeholder="11/2024" label="Expiry Date" name="expiry" style={{ marginRight: 10 }} onChange={handlePaymentChange} />
                                </div>
                                <div style={{ flex: 1 }}>

                                  <Input type="text" required placeholder="000" label="CVC Code" name="CVC" onChange={handlePaymentChange} />
                                </div>
                              </div>
                            </div>
                          </Step>
                        </MultiStepForm>
                        <div className="col-lg-12">
                          {active !== 1 && (
                            <Button onClick={(e) => { e.preventDefault(); setActive(active - 1) }}>Previous</Button>
                          )}
                          {active !== 3 && (
                            <Button
                              onClick={(e) => checkReserv(e)}
                              style={{ float: 'right' }}
                            >
                              Next
                            </Button>
                          )}
                          {active == 3 && (
                            <Button
                              onClick={(e) => onReservSubmit(e)}
                              style={{ float: 'right' }}
                            >
                              submit
                            </Button>
                          )}


                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>


    </div>
  )
}
export default ReservationProcess





