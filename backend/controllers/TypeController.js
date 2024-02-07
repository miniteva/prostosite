import { validationResult } from 'express-validator';
import { TypeModel } from '../models/index.js';

export const getAllTypes = async (req, res) => {
    try {
        const types = await TypeModel.find();
        res.json(types);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Не удалось получить все типы блюд',
        });
    }
};
export const createType = async (req, res) => {
    try {
        // Валидация запроса
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        // Извлечение данных из запроса
        const { name } = req.body;

        // Создание нового типа блюда
        const newType = new TypeModel({
            name,
        });

        // Сохранение в базе данных
        await newType.save();

        res.status(201).json(newType);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Ошибка сервера',
        });
    }
};
