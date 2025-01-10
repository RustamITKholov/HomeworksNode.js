const http = require('http');
const server = http.createServer((req, res) => {
    console.log('Запрос отправлен');

    if (req.url === '/') {
        res.writeHead(200, {
            'content-type': 'text/html; charset=UTF-8' 
        })
        res.end('<a href="/about">Перейти на станицу обо мне</a>')
    } else if(req.url === '/about') {
        res.writeHead(200, {
            'content-type': 'text/html; charset=UTF-8'
        })
        res.end('<a href="/">Перейти на главную страницу</a>')
    } else {
        res.writeHead(404, {
            'content-type': 'text/html; charset=UTF-8'
        })
        res.end('<h1 style="color: red">Error: 404. Страница не найдена</h1>')
    }
})

const port = 3000;

server.listen(port, () => {
    console.log(`Сервер запущен на порту ${port}`);
})