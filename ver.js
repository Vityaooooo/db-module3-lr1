const mysql = require("C:\\nodejs\\node_modules\\mysql2");
  
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "lr_1",
  password: "1234"
});

 connection.connect(function(err){
    if (err) {
      return console.error("Ошибка: " + err.message);
    }
    else{
      console.log("Подключение к серверу MySQL успешно установлено");
    }
 });