import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import DisplayUsers from '../components/DisplayUsers';
import { getUsers } from '../redux/userSlice';

const Users = ({ history }) => {

    const { users } = useSelector((state) => state.user)
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch();

    useEffect(() => {
        if (!user.isAuth || user.userInfo.role !== 'admin' ) {
            history.push('/login');
        } else {
            dispatch(getUsers());
        }
    }, [user.isAuth]);

    return (
        <>
            <DisplayUsers users={users} />
        </>
    )
}

export default Users
