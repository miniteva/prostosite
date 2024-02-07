// Home.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Menu } from '../components/Menu';
import { Dish } from '../components/Dish';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchMenu, transferDishes } from '../redux/slices/menus';
import { fetchDishes } from '../redux/slices/dishes';
import {darkTheme, theme} from "../../src/theme";
export const Home = () => {
    const dispatch = useDispatch();
    const { menus } = useSelector((state) => state.menus);
    const { dishes } = useSelector((state) => state.dishes);
    const userData = useSelector((state) => state.auth.data);
    // const {menusList} = useSelector((state) => state.menu.items); // с автообновлением чет сделать

    const isDishesLoading = dishes.status === 'loading';
    const isMenusLoading = menus.status === 'loading';

    const [selectedDishes, setSelectedDishes] = useState([]);

    useEffect(() => {
        dispatch(fetchMenu());
        dispatch(fetchDishes());
        // dispatch()
    }, [dispatch]);

    console.log(menus);
    console.log(dishes);


    const handleTransferButtonClick = () => {
        // Handle the transfer logic using the selected dishes
        const sourceMenuId = 'yourSourceMenuId';  // Replace with the actual source menu ID
        const targetMenuId = 'yourTargetMenuId';  // Replace with the actual target menu ID

        dispatch(transferDishes({ sourceMenuId, targetMenuId, dishIds: selectedDishes }));
        // Reset the selected dishes state
        setSelectedDishes([]);
    };


    return (
        <div
            style={{
                background: darkTheme.palette.background.default,
                minHeight: "100vh",
                justifyContent: "center",
                alignItems: "center"
            }}
        >

            <Tabs style={{ marginBottom: 15 }} value={0} aria-label="basic tabs example">
                <Tab label="Текущие меню" />
                <Tab label="Популярные" />
            </Tabs>
            <Grid container spacing={4} >
                <Grid xs={8} item>
                    {/* Ваш код для отображения меню */}
                    {(isMenusLoading ? [...Array(5)] : menus.items).map((obj, index) =>
                        isMenusLoading ? (
                            <Menu key={index} isLoading={true} />
                        ) : (
                            <Menu
                                id={obj._id}
                                day={`${obj.day}`}
                                user={obj.user}
                                userData={userData}
                                createdAt={new Date(obj.createdAt).toLocaleDateString('ru-RU')}
                                dishes={sortDishesByTypeOrder([...obj.dishes])}
                                option={obj.option}
                                isEditable={userData?._id === obj.user._id}
                            />
                        )
                    )}
                </Grid>
                <Grid xs={4} item>
                    {(isDishesLoading ? [...Array(5)] : dishes.items).map((obj, index) =>
                        isDishesLoading ? (
                            <Dish key={index} isLoading={true} />
                        ) : (
                            <Dish
                                key={obj._id}
                                id={obj._id}
                                name={obj.name}
                                user={obj.user}
                                type={obj.typeId.name}
                                avatarUrl={obj.avatarUrl}
                                isLoading={false}
                                isEditable={userData?._id === obj?.user}
                                // isEditable={true}
                            />
                        )
                    )}
                </Grid>
            </Grid>
        </div>
    );
};

function sortDishesByTypeOrder(dishes) {
    const dishTypesOrder = ['салат', 'первое', 'второе', 'напиток', 'десерт'];
    return dishes.sort((a, b) => {
        const typeAIndex = dishTypesOrder.indexOf(a.typeId.name);
        const typeBIndex = dishTypesOrder.indexOf(b.typeId.name);

        return typeAIndex - typeBIndex;
    });
}
