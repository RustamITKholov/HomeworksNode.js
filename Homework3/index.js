const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

const counterFile = path.join(__dirname, 'counter.json');

let counters = {'/': 0, '/about': 0};

function loadCounters() {
    try {
        if (fs.existsSync(counterFile)) {
            const data = fs.readFileSync(counterFile, 'utf-8');
            counters = JSON.parse(data);
        }
    } catch (error) {
        console.error(`Ошибка при загрузке счётчиков: ${error}`);
    }
}

function saveCounters() {
    try {
        fs.writeFileSync(counterFile, JSON.stringify(counters, null, 2));
    } catch (error) {
        console.error(`Ошибка при сохранении счетчиков: ${error}`);
    }
}

loadCounters();

app.get('/', (req, res) => {
    counters['/'] += 1;
    saveCounters();
    res.send(`<h1>Главная страница</h1><p>Количество просмотров: ${counters['/']}</p><a href="/about">Перейти на страницу обо мне</a>`)
});

app.get('/about', (req, res) => {
    counters['/about'] += 1;
    saveCounters();
    res.send(`<h1>Страница обо мне</h1><p>Количество просмотров: ${counters['/about']}</p><a href="/">Перейти на главную страницу</a>`);
});

app.listen(port, () => {
    console.log(`Сервер запущен на порту: ${port}`);
})