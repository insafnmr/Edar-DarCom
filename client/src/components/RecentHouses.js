import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

import { getRecentHouses } from '../redux/houseSlice'
import ReactStars from "react-rating-stars-component";


const RecentHouses = () => {
  const dispatch = useDispatch();
  const house = useSelector((state) => state.house);

  useEffect(() => {
    dispatch(getRecentHouses())
  }, []);
  
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
          <div className="recent-listing">
            <div className="container">
              <div className="row">
                <div className="col-xs-12">
                  <div className="section-heading">
                    <h2>Recently added houses</h2>
                    <h6>Check Them Out</h6>
                  </div>
                </div>
                <div className="col-xs-12">
                  <OwlCarousel items={1}
                    className="owl-theme"
                    loop
                    nav
                    margin={3}
                    autoplay={true} >
                    {
                      house.recentHouses.map((home) => (
                        <div key={home._id}>
                          <div className="item" >
                            <div className="row">
                              <div className="col-lg-12">
                                <div className="listing-item">
                                  <div className="left-image">
                                    <img src={home.image[0].imageURL} style={{ width: 500, height: 400 }} />
                                  </div>
                                  <div className="right-content align-self-center">
                                    <h4>{home.title}</h4>
                                    <h6>by: {home.host.firstName} {home.host.lastName}</h6>
                                    <ul className="rate">
                                      <li>
                                        <ReactStars
                                          edit={false}
                                          isHalf={true}
                                          value={home.rating}
                                          size={20}
                                        />
                                      </li>
                                      <li>{home.reviews.length} Review(s)</li>
                                    </ul>

                                    <span className="price"><div className="icon"><img src="assets/icons/place.png" alt="" /> </div> {home.country}, {home.city}</span>
                                    <span className="price"><div className="icon"><img src="assets/images/listing-icon-01.png" alt="" /></div> {home.price} DT / night </span>
                                    <ul className="info">
                                      <li><img src="assets/images/listing-icon-02.png" alt="bedrooms" /> {home.nbr_room} Bedrooms</li>
                                      <li><img src="assets/images/listing-icon-03.png" alt="bathrooms" /> 2 Bathrooms</li>
                                    </ul>
                                    <div className="main-white-button">
                                      <Link to={{
                                        pathname: `/housedetails/${home._id}`,
                                        state: {
                                          home: { home },
                                          key: home._id
                                        },
                                      }}>
                                        <i className="fa fa-eye"></i> view details</Link>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </OwlCarousel>
                </div>
              </div>
            </div>
          </div>
        </>
      }
    </>


  );
}
export default RecentHouses;