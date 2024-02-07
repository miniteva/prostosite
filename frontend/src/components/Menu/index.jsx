// Menu.jsx
import React, {useEffect} from 'react';
import { Link } from 'react-router-dom';
import clsx from 'clsx';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Clear';
import EditIcon from '@mui/icons-material/Edit';
import { List, ListItem, ListItemText, ListItemAvatar, Avatar, Typography } from '@mui/material';

import styles from './Menu.module.scss';
import { UserInfo } from '../UserInfo';
import { MenuSkeleton } from './Skeleton';
import { useDispatch } from "react-redux";
import { fetchRemoveMenu } from "../../redux/slices/menus";
import { Dish } from "../Dish";
import axios from "../../axios";

export const Menu = ({
                         id,
                         day,
                         option,
                         createdAt,
                         user,
                         dishes,
                         isFullMenu,
                         isLoading,
                         isEditable,
                         userData,
                     }) => {
    const dispatch = useDispatch();
    if (isLoading) {
        return <MenuSkeleton/>;
    }

    const onClickRemove = () => {
        if (window.confirm('Вы действительно хотите удалить меню?')) {
            dispatch(fetchRemoveMenu(id));
        }
    };

    return (
        <div className={clsx(styles.root, { [styles.rootFull]: isFullMenu })}>

            {isEditable && (
                <div className={styles.editButtons}>
                    <Link to={`/menu/${id}/edit`}>
                        <IconButton color="primary">
                            <EditIcon />
                        </IconButton>
                    </Link>
                    <IconButton onClick={onClickRemove} color="secondary">
                        <DeleteIcon />
                    </IconButton>
                </div>
            )}
            <div className={styles.wrapper}>
                <UserInfo {...user} additionalText={createdAt} />
                <div className={styles.indention}>
                    <h2 className={clsx(styles.day, { [styles.dayFull]: isFullMenu })}>
                        {isFullMenu ? (
                            <>{day} - {option}</>
                        ) : (
                            <Link to={`/menu/${id}`}>
                                {day} - №{option}
                            </Link>
                        )}
                    </h2>
                    {dishes && (
                        <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
                            {dishes.map((dish, index) => (
                                // console.log(JSON.stringify({
                                //     day,
                                //     dishes: dishes.filter((d, i) => i !== index).map((d) => d._id),
                                //     option,
                                // }))
                                // console.log({
                                //     day,
                                //     dishes: dishes.filter((d, i) => i !== index).map((d) => d._id),
                                //     option,
                                // })
                                <Dish
                                    key={dish._id}
                                    id={dish._id}
                                    name={dish.name}
                                    user={dish.user}
                                    menuId={id}
                                    type={dish.typeId.name}
                                    avatarUrl={dish.avatarUrl}
                                    isLoading={false}
                                    isEditable={userData?._id === user?._id}
                                    // flag={JSON.stringify({
                                    //     day,
                                    //     dishes: dishes.filter((d, i) => i !== index).map((d) => d._id),
                                    //     option,
                                    // })}
                                    flag={{
                                        day,
                                        dishes: dishes.filter((d, i) => i !== index).map((d) => d._id),
                                        option,
                                    }}
                                    // flag={JSON.stringify(dishes.filter((d, i) => i !== index))}
                                />
                            ))}
                        </List>
                    )}
                </div>
            </div>
        </div>
    );
};
