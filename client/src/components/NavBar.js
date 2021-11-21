import React, { useState } from 'react'
import '../templateStyle/style.css';
import { useSelector, useDispatch } from 'react-redux'
import { logout, updateRole } from '../redux/userSlice'
import { Link } from 'react-router-dom'
import { Modal, Button, Form, Row, Col } from 'react-bootstrap';
import { addNewHouse } from '../redux/houseSlice';
import { useHistory } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Alert, Snackbar } from '@mui/material';

const NavBar = () => {
  const history = useHistory()
  const dispatch = useDispatch()
  const user = useSelector((state) => state.user);
  const house = useSelector((state) => state.house);


  const [houseInfo, setHouseInfo] = useState({});
  const [file, setFile] = useState([]);
  const [checkedInfo, setCheckedInfo] = useState({});

  const handleChange = (e) => {
    setHouseInfo({ ...houseInfo, [e.target.name]: e.target.value });
  };
  const handleChecked = (e) => {
    setCheckedInfo({ ...checkedInfo, [e.target.name]: e.target.checked })
  };

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const [open, setOpen] = useState(false);
  const handleCloseAlert = () => setOpen(false);
  const handleOpen = () => setOpen(true);

  return (
    <>
      <header className="header-area header-sticky wow slideInDown animated background-header" data-wow-duration="0.75s" data-wow-delay="0s" style={{ visibility: "visible" }}>
        <div className="container">
          <div className="row">
            <div className="col-xl-3 col-lg-3 col-md-3 col-sm-3 col logo_section">
              <div className="full">
                <div className="center-desk">
                  {!user.isAuth || user.isAuth && user.userInfo.role !== 'admin' ?
                    <div className="logo">
                      <Link to="/"><img src="../assets/images/logoo2.png" style={{ width: 130, height: 80 }} alt="logo" /></Link>
                    </div>
                    :
                    <div className="logo">
                      <Link to="/admin"><img src="../assets/images/logoo2.png" style={{ width: 130, height: 80 }} alt="logo" /></Link>
                    </div>
                  }
                </div>
              </div>
            </div>
            <div className="col-xl-9 col-lg-9 col-md-9 col-sm-9">
              <nav className="main-nav navigation navbar navbar-expand-md navbar-dark ">
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarsExample04" aria-controls="navbarsExample04" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarsExample04">
                  <ul className="nav navbar-nav mr-auto">
                    {!user.isAuth || user.isAuth && user.userInfo.role !== 'admin' ?
                      <>
                        <li className="nav-item mt-3">
                          <Link className="nav-link" to="/"> Home </Link>
                        </li>
                        {/* 
                        <li className="nav-item mt-3">
                          <a className="nav-link" href="/"> About us </a>
                        </li> */}

                        <li className="nav-item mt-3">
                          <Link className="nav-link" to="/contact"> Contact us </Link>
                        </li>

                        <li className="nav-item mt-3">
                          <Link className="nav-link" to='/houses'> Houses</Link>
                        </li>
                      </>
                      :
                      <>
                        <li className="nav-item mb-5">
                          <Link to="/admin"  ><i className="glyphicon glyphicon-dashboard"></i> Dashboard</Link>
                        </li>
                        <li className="nav-item mb-5">
                          <Link to="/profile"  ><i className="glyphicon glyphicon-user"></i> Profile</Link>
                        </li>
                        <li className="nav-item mt-3">
                          <div className="main-white-button">
                            <Link to='/' onClick={() => dispatch(logout())}><i className="glyphicon glyphicon-log-out"></i> Logout </Link>
                          </div>
                        </li>
                      </>}
                    {!user.isAuth && <li className="nav-item"><div className="main-white-button"><a href="/login"><i className="glyphicon glyphicon-log-in"></i> Login</a></div></li>}

                    {/* {user.isAuth && user.userInfo.role === "admin" &&
                      <li className="nav-item">
                        <div className="dropdown nav-link">
                          <a className="dropdown-toggle" role="button">
                            <i className="glyphicon glyphicon-user"></i> Admin </a>
                          <div className="dropdown-content" style={{ padding: 8 }}>
                            <Link to="/admin"  ><i className="glyphicon glyphicon-dashboard"></i> Dashboard</Link>
                            <Link to="/profile"  ><i className="glyphicon glyphicon-user"></i> Profile</Link>
                            <Link to='/' onClick={() => dispatch(logout())}><i className="glyphicon glyphicon-log-out"></i> Logout</Link>

                          </div>
                        </div>
                      </li>} */}
                    {user.isAuth && user.userInfo.role !== "admin" &&
                      (<>
                        <li className="nav-item">
                          <div className="dropdown nav-link">
                            <a className="dropdown-toggle" role="button">
                              <i className="glyphicon glyphicon-user"></i> {user.userInfo.firstName} </a>
                            <div className="dropdown-content" style={{ padding: 8 }}>
                              <Link to='/profile'  > <i className="glyphicon glyphicon-user"></i> Profile </Link>
                              {user.userInfo.role === 'host' ?
                                <>
                                  <Link to='/houseshost'  > <i className="glyphicon glyphicon-home"></i> My Houses </Link>
                                  {/* <Link to="/reservations" ><i className="glyphicon glyphicon-calendar"></i> Reservations </Link> */}
                                </> : true}
                              <Link to='/' onClick={() => dispatch(logout())}> <i className="glyphicon glyphicon-log-out"></i> Logout </Link>

                            </div>
                          </div>
                        </li>
                        <li className="nav-item mt-2">
                          <Link to="/chat" className="main-white-button nav-link">
                            <i className="fa fa-comments fa-2x" ></i>
                          </Link>
                        </li>
                        {/* <li className="nav-item mt-2">
                          <Link to="/" className="main-white-button nav-link">
                            <i className="fa fa-bell fa-2x"></i>
                          </Link>
                        </li> */}
                        <li className="nav-item">
                          <div className="main-white-button nav-link">
                            {user.userInfo.isBlocked === false ?
                              <>
                                <a onClick={handleShow}><i className="fa fa-plus"></i>New House</a>
                                <Modal style={{ backgroundColor: 'transparent', padding: 50 }} show={show} onHide={handleClose} animation={false} >
                                  <Modal.Header style={{ backgroundImage: 'linear-gradient(-70deg, #8D99AF,#a0989a,#8D99AF)' }}>
                                    <Modal.Title> New House </Modal.Title>
                                  </Modal.Header>
                                  <Modal.Body style={{ marginLeft: 50, marginRight: 50 }}>
                                    <Form.Group as={Row} >
                                      <Col sm="12">
                                        <img src='../assets/images/buy_house.png' />
                                      </Col>
                                      <Col sm="12">
                                        <Form >
                                          <Form.Control className=" shadow-danger" type='text' name='title' onChange={handleChange} placeholder='Title' required /><br />
                                          <Form.Control className=" shadow-danger" type='text' as="textarea" name='description' onChange={handleChange} placeholder='Description' required /><br />
                                          <Form.Select className=" shadow-danger" as='select' onChange={handleChange} name="nbr_room" required>
                                            <option selected disabled>Number of rooms </option>
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
                                          </Form.Select><br />

                                          <Form.Select className=" shadow-danger" aria-label="Default select example" name="nbr_bed" onChange={handleChange} required>
                                            <option selected disabled>Number of beds</option>
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
                                          </Form.Select><br />

                                          <Form.Select className=" shadow-danger" aria-label="Default select example" onChange={handleChange} name="nbr_bathroom">
                                            <option selected disabled>Number of bathrooms</option>
                                            <option value="1" >1</option>
                                            <option value="2" >2</option>
                                            <option value="3" >3</option>
                                            <option value="4" >4</option>
                                            <option value="5" >5</option>
                                          </Form.Select><br />

                                          <Form.Select className=" shadow-danger" aria-label="Default select example" name="country" onChange={handleChange} required>
                                            <option selected disabled>Governorate</option>
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
                                          </Form.Select><br />
                                          <Form.Control className=" shadow-danger" type='text' name='city' onChange={handleChange} placeholder='city' /><br />
                                          <Form.Control className=" shadow-danger" type='number' name='price' onChange={handleChange} min="10" max="5000" placeholder='price' required /><br />

                                          <Form.Select className=" shadow-danger" aria-label="Default select example" name="capacity" onChange={handleChange} required>
                                            <option selected disabled>Capacity of the house</option>
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
                                          </Form.Select><br />

                                          <Form.Group className="ml-3 mb-3" id="formGridCheckbox" style={{ fontSize: 12, color: 'grey' }}>
                                            <Form.Check type="checkbox" checked={checkedInfo ? checkedInfo.Wifi : house.assets.Wifi} name="Wifi" label="Wifi" onClick={handleChecked} />
                                            <Form.Check type="checkbox" checked={checkedInfo ? checkedInfo.swimmingPool : house.assets.swimmingPool} name="swimmingPool" label="Swimming pool" onClick={handleChecked} />
                                            <Form.Check type="checkbox" checked={checkedInfo ? checkedInfo.tv : house.assets.tv} name="tv" label="TV" onClick={handleChecked} />
                                            <Form.Check type="checkbox" checked={checkedInfo ? checkedInfo.airConditioner : house.assets.airConditioner} name="airConditioner" label="Air conditioner" onClick={handleChecked} />
                                            <Form.Check type="checkbox" checked={checkedInfo ? checkedInfo.carPark : house.assets.carPark} name="carPark" label="Car park" onClick={handleChecked} />
                                            <Form.Check type="checkbox" checked={checkedInfo ? checkedInfo.garden : house.assets.garden} name="garden" label="Garden" onClick={handleChecked} />
                                          </Form.Group>
                                          <Form.Control className=" shadow-danger" type='file' name='file' multiple accept="image/png, image/jpeg" onChange={(e) => setFile(e.target.files)} required />
                                        </Form>
                                      </Col>
                                    </Form.Group>
                                  </Modal.Body>
                                  <Modal.Footer>
                                    <Button variant="outline-secondary" style={{ width: 100, height: 30 }} type='submit' onClick={(e) => {
                                      e.preventDefault();
                                      dispatch(addNewHouse({ houseInfo, file, assets: checkedInfo, history }));
                                      if (user.userInfo.role === "client") {
                                        dispatch(updateRole({ id: user.userInfo._id }))
                                      }
                                      if (house.success) {
                                        toast("Adding house in progress ...", { autoClose: 15000 })
                                      }
                                      else {
                                        toast.error("Adding house failed !", { autoClose: 1000 })
                                      }
                                      handleClose();
                                    }}> Add </Button>
                                    <Button variant="outline-danger" style={{ width: 100, height: 30 }} onClick={handleClose}> Cancel </Button>
                                  </Modal.Footer>
                                </Modal>
                              </>
                              :
                              <>
                                <a onClick={handleOpen}><i className="fa fa-plus"></i>New House</a>
                                <Snackbar open={open} onClose={handleCloseAlert} anchorOrigin={{ vertical: 'top', horizontal: 'center' }} >
                                  <Alert onClose={handleCloseAlert} style={{ fontSize: 14, marginTop: 60 }} sx={{ width: '100%' }} severity="warning">
                                    Your account is banned ! Please contact the administrator for more information.
                                  </Alert>
                                </Snackbar>
                              </>
                            }
                          </div>
                        </li>

                      </>)}
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </header >
      <ToastContainer />
    </>
  )
}
export default NavBar;