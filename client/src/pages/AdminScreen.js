import React, { useEffect } from 'react'
import '../styles/adminScreen.css'
import { useDispatch, useSelector } from 'react-redux';
import { getUsers } from '../redux/userSlice';
import { getReports } from '../redux/reportSlice';
import { getMessages } from '../redux/contactSlice';

const AdminScreen = ({ history }) => {
    const user = useSelector((state) => state.user);
    const report = useSelector((state) => state.report);
    const contact = useSelector((state) => state.contact);

    const dispatch = useDispatch()

    useEffect(() => {
        if (!user.isAuth || user.userInfo.role !== 'admin' ) {
            history.push('/login');
        } else {
            dispatch(getUsers())
            dispatch(getReports())
            dispatch(getMessages())
        }
    }, [user.isAuth]);

    return (
        <>
            {user.isAuth && (
                <>
                    {user.userInfo.role === 'admin' && (
                        <>
                            <div className="container bootstrap snippets bootdey " style={{ paddingTop: 100, paddingBottom: 248 }}>

                                <div className="row justify-content-md-center">
                                    <div className="col-md-10">
                                        <a href="/admin" style={{ color: "#ee5057" }}><strong><i className="glyphicon glyphicon-dashboard"></i> My Dashboard</strong></a>
                                        <hr />
                                        <div className="row justify-content-md-center mt-5">
                                            <div className="col-lg-4 col-sm-6">
                                                <div className="circle-tile ">
                                                    <a href="/users"><div className="circle-tile-heading dark-gray"><i className="fa fa-users fa-fw fa-3x"></i></div></a>
                                                    <div className="circle-tile-content dark-gray">
                                                        <div className="circle-tile-description text-faded"> Users</div>
                                                        <div className="circle-tile-number text-faded "> {user.users.length} </div>
                                                        <a className="circle-tile-footer" href="/users"> More Info <i className="fa fa-chevron-circle-right"></i></a>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-lg-4 col-sm-6">
                                                <div className="circle-tile ">
                                                    <a href="/reports"><div className="circle-tile-heading red"><i className="fa fa-comments fa-fw fa-3x"></i></div></a>
                                                    <div className="circle-tile-content  red">
                                                        <div className="circle-tile-description text-faded"> Reports </div>
                                                        <div className="circle-tile-number text-faded ">{report.reports.length}</div>
                                                        <a className="circle-tile-footer" href="/reports"> More Info <i className="fa fa-chevron-circle-right"></i></a>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-lg-4 col-sm-6">
                                                <div className="circle-tile ">
                                                    <a href="/contacts"><div className="circle-tile-heading gray"><i className="fa fa-envelope fa-fw fa-3x"></i></div></a>
                                                    <div className="circle-tile-content gray">
                                                        <div className="circle-tile-description text-faded"> Contact's Messages </div>
                                                        <div className="circle-tile-number text-faded ">{contact.contacts.length}</div>
                                                        <a className="circle-tile-footer" href="/contacts"> More Info <i className="fa fa-chevron-circle-right"></i></a>
                                                    </div>
                                                </div>
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

export default AdminScreen
