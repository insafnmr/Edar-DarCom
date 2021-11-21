import React, { useEffect, useState } from 'react';
import '../styles/housesByHost.css'
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { deleteHouse, getHousesByHost } from '../redux/houseSlice';
import { getReservationsByHouse } from '../redux/reservationSlice';
import ReactStars from "react-rating-stars-component";
import Paginations from '../components/Pagination';
import Reservations from './Reservations';
import { Modal, Button, Form, Row, Col, Card } from 'react-bootstrap';

const HousesHost = ({ history }) => {

    const dispatch = useDispatch();
    const house = useSelector((state) => state.house);
    const user = useSelector((state) => state.user);
    const [currentPage, setCurrentPage] = useState(1);
    const [housesPerPage] = useState(3);
    const [active, setActive] = useState(1);

    useEffect(() => {
        if (!user.isAuth) {
            history.push('/login');
        } else {
            dispatch(getHousesByHost())
        }
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
                    <div className="text-center" style={{ paddingTop: 100 }}>
                        <div className="container">
                            <div className="row">
                                <div className="col-xs-12">
                                    <div className="section-heading">
                                        <h2 className="text-center">My houses</h2>
                                        <br />
                                        <br />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="container">
                        <div className="row">
                            <Houses houses={currentHouses} loading={house.loading} />
                        </div>
                    </div>
                    <div className="container d-flex justify-content-center">
                        <div className="row">
                            <Paginations housesPerPage={housesPerPage}
                                totalHouses={house.houses.length}
                                paginate={paginate}
                                nextPage={nextPage}
                                prevPage={prevPage}
                                active={active}
                            />
                        </div>
                    </div >
                    <Reservations />
                </>
            }
        </>
    )
};

const Houses = ({ houses }) => {
    const dispatch = useDispatch();
    const [showDelete, setShowDelete] = useState(false);
    const [homeId, setHomeId] = useState('');
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = () => setShowDelete(true);

    return (
        <>
            {houses.map((home) => (

                <>
                    <div key={home._id} className="col-xs-12 col-sm-6 col-md-4">
                        <div className="house-content">

                            <div className="house-grid">
                                <Link to={{
                                    pathname: `/housedetails/${home._id}`,
                                    state: {
                                        home: { home },
                                        key: home._id
                                    },
                                }}>
                                    <img src={home.image[0].imageURL} style={{ height: 250 }} />
                                </Link>
                                <div className="house-price"><small>{home.price} dt /night</small></div>
                                <a className="book-now text-center" style={{ width: 40 }} onClick={() => { setShowDelete(true); setHomeId(home._id) }} >
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
                                            e.preventDefault()
                                            dispatch(deleteHouse(homeId))
                                            console.log(homeId)
                                            //history.push('/houseshost')
                                        }}> Yes </Button>
                                        <Button variant="danger" style={{ width: 100, height: 30 }} type='submit' onClick={handleCloseDelete} > No </Button>
                                    </Modal.Footer>
                                </Modal>
                            </div>
                            <div className="desc">
                                <ReactStars
                                    edit={false}
                                    isHalf={true}
                                    value={home.rating}
                                    size={20}
                                />
                                <h3>{home.title}</h3>
                                <p style={{ height: 100, textOverflow: 'ellipsis', overflow: 'hidden' }}>{home.description}</p>
                                <span className="main-white-button d-flex justify-content-center">
                                    <a onClick={(e) => {
                                        e.preventDefault();
                                        dispatch(getReservationsByHouse(home._id));
                                    }}>
                                        <i className="fa fa-eye"></i> view reservations</a>
                                </span>
                            </div>
                        </div>
                    </div>

                </>
            ))
            }
        </>
    );
}


export default HousesHost
