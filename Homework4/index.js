/**
 * Создание REST API с Express
 Для того, чтобы пользователи хранились постоянно, а не только, когда запущен сервер, необходимо реализовать хранение массива в файле.

Подсказки:
— В обработчиках получения данных по пользователю нужно читать файл
— В обработчиках создания, обновления и удаления нужно файл читать, чтобы убедиться, что пользователь существует, а затем сохранить в файл, когда внесены изменения
— Не забывайте про JSON.parse() и JSON.stringify() - эти функции помогут вам переводить объект в строку и наоборот.
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const joi = require('joi');


const userSchema = joi.object({
    firstName: joi.string().min(2).required(),
    secondName: joi.string().min(2).required(),
    age: joi.number().min(1).max(100).required(),
    city: joi.string().min(3)
}); //схема валидации


const app = express();

const dataFile = path.join(__dirname, 'dataUSers.json');

let users = [];
let uniqId = 0;

function loadUsers() {
    try {
        if (fs.existsSync(dataFile)) {
            const data = fs.readFileSync(dataFile, 'utf-8');
            users = JSON.parse(data);

            if (users.length > 0) {
                uniqId = Math.max(...users.map(user => user.id));
            } else uniqId = 0;
        }
    } catch (error) {
        console.error(`Ошибка при загрузке пользователей: ${error}`);
    }
}

function saveUsers() {
    try {
        fs.writeFileSync(dataFile, JSON.stringify(users, null, 2));
    } catch (error) {
        console.error(`Ошибка записи: ${error}`);
    }
}


loadUsers();


app.use(express.json());

app.get('/users', (req, res) => {
    saveUsers();
    res.send({ message: 'Список пользователей:', users });
});


app.get('/users/:id', (req, res) => {
    const user = users.find((user) => user.id === +req.params.id);
    if (user) {
        res.send({ user });
    } else {
        res.status(404).send({ user: null });
    }
});



app.post('/users', (req, res) => {

    const result = userSchema.validate(req.body);
    if (result.error) {
        return res.status(404).send({ error: result.error.details });
    } // код валидации

    uniqId += 1;
    users.push({
        id: uniqId,
        ...req.body
    });
    saveUsers();
    res.send({ message: 'Добавлен новый пользователь!', id: uniqId });
});


app.put('/users/:id', (req, res) => {

    const result = userSchema.validate(req.body);
    if (result.error) {
        return res.status(404).send({ error: result.error.details });
    } //код валидации


    const user = users.find((user) => user.id === +req.params.id);
    if (user) {
        for (const key in user) {
            if (Object.prototype.hasOwnProperty.call(req.body, key)) {
                user[key] = req.body[key];
            }
        }
        saveUsers();
        res.send({ message: 'Пользователь обновлен', user });
    } else {
        res.status(404);
        res.send({ user: null });
    }
});


app.delete('/users/:id', (req, res) => {
    const user = users.find((user) => user.id === +req.params.id);
    if (user) {
        const userIndex = users.indexOf(user);
        users.splice(userIndex, 1);

        res.send({ message: 'Пользователь удален:', user });
    } else {
        res.status(404).send({ user: null });
    }
});


app.listen(3000, () => {
    console.log(`Сервер запущен!`);
});
