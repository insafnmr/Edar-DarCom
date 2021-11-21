import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux'
import { activation } from '../redux/userSlice'


const ActivateAccount = ({ history }) => {

    const dispatch = useDispatch()
    const user = useSelector((state) => state.user)

    useEffect(() => {
        dispatch(activation());
        history.push('/login');
    }, [])

    return (
       <>
       </>
    )
}

export default ActivateAccount
