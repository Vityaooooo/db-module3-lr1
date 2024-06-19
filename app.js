// работа с базой данных.
const Mysql = require('sync-mysql')
const connection = new Mysql({
    host:'localhost', 
    user:'root', 
    password:'1234', 
    database:'lr_1'
})

const path = require('path');
const fs = require('fs');
const qs = require('querystring');
const http = require('http');

// обработка параметров из формы.
function reqPost (request, response) {
    if (request.method == 'POST') {
        let body = '';

        request.on('data', function (data) {
            body += data;
        });

        request.on('end', function () {
			const post = qs.parse(body);
			const sInsert = `INSERT INTO individuals (first_name, last_name, sur_name, passport, inn, snils, driver_license, additional_docs, notes) 
							 VALUES ("${post['col1']}", "${post['col2']}", "${post['col3']}", "${post['col4']}", "${post['col5']}", "${post['col6']}", "${post['col7']}", "${post['col8']}", "${post['col9']}")`;
			const results = connection.query(sInsert);
            console.log('Done. Hint: '+sInsert);
        });
    }
}

// выгрузка массива данных.
function ViewSelect(res) {
	const results = connection.query('SHOW COLUMNS FROM individuals');
	res.write('<tr>');
	for(let i = 0; i < results.length; i++)
		res.write('<th>'+results[i].Field+'</th>');
	res.write('</tr>');

	const qr = connection.query('SELECT * FROM individuals ORDER BY id DESC');
	for(let i = 0; i < qr.length; i++) {
		res.write('<tr>');
		for (let field in qr[i]) {
			res.write('<td>' + (qr[i][field] || '') + '</td>');
		}
		res.write('</tr>');
	}
}
function ViewVer(res) {
	const results = connection.query('SELECT VERSION() AS ver');
	res.write(results[0].ver);
}

// создание ответа в браузер, на случай подключения.
const server = http.createServer((req, res) => {
	reqPost(req, res);
	console.log('Loading...');
	
	res.statusCode = 200;
//	res.setHeader('Content-Type', 'text/plain');

	// чтение шаблока в каталоге со скриптом.
	const filePath = path.join(__dirname, 'select.html')
	const array = fs.readFileSync(filePath).toString().split("\n");
	console.log(filePath);

	for(let i in array) {
		// подстановка.
		if ((array[i].trim() != '@tr') && (array[i].trim() != '@ver')) res.write(array[i]);
		if (array[i].trim() == '@tr') ViewSelect(res);
		if (array[i].trim() == '@ver') ViewVer(res);
	}
	res.end();
	console.log('1 User Done.');
});

// запуск сервера, ожидание подключений из браузера.
const hostname = '127.0.0.1';
const port = 3000;
server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
