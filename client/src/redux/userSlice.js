import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

export const postNewUser = createAsyncThunk('user/postNewUser', async (info, { rejectWithValue }) => {
    try {
        const res = await axios.post('/users/register', info)
        return res.data;
    } catch (error) {
        return rejectWithValue(
            error.response.data.message ? error.response.data.message :
                error.response.data.errors.password.msg
                    ? error.response.data.errors.password.msg :
                    error.response.data.errors.email.msg
                        ? error.response.data.errors.email.msg :
                        error.response.data.errors.phone.msg
        );
    }
})

export const login = createAsyncThunk('user/login', async (info, { rejectWithValue }) => {
    try {
        const res = await axios.post('/users/login', info)
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
})

export const activation = createAsyncThunk('user/activation', async (info, { rejectWithValue }) => {
    try {

        const res = await axios.post('/users/activation', {}, {
            headers: { token: localStorage.getItem('token') }
        })
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
})

export const forgotPassword = createAsyncThunk('user/forgotPassword', async (info, { rejectWithValue }) => {
    try {
        const res = await axios.post('/users/forgot', info)
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
})

export const resetPassword = createAsyncThunk('user/resetPassword', async (info, { rejectWithValue }) => {
    try {
        console.log('info', info)
        const res = await axios.post('/users/reset', info, {
            headers: { token: localStorage.getItem('token') },
        })
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
})

export const googleLogin = createAsyncThunk('user/googleLogin', async (info, { rejectWithValue }) => {
    try {
        const res = await axios.post('/users/googlelogin', info)

        return res.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
})

export const updateUser = createAsyncThunk('user/updateUser', async (info, { rejectWithValue, dispatch }) => {
    try {
        console.log('data', info.data)

        const res = await axios.put(`/users/updateUser/${info.id}`, info.data, {
            headers: { token: localStorage.getItem('token') },
        });
        return res.data;
    } catch (error) {
        return rejectWithValue(
            error.response.data.message
        );
    }
})

export const changePassword = createAsyncThunk('user/changePassword', async (info, { rejectWithValue, dispatch }) => {

    try {
        const res = await axios.put(`/users/changePassword/${info.id}`, info.data, {
            headers: { token: localStorage.getItem('token') },
        });
        return res.data;

    } catch (error) {
        return rejectWithValue(
            error.response.data.message
        );
    }
})

export const updateUserImage = createAsyncThunk('user/updateUserImage', async (info, { rejectWithValue, dispatch }) => {
    try {
        const formData = new FormData();
        formData.append('picture', info.file);
        const res = await axios.put(`/users/uploadimg/${info.id}`, formData, {
            headers: { token: localStorage.getItem('token') },
        });
        return res.data;
    } catch (error) {
        return rejectWithValue(error.response.data.message);
    }
}
);

export const deleteUser = createAsyncThunk('user/deleteUser', async (info, { rejectWithValue, dispatch, history }) => {
    try {
        const res = await axios.delete(`/users/delete/${info.id}`, {
            headers: { token: localStorage.getItem('token') },
        });
        return res.data;
    } catch (error) {
        return rejectWithValue(
            error.response.data.message
        );
    }
});

export const updateRole = createAsyncThunk('user/updateRole', async (info, { rejectWithValue, dispatch }) => {

    try {
        const res = await axios.put(`/users/updateRole/${info.id}`, {}, {
            headers: { token: localStorage.getItem('token') },
        });
        return res.data;
    } catch (error) {
        return rejectWithValue(
            error.response.data.message
        );
    }
})

export const getUser = createAsyncThunk('user/getUser', async (info, { rejectWithValue }) => {
    try {
        const res = await axios.get('/users/getUser', {
            headers: { token: localStorage.getItem('token') },
        });
        return res.data;
    } catch (error) {
        return rejectWithValue(
            error.response.data.message
        );
    }
})

//admin
export const getUsers = createAsyncThunk('user/getUsers', async (info, { rejectWithValue }) => {
    try {
        const res = await axios.get('/users/displayall', {
            headers: { token: localStorage.getItem('token') },
        });
        return res.data;
    } catch (error) {
        return rejectWithValue(
            error.response.data.message
        );
    }
})


//admin 
export const banUser = createAsyncThunk('user/banUser', async (info, { rejectWithValue, dispatch }) => {

    try {
        const res = await axios.put(`/users/banuser/${info.id}`, {}, {
            headers: { token: localStorage.getItem('token') },
        });
        dispatch(getUsers());
        return res.data;
    } catch (error) {
        return rejectWithValue(
            error.response.data.message
        );
    }
})
//

const userSlice = createSlice({
    name: 'user',
    initialState: {
        userInfo: JSON.parse(localStorage.getItem('user')),
        loading: false,
        errors: null,
        success: false,
        successMessage: null,
        token: localStorage.getItem('token'),
        isAuth: Boolean(localStorage.getItem('isAuth')),
        users: []
    },
    reducers: {
        logout: (state) => {
            state.isAuth = false;
            state.errors = null;
            state.userInfo = {};
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem('isAuth')
        }
    },
    extraReducers: {

        [postNewUser.fulfilled]: (state, action) => {
            state.token = action.payload.token;
            state.isAuth = false;
            state.errors = null;
            localStorage.setItem('token', action.payload.token)
            state.successMessage = action.payload.message;
            state.success = true;

        },
        [postNewUser.rejected]: (state, action) => {
            state.success = false;
            state.errors = action.payload;
            state.isAuth = false;
        },
        [activation.fulfilled]: (state, action) => {
            state.isAuth = false;
            state.errors = null;
            localStorage.removeItem('token')
            state.successMessage = action.payload.message;
            state.success = true;
        },
        [activation.rejected]: (state, action) => {
            state.errors = action.payload;
            state.isAuth = false;
            state.sucess = false;
        },
        [login.fulfilled]: (state, action) => {
            state.userInfo = action.payload.user;
            state.token = action.payload.token;
            state.isAuth = true;
            state.errors = null;
            localStorage.setItem('token', action.payload.token)
            localStorage.setItem('user', JSON.stringify(action.payload.user))
            localStorage.setItem('isAuth', true)
            state.successMessage = action.payload.message;
            state.success = true;
        },
        [login.rejected]: (state, action) => {
            state.errors = action.payload;
            state.isAuth = false;
            state.sucess = false;
        },
        [googleLogin.fulfilled]: (state, action) => {
            state.userInfo = action.payload.user;
            state.token = action.payload.token;
            state.isAuth = true;
            state.errors = null;
            localStorage.setItem('token', action.payload.token)
            localStorage.setItem('user', JSON.stringify(action.payload.user))
            localStorage.setItem('isAuth', true)
            state.successMessage = action.payload.message;
            state.success = true;
        },
        [googleLogin.rejected]: (state, action) => {
            state.errors = action.payload;
            state.isAuth = false;
            state.sucess = false;
        },
        // [forgotPassword.pending]: (state) => {
        //     state.loading = true;
        // },
        [forgotPassword.fulfilled]: (state, action) => {
            state.token = action.payload.token;
            state.isAuth = false;
            state.errors = null;
            localStorage.setItem('token', action.payload.token)
            state.successMessage = action.payload.message;
            state.success = true;
        },
        [forgotPassword.rejected]: (state, action) => {
            state.errors = action.payload;
            state.isAuth = false;
            state.sucess = false;
        },
        [resetPassword.fulfilled]: (state, action) => {
            state.userInfo = action.payload.user;
            state.token = action.payload.token;
            state.isAuth = false;
            state.errors = null;
            state.successMessage = action.payload.message;
            state.success = true;
        },
        [resetPassword.rejected]: (state, action) => {
            state.errors = action.payload;
            state.isAuth = false;
            state.sucess = false;
        },
        [updateUser.pending]: (state) => {
            state.loading = true;
        },
        [updateUser.fulfilled]: (state, action) => {
            state.userInfo = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('user', JSON.stringify(action.payload.user))
            state.isAuth = true;
            state.errors = null;
            state.successMessage = action.payload.message;
            state.success = true;
        },
        [updateUser.rejected]: (state, action) => {
            state.errors = action.payload;
            state.sucess = false;
        },
        [changePassword.pending]: (state) => {
            state.loading = true;
        },
        [changePassword.fulfilled]: (state, action) => {
            state.userInfo = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('user', JSON.stringify(action.payload.user))
            state.isAuth = true;
            state.errors = null;
            state.successMessage = action.payload.message;
            state.success = true;
        },
        [changePassword.rejected]: (state, action) => {
            state.errors = action.payload;
            state.sucess = false;
        },
        [updateUserImage.pending]: (state) => {
            state.loading = true;
        },
        [updateUserImage.fulfilled]: (state, action) => {
            state.userInfo = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('user', JSON.stringify(action.payload.user))
            state.isAuth = true;
            state.errors = null;
            state.successMessage = action.payload.message;
            state.success = true;
        },
        [updateUserImage.rejected]: (state, action) => {
            state.errors = action.payload;
            state.sucess = false;
        },
        [deleteUser.pending]: (state) => {
            state.loading = true;
        },
        [deleteUser.fulfilled]: (state) => {
            state.isAuth = false;
            state.errors = null;
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            localStorage.removeItem('isAuth')
            state.success = true;
        },
        [deleteUser.rejected]: (state, action) => {
            state.errors = action.payload;
            state.sucess = false;
        },
        [updateRole.pending]: (state, action) => {
            state.loading = true;
        },
        [updateRole.fulfilled]: (state, action) => {
            state.userInfo = action.payload.user;
            state.token = action.payload.token;
            localStorage.setItem('user', JSON.stringify(action.payload.user))
            state.isAuth = true;
            state.errors = null;
            state.successMessage = action.payload.message;
            state.success = true;
        },
        [getUsers.fulfilled]: (state, action) => {
            state.loading = false;
            state.users = action.payload;
            state.errors = null;
            state.successMessage = action.payload.message;
            state.success = true;
        },
        [getUsers.rejected]: (state, action) => {
            state.loading = false;
            state.errors = action.payload;
            state.sucess = false;
        },
        [banUser.pending]: (state, action) => {
            state.loading = true;
        },
        [banUser.fulfilled]: (state, action) => {
            state.token = action.payload.token;
            state.isAuth = true;
            state.errors = null;
            state.successMessage = action.payload.message;
            state.success = true;
        },

    }
});

export default userSlice.reducer;
export const { logout } = userSlice.actions;