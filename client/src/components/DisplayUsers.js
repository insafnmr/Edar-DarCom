import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Paginations from '../components/Pagination'
import { banUser, getUsers } from '../redux/userSlice';
import moment from 'moment';

const DisplayUsers = ({ users }) => {

    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const [usersPerPage] = useState(6);
    const [active, setActive] = useState(1);

    // Get current users
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

    // Change page
    const paginate = pageNumber => { setCurrentPage(pageNumber); setActive(pageNumber) };

    const nextPage = () => {
        if (currentPage < Math.ceil(users.length / usersPerPage)) {
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


    useEffect(() => {
        dispatch(getUsers())
    }, []);

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
                                            <li><Link to="/contacts" style={{ color: "#ee5057" }}><i className="fa fa-envelope"></i> Contact's Messages</Link></li>
                                        </ul>
                                        <hr />
                                    </div>
                                    <div className="col">
                                        <div className="e-tabs mb-3 px-3">
                                            <ul className="nav nav-tabs w-100">
                                                <li className="nav-item"><a className="nav-link active">Users</a></li>
                                            </ul>
                                        </div>

                                        <div className="row flex-lg-nowrap">
                                            <AllUsers users={currentUsers} />
                                        </div>
                                        <div className="container d-flex justify-content-center">
                                            <div className="row">
                                                <Paginations usersPerPage={usersPerPage}
                                                    totalUsers={users.length}
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

const AllUsers = ({ users }) => {

    const dispatch = useDispatch();

    const handleBan = (e, userId) => {
        e.preventDefault();
        dispatch(banUser({ id: userId }));
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
                                            <th className="text-center">Photo</th>
                                            <th className="max-width text-center">Name</th>
                                            <th className="sortable text-center">Date</th>
                                            <th className="text-center">Block</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {users.map((user) => {
                                            const joinedAt = moment(user.joinedAt).format("DD/MM/YYYY");
                                            return (
                                                <>
                                                    {user.isBlocked ?
                                                        <tr key={user._id} style={{ backgroundColor: "#da1c1c80" }}>
                                                            <td className="align-middle text-center">
                                                                <img src={user.image.imageURL} className="bg-light d-inline-flex justify-content-center align-items-center align-top" style={{ width: 35, height: 35, borderRadius: 3 }}>
                                                                </img>
                                                            </td>
                                                            <td className="text-nowrap align-middle text-center">{user.firstName} {user.lastName}</td>
                                                            <td className="text-nowrap align-middle text-center"><span>{joinedAt}</span></td>
                                                            <td className="text-center align-middle text-center">
                                                                <div className="btn-group align-top">
                                                                    <button className="btn btn-sm btn-outline-secondary badge" type="button" onClick={(e) => handleBan(e, user._id)}><i className="fa fa-ban"></i></button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                        :
                                                        <tr>
                                                            <td className="align-middle text-center">
                                                                <img src={user.image.imageURL} className="bg-light d-inline-flex justify-content-center align-items-center align-top" style={{ width: 35, height: 35, borderRadius: 3 }}>
                                                                </img>
                                                            </td>
                                                            <td className="text-nowrap align-middle text-center">{user.firstName} {user.lastName}</td>
                                                            <td className="text-nowrap align-middle text-center"><span>{joinedAt}</span></td>
                                                            <td className="text-center align-middle text-center">
                                                                <div className="btn-group align-top">
                                                                    <button className="btn btn-sm btn-outline-secondary badge" type="button" onClick={(e) => handleBan(e, user._id)}><i className="fa fa-ban"></i></button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    }
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


export default DisplayUsers
