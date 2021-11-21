import React, { useState } from 'react'
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/displayHouses.css'
import OwlCarousel from 'react-owl-carousel';
import { Modal } from 'react-bootstrap'

const ModalPic = ({ home }) => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    return (
        <>
            <p className="link text-right" style={{ marginTop: -10 }} onClick={handleShow}>
                Picture
            </p>
            <Modal style={{ backgroundColor: 'transparent' }} show={show} onHide={handleClose} animation={false} >
                <Modal.Header className="d-flex justify-content-end">
                    <i className="fa fa-times animation" onClick={handleClose}></i>
                </Modal.Header >
                <Modal.Body className="modal-content-body">
                    <OwlCarousel items={1}
                        className="owl-theme"
                        loop
                        nav
                        margin={3}
                        autoplay={true} >

                        {home.image.map((img) =>
                            <img src={img.imageURL} className="img-responsive img-thumbnail" style={{ width: 700, height: 400 }} />)
                        }
                    </OwlCarousel>
                </Modal.Body>

            </Modal>
        </>
    );
}

export default ModalPic
