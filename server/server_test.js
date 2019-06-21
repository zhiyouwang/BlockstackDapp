var blockstack = require('blockstack');
var mysql = require('mysql');

var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',              
	password: '12345678',
	database: 'msdata_management'
});
connection.connect();

//test

//close connection
connection.end();
