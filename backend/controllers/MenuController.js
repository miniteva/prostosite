import { MenuModel, DishModel, TypeModel } from '../models/index.js';
export const getOne = async (req, res) => {
    try {
        const menuId = req.params.id;
        const menu = await MenuModel
            .findById(menuId)
            .populate({
            path: 'user',
            select: '-passwordHash'
        })
            .populate({
            path: 'dishes', // Указываем путь к полю dish внутри массива dishes
                populate: {
                    path: 'typeId',
                }

        })
            .exec();

        if (!menu) {
            return res.status(404).json({
                message: 'Меню не найдено',
            });
        }

        res.json(menu);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: 'Ошибка сервера',
        });
    }
};
export const getAll = async (req, res) => {
    try {

        const menus = await MenuModel.find().populate({
            path: 'user',
            select: '-passwordHash' // исключаем поле passwordHash
        }).populate({
            path: 'dishes', // Указываем путь к полю dish внутри массива dishes
            populate: {
                path: 'typeId',
            }

        })
            .exec();

        res.json(menus);
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Не удалось получить все меню",
        });
    }
};
export const create = async (req, res) => {
    try {
        const { day, dishes, option } = req.body;
        const userId = req.userId;

        // Проверяем, что в меню нет двух блюд одного типа
        const typeIds = [];
        for (const dishId of dishes) {
            try {
                const dish = await DishModel.findById(dishId);
                if (!dish) {
                    return res.status(404).json({
                        message: `Блюдо с ID ${dishId} не найдено`,
                    });
                }
                const type = await TypeModel.findById(dish.typeId);
                if (typeIds.includes(dish.typeId.toString())) {
                    return res.status(400).json({
                        message: `Нельзя добавить меню с двумя блюдами одного типа (${type.name})`,
                    });
                }

                typeIds.push(dish.typeId.toString());
            } catch (error) {
                console.error(error);
                return res.status(500).json({
                    message: "Произошла ошибка при проверке блюда",
                });
            }
        }

        // Если проверка успешна, создаем и сохраняем меню
        const doc = new MenuModel({
            day,
            dishes,
            option,
            user: userId,
        });
        const menu = await doc.save();

        res.json(menu);

    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: "Не удалось создать меню",
        });
    }
};
export const remove = async (req, res) => {
    try {
        const menuId = req.params.id;
        const result = await MenuModel.findByIdAndDelete(menuId);

        if (!result) {
            return res.status(404).json({
                message: 'Меню не найдено',
            });
        }

        res.json({
            success: true,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Не удалось удалить меню',
        });
    }
};
export const update = async (req, res) => {
    try {
        const menuId = req.params.id;
        const { day, dishes, option } = req.body;

        // Проверяем, что в меню нет двух блюд одного типа
        const typeIds = [];
        for (const dishId of dishes) {
            try {
                const dish = await DishModel.findById(dishId);
                if (!dish) {
                    return res.status(404).json({
                        message: `Блюдо с ID ${dishId} не найдено`,
                    });
                }
                const type = await TypeModel.findById(dish.typeId);
                if (typeIds.includes(dish.typeId.toString())) {
                    return res.status(400).json({
                        message: `Нельзя обновить меню с двумя блюдами одного типа (${type.name})`,
                    });
                }

                typeIds.push(dish.typeId.toString());
            } catch (error) {
                console.error(error);
                return res.status(500).json({
                    message: "Произошла ошибка при проверке блюда",
                });
            }
        }

        // Если проверка успешна, обновляем меню
        await MenuModel.updateOne(
            {
                _id: menuId,
            },
            {
                day,
                dishes,
                option,
                user: req.userId,
            }
        );
        res.json({
            success: true,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: 'Не удалось обновить меню',
        });
    }
};


export const transferDishes = async (req, res) => {
    try {
        const sourceMenuId = req.body.sourceMenuId;
        const targetMenuId = req.body.targetMenuId;
        const dishIdsToTransfer = req.body.dishIds;

        // Находим исходное и целевое меню
        const sourceMenu = await MenuModel.findById(sourceMenuId);
        const targetMenu = await MenuModel.findById(targetMenuId);

        // Проверяем, что оба меню существуют
        if (!sourceMenu || !targetMenu) {
            return res.status(404).json({
                message: 'Одно из меню не найдено',
            });
        }

        // Переносим блюда из исходного меню в целевое
        sourceMenu.dishes = sourceMenu.dishes.filter(dishId => !dishIdsToTransfer.includes(dishId.toString()));
        targetMenu.dishes = [...targetMenu.dishes, ...dishIdsToTransfer];

        // Сохраняем обновленные меню
        await sourceMenu.save();
        await targetMenu.save();

        res.json({
            success: true,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: 'Не удалось выполнить перенос блюд',
        });
    }
};