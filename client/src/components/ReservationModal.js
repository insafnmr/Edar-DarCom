import React, { useState, useParams } from 'react';
import MultiStep from 'react-multistep';
import { Modal, Button, Form, Row, Col, Card } from 'react-bootstrap';
import ReservationProcess from './ReservationProcess';
import { DateRangePicker } from 'rsuite';

import { ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';
import AppBar from '@material-ui/core/AppBar';
import TextField from '@material-ui/core/TextField';
import { Link } from 'react-router-dom';

const ReservationModal = ({ showReserv, handleCloseReserv, reservation, startDate, endDate, houseId }) => {




  return (
    <>

      <Modal style={{ backgroundColor: 'transparent', padding: 50 }} show={showReserv} onHide={handleCloseReserv} animation={false} >



        {/*  <Modal.Header style={{ backgroundImage: 'linear-gradient(-70deg, #8D99AF,#a0989a,#8D99AF)' }}>
                            <Modal.Title> Reservation </Modal.Title>
                          </Modal.Header> */}
        <Modal.Body style={{ marginLeft: 50, marginRight: 50 }}>

          <Form >

            {reservation.reservation.reserved ?
              <p> Sorry! This house is not available in the selected period </p> :
              <p>  This house is available from {startDate} to {endDate},
                please CONFIRM to proceed the reservation process</p>
            }
          </Form>
        </Modal.Body>
        <Modal.Footer>
          {!reservation.reservation.reserved &&
            <Link to={{
              pathname: `/reservation/${houseId}`,
              state: {
                startDate: { startDate },
                endDate: { endDate }
              }
            }}>
              <Button variant="outline-secondary"   /*  onClick={() => setShowR(true)} */ style={{ width: 100, height: 30 }} type='submit' >Confirm</Button>
            </Link>
          }
          <Button variant="outline-danger" style={{ width: 100, height: 30 }} onClick={handleCloseReserv}>Close</Button>

        </Modal.Footer>
      </Modal>


      {/*                         <ReservationProcess showR={showR} handleCloseR={handleCloseR}></ReservationProcess>
 */}{/* <MultiStep showNavigation={true} steps={steps}/>
 */}        </>
  )
}

export default ReservationModal



