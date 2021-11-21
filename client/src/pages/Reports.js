import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import DisplayReports from '../components/DisplayReports';
import { getReports } from '../redux/reportSlice';

const Reports = ({history}) => {

    const {reports} = useSelector((state) => state.report)
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch();

    useEffect(() => {
        if (!user.isAuth || user.userInfo.role !== 'admin' ) {
            history.push('/login');
        } else {
            dispatch(getReports())
        }
    }, [user.isAuth]);
    
    return (
        <>
            <DisplayReports reports={reports} />
        </>
    )
}

export default Reports
