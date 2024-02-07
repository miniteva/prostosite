import { body } from 'express-validator';


export const loginValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
];

export const registerValidation = [
    body('email', 'Неверный формат почты').isEmail(),
    body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 5 }),
    body('fullName', 'Укажите имя').isLength({ min: 3 }),
    body('avatarUrl', 'Неверная ссылка на аватарку').optional().isURL(),
];

export const menuCreateValidation = [
    body('day', 'Неправильно указан день').isString(),
    body('option', 'Неправильно указан вариант').isNumeric(),
    body('dishes', 'Неправильно указаны блюда').isArray(),
    // Добавьте другие правила валидации по необходимости
];

export const dishValidation = [
    body('name', 'Укажите наименование блюда').isString(),
    body('typeId', 'Укажите тип блюда').isMongoId(), // предполагая, что typeId - ObjectId типа

];

export const typeValidation = [
    body('name', 'Укажите тип блюда').isIn(['салат', 'первое', 'второе', 'напиток', 'десерт']),
];



