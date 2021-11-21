import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/displayHouses.css'
import '../styles/housesByHost.css';
import { useDispatch, useSelector } from 'react-redux';
import ReactStars from "react-rating-stars-component";
import { Link, useHistory } from 'react-router-dom';
import Paginations from './Pagination'
import { addFavorite } from '../redux/favoriteSlice';
import Modal from './Modal'
import { useAlert } from 'react-alert'

const DisplayHouses = ({ houses }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [housesPerPage] = useState(8);
    const [active, setActive] = useState(1);

    // Get current houses
    const indexOfLastHouse = currentPage * housesPerPage;
    const indexOfFirstHouse = indexOfLastHouse - housesPerPage;
    const currentHouses = houses.slice(indexOfFirstHouse, indexOfLastHouse);
    // Change page
    const paginate = pageNumber => { setCurrentPage(pageNumber); setActive(pageNumber) };

    const nextPage = () => {
        if (currentPage < Math.ceil(houses.length / housesPerPage)) {
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

    return (

        <>
            <div className="second-theme-selling">

                {houses.length > 0 ?
                    <>
                        <div className="recent-listing">
                            <div className="container">
                                <div className="row">
                                    <div className="col-xs-12">
                                        <div className="section-heading">
                                            <h2 className="text-center">MAKE YOUR CHOICE</h2>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>



                        <div className="container">
                            <div className="row">
                                <AllHouses houses={currentHouses} loading={houses.loading} key={houses._id} />
                            </div>
                        </div>
                        <br />
                        <br />
                        <div className="container d-flex justify-content-center">
                            <div className="row">
                                <Paginations housesPerPage={housesPerPage}
                                    totalHouses={houses.length}
                                    paginate={paginate}
                                    nextPage={nextPage}
                                    prevPage={prevPage}
                                    active={active}
                                />
                            </div>
                        </div>
                    </>
                    : <h3 className="text-center">No available houses</h3>}
            </div>

        </>
    )
}

const AllHouses = ({ houses }) => {

    const alert = useAlert()
    const user = useSelector((state) => state.user);
    const history = useHistory()
    const dispatch = useDispatch();
    const handleLike = (houseId) => {
        if (user.userInfo.isBlocked === false) {
            dispatch(addFavorite({ id: houseId }));
        }
        else {
            alert.error(<div style={{ textTransform: 'none' }}> Your account is banned ! Please contact the administrator for more information. </div>,
                { position: 'middle' })
        }
    };

    const checkLike = (house) => {
        return house.likes.some((likeId) => likeId === user.userInfo._id);

    };
    return (
        <>
            {
                houses.map((home) => (
                    <>
                        <div key={home._id} className="col-xs-12 col-sm-6 col-md-3" >
                            <div className="sub-box" >
                                <div className="house-content" >
                                    <div className="house-grid" >
                                        <img className="img-responsive" src={home.image[0].imageURL} style={{ height: 150 }} alt="house" />
                                        <div className="house-price"><small>{home.price} dt /night</small></div>
                                        {user.isAuth ?
                                            <>
                                                {user.userInfo._id !== home.host._id && (
                                                    <>
                                                        {user.userInfo.isBlocked === true ?
                                                            <a className="book-now text-center"
                                                                onClick={() => alert.error(<div style={{ textTransform: 'none' }}> Your account is banned ! Please contact the administrator for more information. </div>,
                                                                    { position: 'middle' })}
                                                            >
                                                                <i className="fa fa-calendar"></i> Book Now</a>
                                                            :
                                                            <Link className="book-now text-center" to={{ pathname: `/reservation/${home._id}` }}>
                                                                <i className="fa fa-calendar"></i> Book Now</Link>
                                                        }
                                                    </>
                                                )}
                                            </>
                                            :
                                            <Link className="book-now text-center" to={{ pathname: `/reservation/${home._id}` }}>
                                                <i className="fa fa-calendar"></i> Book Now</Link>
                                        }
                                    </div>
                                </div>
                                <div className="sub-box-content">
                                    {user.isAuth && user.userInfo.role !== "admin" && user.userInfo._id !== home.host._id ?
                                        <i className='fa fa-heart float-right mt-3' onClick={() => handleLike(home._id)}
                                            style={
                                                checkLike(home)
                                                    ? { color: 'red' }
                                                    : { color: 'black' }
                                            }  ></i>
                                        : true}
                                    <ReactStars
                                        edit={false}
                                        isHalf={true}
                                        value={home.rating}
                                        size={20}
                                    />

                                    <h5>{home.title}</h5>
                                    <p className="description text-muted mb-5" style={{ height: 50, textOverflow: 'ellipsis', overflow: 'hidden' }}>
                                        {home.description}
                                    </p>
                                    <p className="infos" style={{ marginTop: -10 }}  >
                                        <Link to={{
                                            pathname: `/housedetails/${home._id}`,
                                            state: {
                                                home: { home },
                                                key: home._id
                                            },
                                        }}>
                                            <i className="fa fa-eye"></i> view details</Link>
                                    </p>
                                    <Modal home={home} />
                                </div>

                            </div>

                        </div>
                    </>
                ))}

        </>
    );
}

export default DisplayHouses