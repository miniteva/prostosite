import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchDishes = createAsyncThunk('dishes/fetchDishes', async () => {
    const {data} = await axios.get('/dishes');
    return data;
});

export const fetchRemoveDish = createAsyncThunk('dishes/fetchRemoveDish', async (id) => {
    const response = await axios.delete(`/dishes/${id}`)
    return {id};
});


const initialState = {
    dishes: {
        items: [],
        status: 'loading'
    },
};

const dishesSlice = createSlice({
    name: 'dishes',
    initialState,
    reducer: {},
    extraReducers: {
        // Получение блюд
        [fetchDishes.pending]: (state) => {
            state.dishes.status = 'loading';
        },
        [fetchDishes.fulfilled]: (state, action) => {
            state.dishes.items = action.payload;
            state.dishes.status = 'loaded';
        },
        [fetchDishes.rejected]: (state) => {
            state.dishes.items = [];
            state.dishes.status = 'error';
        },

        // Удаление блюд
        [fetchRemoveDish.pending]: (state, action) => {
            state.dishes.items = state.dishes.items.filter(obj => obj._id !== action.meta.arg);
        },



    },
});

export const dishesReducer = dishesSlice.reducer;