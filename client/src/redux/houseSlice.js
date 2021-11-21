import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const addNewHouse = createAsyncThunk(
    'house/addNewHouse',
    async ({ file, houseInfo, assets, history }, { rejectWithValue, dispatch }) => {
        const formData = new FormData();
        const info = { ...houseInfo, assets }
        const newFile = Array.from(file)
        newFile.map(img => formData.append('picture', img))
        formData.append('picture', file)
        formData.append('info', JSON.stringify(info));
        try {
            const res = await axios.post('/houses/addHouse', formData, {
                headers: { token: localStorage.getItem('token') },
            });
            history.push('/housesHost');
            return res.data;
        } catch (error) {
            return rejectWithValue(
                error.response.data.message
            );
        }
    }
);
export const getHouses = createAsyncThunk(
    'house/getHouses',
    async (info, { rejectWithValue }) => {
        try {
            const res = await axios.get('/houses');
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const getRecentHouses = createAsyncThunk(
    'house/getRecentHouses',
    async (info, { rejectWithValue }) => {
        try {
            const res = await axios.get('/houses/recenthouses');
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const getHousesByHost = createAsyncThunk(
    'house/getHousesByHost',
    async (info, { rejectWithValue }) => {
        try {
            const res = await axios.get('/houses/displayHouseByHost', {
                headers: { token: localStorage.getItem('token') },
            });
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const getHouseDetails = createAsyncThunk('house/getHouseDetails', async (id, { rejectWithValue }) => {

    try {
        const res = await axios.get(`/houses/displayHouseById/${id}`);
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
}
);

export const updateHouse = createAsyncThunk('house/updateHouse', async ({ id, houseInfo, assets }, { rejectWithValue, dispatch }) => {

    const info = { ...houseInfo, assets }

    try {
        const res = await axios.put(`/houses/updateHouse/${id}`, info, {
            headers: { token: localStorage.getItem('token') },
        });
        dispatch(getHouseDetails(id));
        return res.data;
    } catch (error) {
        return rejectWithValue(
            error.response.data.message
        );
    }
})


export const updateHouseImages = createAsyncThunk('house/updateHouseImages', async (info, { rejectWithValue, dispatch }) => {

    try {
        const formData = new FormData();
        const newFile = Array.from(info.file)
        newFile.map(img => formData.append('picture', img))
        formData.append('picture', info.file)
        const res = await axios.put(`/houses/uploadimgs/${info.id}`, formData, {
            headers: { token: localStorage.getItem('token') },
        });
        dispatch(getHouseDetails(info.id));
        return res.data;
    } catch (error) {
        return rejectWithValue(
            error.response.data.message
        );
    }
}
);

export const deleteHouse = createAsyncThunk('house/deleteHouse', async (id, { rejectWithValue, dispatch }) => {
    try {
        const res = await axios.delete(`/houses/deleteHouse/${id}`, {
            headers: { token: localStorage.getItem('token') },
        });
        dispatch(getHousesByHost());
        return res.data;
    } catch (error) {
        return rejectWithValue(
            error.response.data.message
        );
    }
});


export const updateHouseReview = createAsyncThunk('houses/updateHouseReview', async ({ id, comment, rating }, { rejectWithValue, dispatch }) => {

    const info = { comment, rating }
    try {
        const res = await axios.put(`/houses/review/${id}`, info,
            { headers: { token: localStorage.getItem('token') }, }
        );
        dispatch(getHouseDetails(id));
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
}
);

export const filterHouses = createAsyncThunk(
    'house/filterHouses',
    async (info, { rejectWithValue }) => {
        try {

            const res = await axios.post(`/houses/filter`, info);
            return res.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

const houseSlice = createSlice({
    name: 'houses',
    initialState: {
        houses: [],
        recentHouses: [],
        loading: false,
        success: false,
        houseErrors: null,
        housesErrors: null,
        successMessage: null,
        house: {},
    },
    extraReducers: {
        [addNewHouse.fulfilled]: (state, action) => {
            state.loading = false;
            state.success = true;
            state.house = action.payload;
            state.houseErrors = null;
            state.successMessage = action.payload.message;
        },
        [addNewHouse.rejected]: (state, action) => {
            state.loading = false;
            state.success = false;
            state.errors = action.payload;
        },
        /* [getHouses.pending]: (state) => {
            state.loading = true;
        }, */
        [getHouses.fulfilled]: (state, action) => {
            state.loading = false;
            state.success = true;
            state.houses = action.payload;
            state.housesErrors = null;
        },
        [getHouses.rejected]: (state, action) => {
            state.loading = false;
            state.success = false;
            state.errors = action.payload;
        },
        [getRecentHouses.pending]: (state) => {
            state.loading = true;
        },
        [getRecentHouses.fulfilled]: (state, action) => {
            state.loading = false;
            state.success = true;
            state.recentHouses = action.payload;
            state.housesErrors = null;
        },
        [getRecentHouses.rejected]: (state, action) => {
            state.loading = false;
            state.success = false;
            state.errors = action.payload;
        },
        [getHouseDetails.pending]: (state) => {
            state.loading = true;
        },
        [getHouseDetails.fulfilled]: (state, action) => {
            state.loading = false;
            state.success = true;
            state.house = action.payload;
            state.houseErrors = null;
        },
        [getHouseDetails.rejected]: (state, action) => {
            state.loading = false;
            state.success = false;
            state.errors = action.payload;
        },
        [getHousesByHost.pending]: (state) => {
            state.loading = true;
            state.success = false;
        },
        [getHousesByHost.fulfilled]: (state, action) => {
            state.loading = false;
            state.success = true;
            state.houses = action.payload;
            state.housesErrors = null;
        },
        [getHousesByHost.rejected]: (state, action) => {
            state.loading = false;
            state.success = false;
            state.errors = action.payload;
        },
        // [updateHouseImages.pending]: (state) => {
        //     state.loading = true;
        //     state.success = false;
        // },
        // [updateHouseImages.fulfilled]: (state, action) => {
        //     state.loading = false;
        //     state.success = true;
        //     state.house = action.payload;
        //     state.houseErrors = null;
        // },
        // [updateHouseImages.rejected]: (state, action) => {
        //     state.loading = false;
        //     state.success = false;
        //     state.errors = action.payload;
        // },
        [updateHouse.pending]: (state) => {
            state.loading = true;
            state.success = false;
        },
        [updateHouse.fulfilled]: (state, action) => {
            state.loading = false;
            state.success = true;
            state.house = action.payload;
            state.houseErrors = null;
        },
        [updateHouse.rejected]: (state, action) => {
            state.loading = false;
            state.success = false;
            state.errors = action.payload;
        },
        [deleteHouse.pending]: (state) => {
            state.loading = true;
            state.success = false;
        },
        [deleteHouse.fulfilled]: (state) => {
            state.loading = false;
            state.success = true;
            state.house = {};
            state.houseErrors = null;
        },
        [deleteHouse.rejected]: (state, action) => {
            state.loading = false;
            state.success = false;
            state.errors = action.payload;
        },
        [updateHouseReview.pending]: (state) => {
            state.loading = true;
            state.success = false;
        },
        [updateHouseReview.fulfilled]: (state, action) => {
            state.loading = false;
            state.success = true;
            state.house = action.payload;
            state.houseErrors = null;
        },

        [filterHouses.fulfilled]: (state, action) => {
            state.loading = false;
            state.houses = action.payload.housess;
            state.housesErrors = null;
        },
        [filterHouses.rejected]: (state, action) => {
            state.loading = false;
            state.errors = action.payload;
        },
        [filterHouses.pending]: (state, action) => {
            state.loading = true;
        }
    },
});

export default houseSlice.reducer;