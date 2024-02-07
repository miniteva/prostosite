// type.model.js
import mongoose from 'mongoose';

const TypeSchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['салат', 'первое', 'второе', 'напиток', 'десерт'],
        required: true,
    },
});

export default mongoose.model('Type', TypeSchema);
