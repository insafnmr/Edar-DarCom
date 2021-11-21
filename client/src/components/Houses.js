import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getHouses, filterHouses,filterAuthHouses } from '../redux/houseSlice';
import '../styles/housesByHost.css'
import '../templateStyle/style.css';
import '../templateStyle/priceRange.css';
import '../templateStyle/datepicker.css';
import DisplayHouses from './DisplayHouses';
import moment from 'moment'
import Slider, { Range } from 'rc-slider';

const Houses = () => {

  const houses = useSelector((state) => state.house)
    const user = useSelector((state) => state.user);

  const dispatch = useDispatch()
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [guest, setGuest] = useState(1);
  const [room, setRoom] = useState(1);  
  

  useEffect(() => {
    dispatch(getHouses())
  }, []);

  const ref1 = useRef();
  const ref2 = useRef();
  const [min, setMin] = useState(20);
  const [max, setMax] = useState(900);

  const [priceInterval, setPriceInterval] = useState([20, 900]);

  const onSliderChange = (value) => {
    setPriceInterval(value);

  };

  const handleSearchBtn = (e) => {
    e.preventDefault()
    var arrivalDate = moment(checkIn).format("YYYY/MM/DD");
    var releaseDate = moment(checkOut).format("YYYY/MM/DD");
   
    if (!moment(arrivalDate).isValid()) arrivalDate = "";
    if (!moment(releaseDate).isValid()) releaseDate = "";
  dispatch(filterHouses({ arrivalDate, releaseDate, city, guest, room, priceInterval, country }))


    }

  return (
    <>
      {houses.loading ?
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
          <div className="main-banner container-top" style={{ marginTop: 80 }}>
            <div className="container">
              <div className="row">
                <div className="col-lg-12">
                  <div className="top-text header-text">
                    <h2>Find Nearby Houses</h2>
                  </div>
                </div>
                <div className="col-lg-12">
                  <div className="tm-section tm-bg-img" id="tm-section-1">
                    <div className="tm-bg-white ie-container-width-fix-2">
                      <div className="container ie-h-align-center-fix">
                        <div className="row">
                          <div className="col-xs-12 ml-auto mr-auto ie-container-width-fix">
                            <form className="tm-search-form tm-section-pad-2">
                              <div className="form-row tm-search-form-row">
                                <div className="form-group tm-form-element tm-form-element-100 tm-form-element-2">
                                  <i className="fa fa-map-marker fa-2x tm-form-element-icon"></i>
                                  <select name="country" type="text" className="form-control" id="inputState" value={country} onChange={(e) => setCountry(e.target.value)} style={{ height: "40px" }}>
                                    <option value="" >Select your destination</option>
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
                                  </select>
                                </div>
                                <div className="form-group tm-form-element tm-form-element-100 tm-form-element-2">
                                  <select name="guests" className="form-control tm-select" onChange={(e) => setGuest(e.target.value)} style={{ height: "40px" }} id="adult">
                                    <option value="">Guests</option>
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
                                  <i className="fa fa-2x fa-user tm-form-element-icon"></i>
                                </div>
                                <div className="form-group tm-form-element tm-form-element-50 tm-form-element-2">
                                  <i className="fa fa-calendar fa-2x tm-form-element-icon"></i>
                                  <input name="check-in" type="text" className="form-control" ref={ref1} onFocus={() => (ref1.current.type = "date")} style={{ height: "40px" }} value={checkIn} onChange={(e) => setCheckIn(e.target.value)} placeholder="Check In" />
                                </div>

                                <div className="form-group tm-form-element tm-form-element-50 tm-form-element-2">
                                  <Range defaultValue={priceInterval}
                                    allowCross={false}
                                    min={min}
                                    max={max}
                                    onChange={(val) => onSliderChange(val)}
                                  />

                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-between",
                                      marginTop: "1rem",
                                      fontWeight: 500,
                                      color: "#ee5057"
                                    }}
                                  >
                                    <div>{`${priceInterval[0]} DT`}</div>
                                    <div>{`${priceInterval[1]} DT`}</div>
                                  </div>
                                </div>
                              </div>

                              <div className="form-row tm-search-form-row">
                                <div className="form-group tm-form-element tm-form-element-2">
                                  <i className="fa fa-map-marker fa-2x tm-form-element-icon"></i>
                                  <input name="city" type="text" className="form-control" id="inputCity" value={city} onChange={(e) => setCity(e.target.value)} style={{ height: "40px" }} placeholder="Type your destination (city)..." />


                                </div>

                                <div className="form-group tm-form-element tm-form-element-2">
                                  <select name="rooms" className="form-control tm-select" id="room" onChange={(e) => setRoom(e.target.value)} style={{ height: "40px" }}>
                                    <option value="">Rooms</option>
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
                                  <i className="fa fa-2x fa-bed tm-form-element-icon"></i>
                                </div>

                                <div className="form-group tm-form-element tm-form-element-2">
                                  <i className="fa fa-calendar fa-2x tm-form-element-icon"></i>
                                  <input name="check-out" type="text" className="form-control" ref={ref2} onFocus={() => (ref2.current.type = "date")} style={{ height: "40px" }} value={checkOut} onChange={(e) => setCheckOut(e.target.value)} placeholder="Check Out" />

                                </div>
                                <div className="form-group tm-form-element tm-form-element-2">
                                  <button onClick={(e) => handleSearchBtn(e)} className="btn btn-primary-filter tm-btn-search" style={{height: 38}}>Filter</button>
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
            </div>
          </div>
          <DisplayHouses houses={houses.houses} />
        </>
      }

    </>
  );
}
export default Houses