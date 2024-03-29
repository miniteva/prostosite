import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Navigate} from "react-router-dom";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import {useForm} from 'react-hook-form';

import styles from "./Login.module.scss";
import {fetchAuth, selectIsAuth} from "../../redux/slices/auth";

import {darkTheme, theme} from "../../theme";
export const Login = () => {
    const isAuth = useSelector(selectIsAuth);
    const dispatch = useDispatch();

    const {
        register,
        handleSubmit,
        setError,
        formState: {errors, isValid}
    } = useForm({
        defaultValues: {// тут дефолтные значения при разработке

        },
        mode: 'onChange'

    })

    const onSubmit = async (values) => {
        const data = await dispatch(fetchAuth(values));
        if (!data.payload) {
            return alert('Не удалось авторизоваться')
        } else {
            if('token' in data.payload){
                window.localStorage.setItem('token', data.payload.token);
            }
        }
    }

    if(isAuth) {
        return <Navigate to="/"/>
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
        <Paper sx={{ background: darkTheme.palette.background.paper, padding: 2 }} classes={{root: styles.root}}>
            <Typography classes={{root: styles.title}} variant="h5">
                Вход в аккаунт
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <TextField
                    className={styles.field}
                    label="E-Mail"
                    type="email"
                    error={Boolean(errors.email?.message)}
                    helperText={errors.email?.message}
                    {...register('email', {required: 'Укажите почту'})}
                    fullWidth
                />
                <TextField
                    className={styles.field}
                    label="Пароль"
                    type="password"
                    error={Boolean(errors.password?.message)}
                    helperText={errors.password?.message}
                    {...register('password', {required: 'Укажите пароль'})}
                    fullWidth
                />
                <Button disabled={!isValid} type="submit" size="large" variant="contained" fullWidth>
                    Войти
                </Button>
            </form>
        </Paper>
            </div>
    );
};
