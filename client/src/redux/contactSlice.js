import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

export const addNewMessage = createAsyncThunk('contact/addNewMessage', async (info, { rejectWithValue }) => {
    try {
        console.log("info", info)
        const res = await axios.post('/contact/addMessage', info);
        return res.data;
    } catch (error) {
        return rejectWithValue(
            error.response.data.message
        );
    }
})

export const getMessages = createAsyncThunk('contact/getMessages', async (info, { rejectWithValue }) => {
    try {
        const res = await axios.get('/contact/displayall', {
            headers: { token: localStorage.getItem('token') },
        });
        return res.data;
    } catch (error) {
        return rejectWithValue(
            error.response.data.message
        );
    }
})

export const updateReaded = createAsyncThunk('contact/updateReaded', async ({ id, readed }, { rejectWithValue, dispatch }) => {
    try {
        const res = await axios.put(`/contact/updateReaded/${id}`, readed, {
            headers: { token: localStorage.getItem('token') },
        });
        dispatch(getMessages());

        return res.data;
    } catch (error) {
        return rejectWithValue(
            error.response.data.message
        );
    }
});

export const deleteContactMessage = createAsyncThunk('contact/deleteContactMessage', async (id, { rejectWithValue, dispatch }) => {
    try {
        const res = await axios.delete(`/contact/deleteMessage/${id}`, {
            headers: { token: localStorage.getItem('token') },
        });
        dispatch(getMessages());
        return res.data;
    } catch (error) {
        return rejectWithValue(
            error.response.data.message
        );
    }
});

const contactSlice = createSlice({
    name: 'contact',
    initialState: {
        contacts: [],
        contact: {},
        loading: false,
        errors: null,
    },
    extraReducers: {
        [addNewMessage.pending]: (state) => {
            state.loading = true;
        },
        [addNewMessage.fulfilled]: (state, action) => {
            state.loading = false;
            state.contact = action.payload;
            state.errors = null;

        },
        [addNewMessage.rejected]: (state, action) => {
            state.errors = action.payload;
        },
        [getMessages.fulfilled]: (state, action) => {
            state.loading = false;
            state.contacts = action.payload;
            state.errors = null;
        },
        [getMessages.rejected]: (state, action) => {
            state.loading = false;
            state.errors = action.payload;
        },
        [deleteContactMessage.fulfilled]: (state) => {
            state.loading = false;
            state.contact = {};
            state.errors = null;
        },
        [deleteContactMessage.rejected]: (state, action) => {
            state.loading = false;
            state.errors = action.payload;
        },
    }
});

export default contactSlice.reducer;
