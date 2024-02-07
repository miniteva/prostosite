import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from '../../axios';

import styles from './AddDish.module.scss';
import {useSelector} from "react-redux";
import {selectIsAuth} from "../../redux/slices/auth";
import {Navigate, useNavigate, useParams} from "react-router-dom";

import {darkTheme, theme} from "../../theme";

export const AddDish = () => {
    const {id} = useParams();
    const isAuth = useSelector(selectIsAuth);
    const [name, setName] = useState('');
    const [typeId, setTypeId] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState('');
    const [typeList, setTypeList] = useState([]);
    const navigate = useNavigate();

    const isEditing = Boolean(id);
    useEffect(() => {
        // Получение списка типов блюд с сервера
        axios.get('/types').then((response) => {
            setTypeList(response.data);
        });
    }, []);

    React.useEffect(() => {
        if(id) {
            axios.get(`/dishes/${id}`).then(({data}) => {
                setName(data.name);
                setImage(`http://localhost:4444${data.avatarUrl}`);
                setTypeId(data.typeId._id);
            })
        }
    }, [])

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleCreateDish = async () => {
        try {
            if (!name || !typeId) {
                alert('Укажите наименование блюда и тип блюда');
                return;
            }

            let avatarUrl = null;

            // Если есть изображение, загружаем его на сервер и получаем URL
            if (image) {
                const formData = new FormData();
                formData.append('image', image);

                // Отправляем изображение на сервер
                const imageResponse = await axios.post('/upload', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                // Получаем URL изображения из ответа сервера
                avatarUrl = imageResponse.data.url;
            }

            // Формируем данные для запроса создания блюда
            const requestData = {
                name: name,
                typeId: typeId,
                avatarUrl: avatarUrl,
            };

            const {data} = isEditing
                ? await axios.patch(`/dishes/${id}`, requestData)
                : await axios.post('/dishes', requestData);

            const _id = isEditing ? id : data._id;
            navigate(`/dish/${_id}`)

        } catch (error) {
            console.error('Ошибка при создании блюда:', error);
            if (error.response) {
                console.error('Ответ сервера:', error.response.data);
            }
            alert(error.response.data.message)

        }
    };


    if(!window.localStorage.getItem('token') && !isAuth) {
        return <Navigate to="/" />
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
        <Paper style={{ padding: 30 }} >
            <TextField
                classes={{ root: styles.title }}
                variant="standard"
                placeholder="Название блюда..."
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            {/* Выбор типа блюда */}
            <Select style={{ marginBottom: 15 }}
                value={typeId}
                onChange={(e) => setTypeId(e.target.value)}
                displayEmpty
                fullWidth
            >
                <MenuItem value="" disabled>
                    Выберите тип блюда
                </MenuItem>
                {typeList.map((type) => (
                    <MenuItem key={type.id} value={type._id}>
                        {type.name}
                    </MenuItem>
                ))}
            </Select>
            {/* Загрузка изображения блюда */}
            <input style={{ marginBottom: 15 }}
                type="file"
                onChange={handleImageChange}
                id="imageInput"  // Добавленный идентификатор для элемента input
            />
            {imagePreview && <img src={imagePreview} alt="Image Preview" />}
            <div className={styles.buttons}>
                <Button size="large" variant="contained" onClick={handleCreateDish}>
                    {isEditing ? 'Сохранить' : 'Создать блюдо'}
                </Button>
                <a href="/">
                    <Button size="large">Отмена</Button>
                </a>
            </div>
        </Paper>
        </div>
    );
};
