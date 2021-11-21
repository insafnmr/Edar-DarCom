import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Pagination } from 'react-bootstrap'

const Paginations = ({ housesPerPage, totalHouses, paginate, nextPage, prevPage, active }) => {

    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalHouses / housesPerPage); i++) {
        pageNumbers.push(i);
    }

    return (

        <>

            <Pagination>
                <Pagination.First onClick={() => paginate(1)} />
                <Pagination.Prev onClick={() => prevPage()} />

                {pageNumbers.map(number => (
                    <Pagination.Item key={number} onClick={() => paginate(number)} active={number == active} >
                        {number}
                    </Pagination.Item>
                ))}

                <Pagination.Next onClick={() => nextPage()} />
                <Pagination.Last onClick={() => paginate(pageNumbers.length)} />
            </Pagination>
        </>

    );
};

export default Paginations;