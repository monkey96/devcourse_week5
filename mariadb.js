const mysql = require('mysql2');

const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'Youtube',
    dateStrings: true
});

// conn.query(`SELECT * FROM users`,
//     function (err, results, fields){
//         console.log(results);
//     }
// );

module.exports = conn;