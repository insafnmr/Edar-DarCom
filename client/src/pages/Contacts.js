import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import DisplayContacts from '../components/DisplayContacts';
import { getMessages } from '../redux/contactSlice';

const Contacts = ({ history }) => {

    const { contacts } = useSelector((state) => state.contact)
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch();

    useEffect(() => {
        if (!user.isAuth || user.userInfo.role !== 'admin' ) {
            history.push('/login');
        } else {
            dispatch(getMessages())
        }
    }, [user.isAuth]);

    return (
        <>
            <DisplayContacts contacts={contacts} />
        </>
    )
}

export default Contacts
