import mysql from 'mysql2';

var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Grub@123',
    database: 'jobsscrapedb',
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connected!");
});

export default connection;