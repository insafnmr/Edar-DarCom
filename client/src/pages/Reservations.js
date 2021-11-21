import React, { useEffect, useState } from 'react';
import '../templateStyle/style.css';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import moment from 'moment'
import Paginations from '../components/Pagination';
import { getHousesByHost } from '../redux/houseSlice';
import { addDays } from 'date-fns';
import { getReservationsByHouse } from '../redux/reservationSlice'
import ReactStars from "react-rating-stars-component";

const Reservations = ({ history }) => {

  const dispatch = useDispatch();
  const house = useSelector((state) => state.house);
  const user = useSelector((state) => state.user);
  const reservation = useSelector((state) => state.reservation);

  const [currentPage, setCurrentPage] = useState(1);
  const [housesPerPage] = useState(3);
  const [active, setActive] = useState(1);

  useEffect(() => {
    if (!user.isAuth)
      history.push('/login');
  }, [user.isAuth]);

  // Get current houses
  const indexOfLastHouse = currentPage * housesPerPage;
  const indexOfFirstHouse = indexOfLastHouse - housesPerPage;
  const currentHouses = house.houses.slice(indexOfFirstHouse, indexOfLastHouse);

  // Change page
  const paginate = pageNumber => { setCurrentPage(pageNumber); setActive(pageNumber) };

  const nextPage = () => {
    if (currentPage < Math.ceil(house.houses.length / housesPerPage)) {
      setCurrentPage(currentPage + 1)
      setActive(currentPage + 1);
    }

  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      setActive(currentPage - 1)
    };
  }

  const [dateInterval, setDateInterval] = useState([
    {
      startDate: addDays(new Date(), 1),
      endDate: addDays(new Date(), 3),
      key: 'selection'
    }
  ]);

  const arrivalDate = moment(dateInterval[0].startDate).format("YYYY/MM/DD");
  const releaseDate = moment(dateInterval[0].endDate).format("YYYY/MM/DD");

  return (

    <div style={{ margin: "100px" }}>

      <div className="recent-listing">
        <div className="container">
          <div className="row">
            <div className="col-xs-12">
              {
                reservation.reservations.length > 0 ?
                  <>
                    {
                      reservation.reservations.map((reservation) => (
                        <>

                          <div key={reservation._id} className="item">
                            <div className="row">
                              <div className="col-lg-12">
                                <div className="listing-item">
                                  <div className="right-content align-self-center">  <p style={{ fontSize: "1.4em" }}> check in: <span style={{ color: "red" }}>{moment(reservation.arrivalDate).format("DD/MM/YYYY")}</span></p>
                                    <h4>{reservation.house.title}</h4>
                                    <ul className="rate">
                                      <li><p style={{ fontSize: "1.4em" }}> check out: <span style={{ color: "red" }}>{moment(reservation.releaseDate).format("DD/MM/YYYY")}</span></p>
                                        <h4> Reserved By: {reservation.client.firstName} {reservation.client.lastName}</h4>
                                        <span className="price"><div className="icon"><img src="https://img.icons8.com/ios-glyphs/30/ffffff/compare-heights.png" alt="" /></div> {reservation.total_guests}  Guests</span>
                                        <span className="price"><div className="icon"><img src="assets/images/listing-icon-01.png" alt="" /></div> {reservation.nbr_nights} Nights</span>
                                      </li>
                                    </ul>

                                    <span className="price"><div className="icon"><img src="assets/icons/place.png" alt="" /> </div> {reservation.house.country} {reservation.house.city}</span>
                                    <span className="price"><div className="icon"><img src="https://img.icons8.com/ios-glyphs/30/ffffff/price-tag-euro.png" alt="" /></div> {reservation.total_price} DT in Total</span>

                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
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
      </div>

    </div>

  )
}

export default Reservations
