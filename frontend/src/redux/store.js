import {configureStore} from "@reduxjs/toolkit";
import {menuReducer} from "./slices/menus";
import {authReducer} from "./slices/auth"
import {dishesReducer} from "./slices/dishes";

const store = configureStore({
    reducer: {
        menus: menuReducer,
        auth: authReducer,
        dishes: dishesReducer,
    }
});

export default store;