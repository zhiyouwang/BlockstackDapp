var express = require('express');
var app = express();
var mysql = require('mysql');

var connection = mysql.createConnection({
	host: '127.0.0.1',
	user: 'root',
	password: '12345678',
	database: 'test_db'
});

app.get('/listUsers', function (req, res) {
	console.log("/listUsers.");
	res.end( "/listUsers" );
})


/*

*/
/*
connection.connect();
var addSql = 'INSERT INTO websites(Id,name,url,alexa,country) VALUES(0,?,?,?,?)';
var addSqlParams = ['菜鸟工具', 'https://c.runoob.com','23453', 'CN'];
connection.query(addSql,addSqlParams,function (err, result) {
        if(err){
         console.log('[INSERT ERROR] - ',err.message);
         return;
        }        
       console.log('--------------------------INSERT----------------------------');
       //console.log('INSERT ID:',result.insertId);        
       console.log('INSERT ID:',result);        
       console.log('-----------------------------------------------------------------\n\n');  
});
connection.end();
*/

var server = app.listen(8081, function () {
	var host = server.address().address
	var port = server.address().port

	console.log("应用实例，访问地址为 http://%s:%s", host, port)
})
