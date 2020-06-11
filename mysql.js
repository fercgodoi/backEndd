const mysql = require('mysql');
require('dotenv').config();

    const pool = mysql.createPool({

        // host     : "localhost",
        // port     : 3306,
        // user     : "root",
        // password : "",
        // database : "agenda"

        "host": process.env.MYSQL_HOST,
        "port": process.env.MYSQL_PORT,
        "user": process.env.MYSQL_USER,
        "password": process.env.MYSQL_PASSWORD,
        "database": process.env.MYSQL_DATABASE,
        "connectionLimit": process.env.MYSQL_CONNLIMIT,

    });

    pool.getConnection(function(err){         
        if(err) return console.log(err);         
        console.log('mysql conectado..');
    })

exports.pool = pool; 
