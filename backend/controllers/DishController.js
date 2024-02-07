import { MenuModel, DishModel, TypeModel } from '../models/index.js';

export const getOne = async (req, res) => {
    try {
        const dishId = req.params.id;
        const dish = await DishModel.findById(dishId)
            .populate({
            path: 'typeId',
        })
            .exec();

        if (!dish) {
            return res.status(404).json({
                message: 'Блюдо не найдено',
            });
        }

        res.json(dish);
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: 'Ошибка сервера',
        });
    }
};

export const getAll = async (req, res) => {
    try {

        const dishes = await DishModel.find()
            .populate({
            path: 'typeId'
        })
            .exec();

        res.json(dishes);
    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Не удалось получить номенуклатуру блюд",
        });
    }
};

export const create = async (req, res) => {
    try {
        const doc = new DishModel({
            name: req.body.name,
            typeId: req.body.typeId,
            avatarUrl: req.body.avatarUrl,
            user: req.userId,
            // menuId: req.body.menuId,
        });
        const dish = await doc.save();

        res.json(dish);

    } catch (e) {
        console.log(e);
        res.status(500).json({
            message: "Не удалось создать блюдо",
        });
    }
};

export const remove = async (req, res) => {
    try {
        const dishId = req.params.id;
        const result = await DishModel.findByIdAndDelete(dishId);

        if (!result) {
            return res.status(404).json({
                message: 'Блюдо не найдено',
            });
        }

        res.json({
            success: true,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: 'Не удалось удалить Блюдо',
        });
    }
};
export const update = async (req, res) => {
    try {
        const dishId = req.params.id;

        // Находим старое блюдо
        const oldDish = await DishModel.findById(dishId);
        if (!oldDish) {
            return res.status(404).json({
                message: `Блюдо с ID ${dishId} не найдено`,
            });
        }

        console.log(oldDish);

        // Проверяем, изменился ли тип блюда
        if (oldDish.typeId.toString() !== req.body.typeId) {
            // Получаем все меню, содержащие это блюдо
            const menus = await MenuModel.find({ 'dishes': dishId });

            // Проверяем, что нет двух блюд одного типа в каждом меню
            for (const menu of menus) {
                const menuDishes = await DishModel.find({ '_id': { $in: menu.dishes } });

                console.log("Типа меню:", menu);

                const typeIds = new Set();
                for (const menuDish of menuDishes) {
                    typeIds.add(menuDish.typeId.toString());
                }
                const type = await TypeModel.findById(req.body.typeId);
                if (typeIds.has(req.body.typeId)) {
                    return res.status(400).json({
                        message: `Нельзя изменить тип блюда, так как в одноим из меню будет два блюда одного типа (${type.name})`,
                    });
                }
            }
        }

        // Обновляем блюдо
        await DishModel.updateOne(
            {
                _id: dishId,
            },
            {
                name: req.body.name,
                typeId: req.body.typeId,
                avatarUrl: req.body.avatarUrl,
                user: req.userId,
            },
        );

        res.json({
            success: true,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: 'Не удалось обновить блюдо',
        });
    }
};
