import { configureStore } from '@reduxjs/toolkit'
import userReducer from './redux/userSlice'
import houseReducer from './redux/houseSlice'
import reportReducer from './redux/reportSlice'
import contactReducer from './redux/contactSlice'
import reservationReducer from './redux/reservationSlice'
import favoriteReducer from './redux/favoriteSlice'
import chatReducer from './redux/chatSlice'

const store = configureStore({ reducer: { user: userReducer, house: houseReducer, report: reportReducer, contact: contactReducer, reservation: reservationReducer, favorite: favoriteReducer, chat: chatReducer } })

export default store;