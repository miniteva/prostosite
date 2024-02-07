// menu.model.js
import mongoose from 'mongoose';

const MenuSchema = new mongoose.Schema({
    day: {
        type: String,
        required: true,
    },
    dishes: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Dish',
        },
    ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    option: Number,
}, {
    timestamps: true,
});

export default mongoose.model('Menu', MenuSchema);
