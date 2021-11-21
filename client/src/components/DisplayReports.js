import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Paginations from '../components/Pagination'
import { getReports, updateReaded, deleteReport } from '../redux/reportSlice';
import moment from 'moment';
import { Form } from 'react-bootstrap';

const DisplayReports = ({ reports }) => {

    const user = useSelector((state) => state.user);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getReports());
    }, []);

    const [currentPage, setCurrentPage] = useState(1);
    const [reportsPerPage] = useState(6);
    const [active, setActive] = useState(1);

    const indexOfLastReport = currentPage * reportsPerPage;
    const indexOfFirstReport = indexOfLastReport - reportsPerPage;
    const currentReports = reports.slice(indexOfFirstReport, indexOfLastReport);

    const paginate = pageNumber => { setCurrentPage(pageNumber); setActive(pageNumber) };

    const nextPage = () => {
        if (currentPage < Math.ceil(reports.length / reportsPerPage)) {
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
                                            <li><Link to="/admin" style={{color :"#ee5057"}}><i className="glyphicon glyphicon-dashboard mr-1"></i> Dashboard</Link></li>
                                            <li><Link to="/users" style={{color :"#ee5057"}}><i className="fa fa-users mr-1"></i> Users</Link></li>
                                            <li><Link to="/reports" style={{color :"#ee5057"}}><i className="glyphicon glyphicon-list-alt mr-1"></i> Reports</Link></li>
                                            <li><Link to="/contacts" style={{color :"#ee5057"}}><i className="fa fa-envelope"></i> Contact's Messages</Link></li>
                                        </ul>

                                        <hr />

                                    </div>
                                    <div className="col">
                                        <div className="e-tabs mb-3 px-3">
                                            <ul className="nav nav-tabs w-100">
                                                <li className="nav-item"><a className="nav-link active">Reports</a></li>
                                            </ul>
                                        </div>

                                        <div className="row flex-lg-nowrap">
                                            <AllReports reports={currentReports} />
                                        </div>
                                        <div className="container d-flex justify-content-center">
                                            <div className="row">
                                                <Paginations reportsPerPage={reportsPerPage}
                                                    totalReports={reports.length}
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


const AllReports = ({ reports }) => {

    const dispatch = useDispatch();

    const [checkedReaded, setCheckedReaded] = useState(reports.readed)
    const checkReaded = (e) => {
        setCheckedReaded({ ...checkedReaded, [e.target.name]: e.target.checked })
    };

    const handleReaded = (e, reportId) => {
        checkReaded(e);
        dispatch(updateReaded({ id: reportId, readed: checkedReaded }));
    };
    
    const handleDelete = (e, reportId) => {
        dispatch(deleteReport(reportId));
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
                                            <th className="max-width text-center">Client's Name</th>
                                            <th className="max-width text-center">The cause of reporting</th>
                                            <th className="max-width text-center">Host's Name</th>
                                            <th className="text-center">Readed</th>
                                            <th className="text-center">Delete</th>
                                        </tr>
                                    </thead>

                                    <tbody>

                                        {reports.map((report) => {
                                            const reportDate = moment(report.reportsDate).format("DD/MM/YYYY");
                                            return (
                                                <>
                                                    <tr key={report._id}>

                                                        <td className="text-nowrap align-middle text-center"><span>{reportDate}</span></td>
                                                        <td className="text-nowrap align-middle text-center">{report.client.firstName} {report.client.lastName}</td>
                                                        <td className="text-nowrap align-middle text-center">{report.message}</td>
                                                        <td className="text-nowrap align-middle text-center">{report.host.firstName} {report.host.lastName}</td>
                                                        <td className="text-center">
                                                            {report.readed === true ?
                                                                <>
                                                                    <Form.Check className="mb-4 align-middle" type="checkbox" checked={report.readed} disabled name="readed" onChange={(e) => handleReaded(e, report._id)}
                                                                    />
                                                                </>
                                                                :
                                                                <>
                                                                    <Form.Check className="mb-4 align-middle" type="checkbox" checked={report.readed} name="readed" onChange={(e) => handleReaded(e, report._id)}
                                                                    />
                                                                </>

                                                            }
                                                        </td>
                                                        <td className="text-center align-middle text-center">
                                                            <div className="btn-group align-top">
                                                                <button className="btn btn-sm btn-outline-secondary badge" type="button" onClick={(e) => handleDelete(e, report._id)}><i className="fa fa-trash"></i></button>
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

export default DisplayReports
