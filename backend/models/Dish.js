// dish.model.js
import mongoose from 'mongoose';

import MenuModel from '../models/Menu.js';
import DishModel from '../models/Dish.js';

const DishSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    typeId: {
        type: String,
        ref: 'Type',
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    avatarUrl: String,

});

DishSchema.pre('save', async function (next) {
    const dish = this;

    // Проверяем, изменился ли тип блюда
    if (dish.isModified('typeId')) {
        const type = await DishModel.findById(dish.typeId);

        // Получаем все меню, содержащие это блюдо
        const menus = await MenuModel.find({ 'dishes': dish._id });

        // Обновляем соответствующие меню
        for (const menu of menus) {
            menu.dishes = menu.dishes.map(menuDishId =>
                menuDishId.equals(dish._id) ? dish._id : menuDishId
            );
            await menu.save();
        }
    }

    next();
});



export default mongoose.model('Dish', DishSchema);
