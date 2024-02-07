import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from '../../axios';

import styles from './AddMenu.module.scss';
import { useSelector } from 'react-redux';
import { selectIsAuth } from '../../redux/slices/auth';
import { useNavigate, Navigate, useParams } from 'react-router-dom';

import {darkTheme, theme} from "../../theme";

export const AddMenu = () => {
    const {id} = useParams();
    const isAuth = useSelector(selectIsAuth);
    const [day, setDay] = useState('');
    const [dishes, setDishes] = useState([]);
    const [selectedDish, setSelectedDish] = useState('');
    const [existingDishes, setExistingDishes] = useState([]);
    const [option, setOption] = useState('');
    const [error, setError] = useState('');
    const [createdMenu, setCreatedMenu] = useState(null);
    const navigate = useNavigate();

    const isEditing = Boolean(id);

    useEffect(() => {
        // Получение списка существующих блюд с сервера
        axios.get('/dishes').then((response) => {
            setExistingDishes(response.data);
        });
    }, []);

    React.useEffect(() => {
        if(id) {
            axios.get(`/menu/${id}`).then(({data}) => {
                setDay(data.day);
                setDishes(data.dishes);
                setOption(data.option);
            })
        }
    }, [])

    const handleAddDish = async () => {
        try {
            if (!selectedDish) {
                alert('Выберите блюдо');
                return;
            }

            // Получение информации о выбранном блюде
            const response = await axios.get(`/dishes/${selectedDish}`);
            const dishInfo = response.data;

            // Добавление выбранного блюда в список блюд меню
            setDishes((prevDishes) => [...prevDishes, dishInfo]);
            // Сброс выбранного блюда
            setSelectedDish('');
        } catch (error) {
            console.error('Ошибка при получении информации о блюде:', error);
            // Обработка ошибки, например, вывод сообщения пользователю
            setError('Ошибка при получении информации о блюде');
        }
    };

    const handleRemoveDish = (dishId) => {
        setDishes((prevDishes) => prevDishes.filter((dish) => dish._id !== dishId));
    };

    const handleCreateMenu = async () => {
        try {
            if (dishes.length === 0) {
                alert('Добавьте блюда в меню');
                return;
            }
            const fields = {
                day,
                dishes,
                option,
            };

            const {data} = isEditing
                ? await axios.patch(`/menu/${id}`, fields)
                : await axios.post('/menu', fields);

            const _id = isEditing ? id : data._id;
            navigate(`/menu/${_id}`)

            // Дополнительные действия, например, перенаправление на страницу с созданным меню
        } catch (error) {
            console.error('Ошибка при создании меню:', error);
            alert(error.data?.message || 'Ошибка при создании меню');
        }
    };

    if (!window.localStorage.getItem('token') && !isAuth) {
        return <Navigate to="/" />;
    }


    return (
        <div
            style={{
                background: darkTheme.palette.background.default,
                minHeight: "100vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
        <Paper style={{ padding: 30 }}>
            <TextField
                classes={{ root: styles.title }}
                variant="standard"
                placeholder="Название меню..."
                fullWidth
                value={day}
                onChange={(e) => setDay(e.target.value)}
            />

            <Select
                value={selectedDish}
                onChange={(e) => setSelectedDish(e.target.value)}
                displayEmpty
                fullWidth
                classes={{ root: styles.select }}
            >
                <MenuItem value="" disabled>
                    Выберите блюдо
                </MenuItem>
                {existingDishes.map((dish) => (
                    <MenuItem key={dish._id} value={dish._id}>
                        {dish.name}
                    </MenuItem>
                ))}
            </Select>

            <Button variant="outlined" size="large" onClick={handleAddDish}>
                Добавить блюдо
            </Button>

            <div className={styles.dishesContainer}>
                <p>Выбранные блюда:</p>
                <ul>
                    {dishes.map((dishInfo) => (
                        <li key={dishInfo._id}>
                            {dishInfo.name}
                            <Button onClick={() => handleRemoveDish(dishInfo._id)}>Удалить</Button>
                        </li>
                    ))}
                </ul>
            </div>
            <TextField
                classes={{ root: styles.title }}
                variant="standard"
                placeholder="Вариант..."
                fullWidth
                value={option}
                onChange={(e) => setOption(e.target.value)}
            />

            <div className={styles.buttons}>
                <Button size="large" variant="contained" onClick={handleCreateMenu}>
                    {isEditing ? 'Сохранить' : 'Создать меню'}
                </Button>
                <a href="/">
                    <Button size="large">Отмена</Button>
                </a>
            </div>

        </Paper>
        </div>
    );
};
