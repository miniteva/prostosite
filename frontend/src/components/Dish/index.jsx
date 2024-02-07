// Dish.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ListItem, ListItemAvatar, Avatar, ListItemText, Typography, Divider } from '@mui/material';
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Clear";
import { fetchRemoveDish } from "../../redux/slices/dishes";
import {fetchUpdateMenu} from "../../redux/slices/menus"
import clsx from "clsx";
import styles from "../Dish/Dish.module.scss";
import {useDispatch} from "react-redux";
import {MenuSkeleton} from "../Menu/Skeleton";
import {UserInfo} from "../UserInfo";

export const Dish = (
    {
        id,
        name,
        type,
        menuId,
        user,
        createdAt,
        avatarUrl,
        isLoading,
        isEditable,
        flag
    }) => {
    const dispatch = useDispatch();
    if (isLoading) {
        return <MenuSkeleton/>;
    }
    const onClickRemove = () => {
        if (window.confirm('Вы действительно хотите удалить блюдо?')) {
            if(!flag) {
                dispatch(fetchRemoveDish(id));
            } else {
                dispatch(fetchUpdateMenu({ menuId: menuId, id: id, flag: flag }));
            }
            // Вместо fetchRemoveMenu используем fetchRemoveDish
            // Обратите внимание, что передаем id блюда, а не меню

        }
    };

    return (
        <div className={clsx(styles.root)}>
            {isLoading ? (
                <div>Loading dish...</div>
            ) : (
                <>
                    {isEditable && (
                        <div className={styles.editButtons}>
                            <Link to={`/dish/${id}/edit`}>
                                <IconButton color="primary">
                                    <EditIcon/>
                                </IconButton>
                            </Link>
                            <IconButton onClick={onClickRemove} color="secondary">
                                <DeleteIcon/>
                            </IconButton>
                        </div>
                    )}
                    <div className={styles.wrapper}>
                        {/*<UserInfo {...user} additionalText={createdAt}/>*/}
                        <div className={styles.indention}>
                            <h2 className={clsx(styles.day)}>
                                <Link to={`/dish/${id}`}>
                                    {type}
                                </Link>
                            </h2>

                            <React.Fragment key={id}>
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar alt={type} src={`http://localhost:4444${avatarUrl}`}/>
                                    </ListItemAvatar>
                                    <ListItemText

                                        primary={
                                            <Typography
                                                sx={{ color: 'white'}}  // Set the color to white
                                                component="span"
                                                variant="body1"
                                            >
                                                {name}
                                            </Typography>
                                        }
                                        secondary={
                                            <React.Fragment>
                                                <Typography
                                                    sx={{display: 'inline'}}
                                                    component="span"
                                                    variant="body2"
                                                    color="text.primary"
                                                >
                                                    {type}
                                                </Typography>
                                            </React.Fragment>
                                        }
                                    />
                                </ListItem>
                                {/*<Divider variant="inset" component="li"/>*/}
                            </React.Fragment>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
