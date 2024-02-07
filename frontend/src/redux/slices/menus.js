import {createSlice, createAsyncThunk} from "@reduxjs/toolkit";
import axios from "../../axios";

export const fetchMenu = createAsyncThunk('menus/fetchMenu', async () => {
    const {data} = await axios.get('/menu');
    return data;
});

export const fetchRemoveMenu = createAsyncThunk('menus/fetchRemoveMenu', async (id) =>
    axios.delete(`/menu/${id}`)
);

export const fetchUpdateMenu = createAsyncThunk('menus/fetchUpdateMenu', async ({ menuId, id, flag }) => {
    const response = await axios.patch(`/menu/${menuId}`, flag);
    return { menuId };
});

export const transferDishes = createAsyncThunk('menus/transferDishes', async ({ sourceMenuId, targetMenuId, dishIds }) => {
    const response = await axios.post('/transfer-dishes', { sourceMenuId, targetMenuId, dishIds });
    return response.data;
});

const initialState = {
    menus: {
        items: [],
        status: 'loading'
    }
};

const menusSlice = createSlice({
    name: 'menus',
    initialState,
    reducer: {},
    extraReducers: {
        // Получение меню
        [fetchMenu.pending]: (state) => {
            state.menus.status = 'loading';
        },
        [fetchMenu.fulfilled]: (state, action) => {
            state.menus.items = action.payload;
            state.menus.status = 'loaded';
        },
        [fetchMenu.rejected]: (state) => {
            state.menus.items = [];
            state.menus.status = 'error';
        },

        // Удаление меню
        [fetchRemoveMenu.pending]: (state, action) => {
            state.menus.items = state.menus.items.filter(obj => obj._id !== action.meta.arg);
        },





        //Обновление меню
        [fetchUpdateMenu.pending]: (state) => {
            state.menus.status = 'loading';
        },
        [fetchUpdateMenu.fulfilled]: (state, action) => {
            const updatedMenuId = action.meta.arg.menuId;
            const updatedDishId = action.meta.arg.id;

            const index = state.menus.items.findIndex(menu => menu._id === updatedMenuId);

            if (index !== -1) {
                // Используем map для обновления массива dishes
                state.menus.items[index] = {
                    ...state.menus.items[index],
                    dishes: state.menus.items[index].dishes.filter(dish => dish._id !== updatedDishId),
                };
            }

            state.menus.status = 'loaded';
        },


        [transferDishes.pending]: (state) => {
            state.menus.status = 'loading';
        },
        [transferDishes.fulfilled]: (state, action) => {
            // Handle the successful transfer if needed
            state.menus.status = 'loaded';
        },
        [transferDishes.rejected]: (state) => {
            // Handle the error if needed
            state.menus.status = 'error';
        },


    },
});

export const menuReducer = menusSlice.reducer;