import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


export const checkAvailability = createAsyncThunk(
    'reservations/checkAvailability',
    async ({ houseId, arrivalDate, releaseDate }, { rejectWithValue }) => {
        try {
            const info = { arrivalDate, releaseDate }

            const res = await axios.post(`/reservation/checkavailability/${houseId}`, info);

            return res.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);
export const addReservation = createAsyncThunk(
    'reservations/addReservation',
    async (info, { rejectWithValue ,dispatch}) => {
        try {

            const res = await axios.post(`/reservation/addReservation`, info, {
                headers: { token: localStorage.getItem('token') },
            });
            dispatch(getReservationsByClient())
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);


export const getReservationsByClient = createAsyncThunk(
    'reservations/getReservationsByClient',
    async (info, { rejectWithValue }) => {
        try {
            const res = await axios.get('/reservation/reservationsByUser', {
                headers: { token: localStorage.getItem('token') },
            });
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);
export const getReservationsByHouse = createAsyncThunk(
    'reservations/getReservationsByHouse',
    async (id, { rejectWithValue }) => {
        try {
            const res = await axios.get(`/reservation/reservationsByHouse/${id}`, {
                headers: { token: localStorage.getItem('token') },
            });
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);
export const deleteRes = createAsyncThunk('user/deleteRes', async (info, { rejectWithValue, dispatch, history }) => {
    try {
        const res = await axios.delete(`/reservation/deleteReservation/${info.id}`, {
            headers: { token: localStorage.getItem('token') },
        });
        dispatch(getReservationsByClient())
        return res.data;
    } catch (error) {
        return rejectWithValue(
            error.response.data.message
        );
    }
});
const reservationSlice = createSlice({
    name: 'reservation',
    initialState: {
        reservations: [],
        loading: false,
        reservationErrors: null,
        reservationsErrors: null,
        reservation: {},
    },
    extraReducers: {
        [checkAvailability.fulfilled]: (state, action) => {
            state.loading = false;
            state.reservation = action.payload;
            state.reservationErrors = null;
        },
        [checkAvailability.rejected]: (state, action) => {
            state.loading = false;
            state.errors = action.payload;
        },

        [addReservation.fulfilled]: (state, action) => {
            state.loading = false;
            state.reservation = action.payload;
            state.reservationErrors = null;
        },
        [addReservation.rejected]: (state, action) => {
            state.loading = false;
            state.errors = action.payload;
        },
        [getReservationsByClient.pending]: (state) => {
            state.loading = true;
        },
        [getReservationsByClient.fulfilled]: (state, action) => {
            state.loading = false;
            state.reservations = action.payload;
            state.reservationsErrors = null;
        },
        [getReservationsByClient.rejected]: (state, action) => {
            state.loading = false;
            state.errors = action.payload;
        },
        [getReservationsByClient.pending]: (state) => {
            state.loading = true;

        }, 
        [getReservationsByHouse.fulfilled]: (state, action) => {
            state.loading = false;
            state.reservations = action.payload;
            state.reservationsErrors = null;
        },
        [getReservationsByHouse.rejected]: (state, action) => {
            state.loading = false;
            state.errors = action.payload;
        }, 
        [deleteRes.fulfilled]: (state) => {
            state.loading = false;
            state.favorite = {};
            state.errors = null;
        },
        [deleteRes.rejected]: (state, action) => {
            state.loading = false;
            state.errors = action.payload;
        },
    }
});

export default reservationSlice.reducer;