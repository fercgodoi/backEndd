const mysql = require('mysql');

//require('dotenv').load();

    const pool = mysql.createPool({
        host     : "localhost",
        port     : 3306,
        user     : "root",
        password : "berlim45",
        database : "agendaanimal"
    });

    pool.getConnection(function(err){
        if(err) return console.log(err);
        console.log('conectado');
    })

exports.pool = pool; 


/*
        "host": process.env.MYSQL_HOST,
        "port": process.env.MYSQL_PORT,
        "user": process.env.MYSQL_USER,
        "password": process.env.MYSQL_PASSWORD,
        "database": process.env.MYSQL_DATABASE

        

"user": process.env.MYSQL_USER,
          
*/