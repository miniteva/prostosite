import express from 'express';
import multer from 'multer';
import cors from 'cors';
import mongoose from 'mongoose';
import {registerValidation, loginValidation, menuCreateValidation, dishValidation, typeValidation} from './validations.js';
import {checkAuth, handleValidationErrors} from "./utils/index.js";
import { UserController, MenuController, DishController, TypeController } from './controllers/index.js'
// import {deleteDishFromMenu} from "./controllers/MenuController.js";





mongoose
    .connect("mongodb+srv://admin:wwwwww@restaurant.woond4b.mongodb.net/restaurant?retryWrites=true&w=majority")
    .then(() => console.log("DB OK"))
    .catch((err) => console.log("DB ERROR!", err));

const app = express();


const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));


// login
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

// upload any img
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    try {
        res.json({
            url: `/uploads/${req.file.originalname}`,
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({
            message: 'Не удалось загрузить картинку',
        });
    }
});

// menu all api
app.get('/menu/:id', MenuController.getOne);
app.get('/menu', MenuController.getAll);
app.post('/menu', checkAuth, menuCreateValidation, handleValidationErrors, MenuController.create);
app.delete('/menu/:id', checkAuth, MenuController.remove);
app.patch('/menu/:id', checkAuth, menuCreateValidation, handleValidationErrors, MenuController.update);
app.post('/menu/transferDishes', checkAuth, handleValidationErrors, MenuController.transferDishes);
// app.patch('/menu/deleteDishFromMenu/:id', checkAuth, handleValidationErrors, MenuController.deleteDishFromMenu)

// dish all api
app.get('/dishes', DishController.getAll);
app.get('/dishes/:id', DishController.getOne);
app.post('/dishes', checkAuth, dishValidation, handleValidationErrors, DishController.create);
app.patch('/dishes/:id', checkAuth, dishValidation, handleValidationErrors, DishController.update);
app.delete('/dishes/:id', checkAuth, DishController.remove);

// types all api есть проверки на авторизацию и мини проверки с помощью express-validator
app.get('/types', TypeController.getAllTypes);
app.post('/types', checkAuth, typeValidation, handleValidationErrors, TypeController.createType);


app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log("Server OK!")
});

