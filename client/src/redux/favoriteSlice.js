import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { getHouses } from './houseSlice';

export const addFavorite = createAsyncThunk('favorite/addFavorite', async (info, { rejectWithValue, dispatch }) => {
    try {
        const res = await axios.put(`/favorites/addFavorite/${info.id}`, {}, {
            headers: { token: localStorage.getItem('token') },
        });
        dispatch(getHouses())
        return res.data;
    } catch (error) {
        return rejectWithValue(
            error.response.data.message
        );
    }
})

export const getFavorites = createAsyncThunk('favorite/getFavorites', async (info, { rejectWithValue }) => {
    try {
        const res = await axios.get('/favorites/displayall', {
            headers: { token: localStorage.getItem('token') },
        });
        return res.data;
    } catch (error) {
        return rejectWithValue(
            error.response.data.message
        );
    }
})

export const deleteFav = createAsyncThunk('user/deleteFav', async (info, { rejectWithValue, dispatch, history }) => {
    try {
        const res = await axios.put(`/favorites/deleteFavorite/${info.id}`,{}, {
            headers: { token: localStorage.getItem('token') },
        });
        dispatch(getFavorites())
        return res.data;
    } catch (error) {
        return rejectWithValue(
            error.response.data.message
        );
    }
});

const favoriteSlice = createSlice({
    name: 'favorite',
    initialState: {
        favorites: [],
        favorite: {},
        loading: false,
        success: false,
        errors: null,
    },
    extraReducers: {
        [addFavorite.fulfilled]: (state, action) => {
            state.loading = false;
            state.favorite = action.payload;
            state.errors = null;
            state.success = true;
        },
        [addFavorite.rejected]: (state, action) => {
            state.errors = action.payload;
            state.success = false;
        },
        [getFavorites.pending]: (state) => {
            state.loading = true;
        },
        [getFavorites.fulfilled]: (state, action) => {
            state.loading = false;
            state.favorites = action.payload;
            state.errors = null;
        },
        [getFavorites.rejected]: (state, action) => {
            state.loading = false;
            state.errors = action.payload;
        },
        [deleteFav.fulfilled]: (state) => {
            state.loading = false;
            state.success = true;
            state.favorite = {};
            state.errors = null;
        },
        [deleteFav.rejected]: (state, action) => {
            state.loading = false;
            state.success = false;
            state.errors = action.payload;
        },
    }
})
export default favoriteSlice.reducer;

