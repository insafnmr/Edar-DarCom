import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

export const addNewReport = createAsyncThunk('report/addNewReport', async (info, { rejectWithValue }) => {
    try {
        console.log("info", info)
        const res = await axios.post('/reports/addReport', info, {
            headers: { token: localStorage.getItem('token') },
        });
        return res.data;
    } catch (error) {
        return rejectWithValue(
            error.response.data.message
        );
    }
})

export const getReports = createAsyncThunk('report/getReports', async (info, { rejectWithValue }) => {
    try {
        const res = await axios.get('/reports/displayall', {
            headers: { token: localStorage.getItem('token') },
        });
        return res.data;
    } catch (error) {
        return rejectWithValue(
            error.response.data.message
        );
    }
})

export const updateReaded = createAsyncThunk('report/updateReaded', async ({ id, readed }, { rejectWithValue, dispatch }) => {
    try {
        const res = await axios.put(`/reports/updateReaded/${id}`, readed, {
            headers: { token: localStorage.getItem('token') },
        });
        dispatch(getReports());

        return res.data;
    } catch (error) {
        return rejectWithValue(
            error.response.data.message
        );
    }
})

export const deleteReport = createAsyncThunk('contact/deleteReport', async (id, { rejectWithValue, dispatch }) => {
    try {
        const res = await axios.delete(`/reports/deleteReport/${id}`, {
            headers: { token: localStorage.getItem('token') },
        });
        dispatch(getReports());
        return res.data;
    } catch (error) {
        return rejectWithValue(
            error.response.data.message
        );
    }
});


const reportSlice = createSlice({
    name: 'report',
    initialState: {
        reports: [],
        reportInfo: {},
        loading: false,
        errors: null,
    },
    extraReducers: {
        [addNewReport.pending]: (state) => {
            state.loading = true;
        },
        [addNewReport.fulfilled]: (state, action) => {
            state.loading = false;
            state.reportInfo = action.payload;
            state.errors = null;

        },
        [addNewReport.rejected]: (state, action) => {
            state.errors = action.payload;
            state.isAuth = false;
        },
        [getReports.fulfilled]: (state, action) => {
            state.loading = false;
            state.reports = action.payload;
            state.errors = null;
        },
        [getReports.rejected]: (state, action) => {
            state.loading = false;
            state.errors = action.payload;
        },
        [deleteReport.fulfilled]: (state) => {
            state.loading = false;
            state.reportInfo = {};
            state.errors = null;
        },
        [deleteReport.rejected]: (state, action) => {
            state.loading = false;
            state.errors = action.payload;
        },
    }
});

export default reportSlice.reducer;
