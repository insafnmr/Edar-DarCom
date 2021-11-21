import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Paginations from '../components/Pagination'
import { getMessages, updateReaded, deleteContactMessage } from '../redux/contactSlice';
import moment from 'moment';
import { Form } from 'react-bootstrap';

const DisplayContacts = ({ contacts }) => {

    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getMessages());
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const [contactsPerPage] = useState(6);
    const [active, setActive] = useState(1);

    const indexOfLastContact = currentPage * contactsPerPage;
    const indexOfFirstContact = indexOfLastContact - contactsPerPage;
    const currentContacts = contacts.slice(indexOfFirstContact, indexOfLastContact);

    const paginate = pageNumber => { setCurrentPage(pageNumber); setActive(pageNumber) };

    const nextPage = () => {
        if (currentPage < Math.ceil(contacts.length / contactsPerPage)) {
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
            {user.isAuth && (
                <>
                    {user.userInfo.role === 'admin' && (
                        <>
                            <div className="container bootstrap snippets bootdey " style={{ paddingTop: 100, paddingBottom: 100 }}>

                                <div className="row">
                                    <div className="col-lg-2">
                                        <hr />

                                        <ul className="nav nav-pills nav-stacked">
                                            <li><Link to="/admin" style={{ color: "#ee5057" }}><i className="glyphicon glyphicon-dashboard mr-1"></i> Dashboard</Link></li>
                                            <li><Link to="/users" style={{ color: "#ee5057" }}><i className="fa fa-users mr-1"></i> Users</Link></li>
                                            <li><Link to="/reports" style={{ color: "#ee5057" }}><i className="glyphicon glyphicon-list-alt mr-1"></i> Reports</Link></li>
                                            <li><Link to="/contact" style={{ color: "#ee5057" }}><i className="fa fa-envelope"></i> Contact's Messages</Link></li>
                                        </ul>

                                        <hr />

                                    </div>
                                    <div className="col">
                                        <div className="e-tabs mb-3 px-3">
                                            <ul className="nav nav-tabs w-100">
                                                <li className="nav-item"><a className="nav-link active">Contacts</a></li>
                                            </ul>
                                        </div>

                                        <div className="row flex-lg-nowrap">
                                            <AllContacts contacts={currentContacts} />
                                        </div>
                                        <div className="container d-flex justify-content-center">
                                            <div className="row">
                                                <Paginations contactsPerPage={contactsPerPage}
                                                    totalContacts={contacts.length}
                                                    paginate={paginate}
                                                    nextPage={nextPage}
                                                    prevPage={prevPage}
                                                    active={active}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>)}
                </>
            )}
        </>
    )
}


const AllContacts = ({ contacts }) => {

    const dispatch = useDispatch();

    const [checkedReaded, setCheckedReaded] = useState(contacts.readed)
    const checkReaded = (e) => {
        setCheckedReaded({ ...checkedReaded, [e.target.name]: e.target.checked })
    };

    const handleReaded = (e, contactId) => {
        checkReaded(e);
        dispatch(updateReaded({ id: contactId, readed: checkedReaded }));
    };

    const handleDelete = (e, contactId) => {
        dispatch(deleteContactMessage(contactId));
    };

    return (
        <>
            <div className="col mb-3">
                <div className="e-panel card">
                    <div className="card-body">

                        <div className="e-table">
                            <div className="table-responsive table-lg mt-3">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th className="sortable text-center">Date</th>
                                            <th className="max-width text-center">User's Name</th>
                                            <th className="max-width text-center">User's email</th>
                                            <th className="max-width text-center">Message</th>
                                            <th className="text-center">Readed</th>
                                            <th className="text-center">Delete</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {contacts.map((contact) => {
                                            const contactDate = moment(contact.createdAt).format("DD/MM/YYYY");
                                            return (
                                                <>
                                                    <tr key={contact._id}>

                                                        <td className="text-nowrap align-middle text-center"><span>{contactDate}</span></td>
                                                        <td className="text-nowrap align-middle text-center">{contact.firstName} {contact.lastName}</td>
                                                        <td className="text-nowrap align-middle text-center">{contact.email}</td>
                                                        <td className="text-nowrap align-middle text-center">{contact.message}</td>
                                                        <td className="text-center">
                                                            {contact.readed === true ?
                                                                <>
                                                                    <Form.Check className="mb-4 align-middle" type="checkbox" checked={contact.readed} disabled name="readed" onChange={(e) => handleReaded(e, contact._id)}
                                                                    />
                                                                </>
                                                                :
                                                                <>
                                                                    <Form.Check className="mb-4 align-middle" type="checkbox" checked={contact.readed} name="readed" onChange={(e) => handleReaded(e, contact._id)}
                                                                    />
                                                                </>

                                                            }
                                                        </td>
                                                        <td className="text-center align-middle text-center">
                                                            <div className="btn-group align-top">
                                                                <button className="btn btn-sm btn-outline-secondary badge" type="button" onClick={(e) => handleDelete(e, contact._id)}><i className="fa fa-trash"></i></button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                </>
                                            )
                                        })}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default DisplayContacts
