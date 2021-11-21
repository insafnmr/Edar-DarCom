import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

export const addNewConversation = createAsyncThunk('chat/addNewConversation', async (info, { rejectWithValue, dispatch }) => {
    try {
        const res = await axios.post(`/chat/new/conversation/${info.id}`, info.data, {
            headers: { token: localStorage.getItem('token') },
        })
        dispatch(getConversations());
        return res.data;
    } catch (error) {
        return rejectWithValue(
            error.response.data.message
        );
    }
})

export const addMessage = createAsyncThunk('chat/addMessage', async (info, { rejectWithValue, dispatch }) => {
    try {
        const res = await axios.post('/chat/new/message', info, {
            headers: { token: localStorage.getItem('token') },
        })
        dispatch(getMessages(info.conversation))
        return res.data;
    } catch (error) {
        return rejectWithValue(
            error.response.data.message
        );
    }
})

export const getMessages = createAsyncThunk('chat/getMessages', async (id, { rejectWithValue }) => {
    try {
        const res = await axios.get(`/chat/messages/${id}`, {
            headers: { token: localStorage.getItem('token') },
        });
        return res.data;
    } catch (error) {
        return rejectWithValue(
            error.response.data.message
        );
    }
})

export const getConversations = createAsyncThunk('chat/getConversations', async (info, { rejectWithValue }) => {
    try {

        const res = await axios.get('/chat/conversationList', {
            headers: { token: localStorage.getItem('token') },
        });
        return res.data;
    } catch (error) {
        return rejectWithValue(
            error.response.data.message
        );
    }
})

export const getConversation = createAsyncThunk('chat/getConversation', async (id, { rejectWithValue }) => {
    try {
        console.log('id', id)

        const res = await axios.get(`/chat/conversation/${id}`, {
            headers: { token: localStorage.getItem('token') },
        });
        return res.data;
    } catch (error) {
        return rejectWithValue(
            error.response.data.message
        );
    }
})

export const deleteConversation = createAsyncThunk('chat/deleteConversation', async (id, { rejectWithValue, dispatch }) => {
    try {
        const res = await axios.delete(`/chat/deleteconversation/${id}`, {
            headers: { token: localStorage.getItem('token') },
        });
        dispatch(getConversations());
        return res.data;
    } catch (error) {
        return rejectWithValue(
            error.response.data.message
        );
    }
});

const chatSlice = createSlice({
    name: 'chat',
    initialState: {
        conversations: [],
        conversation: {},
        currentConversation: null,
        messages: [],
        msg: {},
        loading: false,
        errors: null,
    },
    reducers: {
        currentConversation: (state, action) => {
            state.currentConversation = action.payload
        }
    },
    extraReducers: {
        [addNewConversation.fulfilled]: (state, action) => {
            state.loading = false;
            state.conversation = action.payload;
            state.errors = null;

        },
        [addNewConversation.rejected]: (state, action) => {
            state.errors = action.payload;
        },
        [addMessage.fulfilled]: (state, action) => {
            state.loading = false;
            state.msg = action.payload;
            state.errors = null;

        },
        [addMessage.rejected]: (state, action) => {
            state.errors = action.payload;
        },
        [getConversations.pending]: (state) => {
            state.loading = true;
        },
        [getConversations.fulfilled]: (state, action) => {
            state.loading = false;
            state.conversations = action.payload;
            state.errors = null;
        },
        [getConversations.rejected]: (state, action) => {
            state.loading = false;
            state.errors = action.payload;
        },
        [getConversation.fulfilled]: (state, action) => {
            state.loading = false;
            state.conversation = action.payload;
            state.errors = null;
        },
        [getConversation.rejected]: (state, action) => {
            state.loading = false;
            state.errors = action.payload;
        },
        [getMessages.fulfilled]: (state, action) => {
            state.loading = false;
            state.messages = action.payload;
            state.errors = null;
        },
        [getMessages.rejected]: (state, action) => {
            state.loading = false;
            state.errors = action.payload;
        },
        [deleteConversation.fulfilled]: (state) => {
            state.loading = false;
            state.conversation = {};
            state.errors = null;
        },
        [deleteConversation.rejected]: (state, action) => {
            state.loading = false;
            state.errors = action.payload;
        },
    }
});
export const { currentConversation } = chatSlice.actions
export default chatSlice.reducer;
