const mysql = require('mysql');

    const pool = mysql.createPool({
        host     : "localhost",
        port     : 3306,
        user     : "root",
        password : "berlim45",
        database : "AgendaAnimal"
    });


exports.pool = pool;


/*
"user": process.env.MYSQL_USER,
        "password": process.env.MYSQL_PASSWORD,
        "database": process.env.MYSQL_DATABASE,
        "host": process.env.MYSQL_HOST,
        "port": process.env.MYSQL_PORT
        
*/