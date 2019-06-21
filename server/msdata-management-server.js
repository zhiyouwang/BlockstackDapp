var express = require('express');
var app = express();
var mysql = require('mysql');
var bitcoin = require('bitcoin');

//比特币RPC接口设置
const RPC_PORT = "18443";
const RPC_USER = "zwf";
const RPC_PASS = "123456";
const client = new bitcoin.Client({
    port: RPC_PORT,
    user: RPC_USER,
    pass: RPC_PASS
});

/*示例
client.getBalance(function(err, result) {
    if(err) console.log(err);
    console.log(result);
});
*/

//解决跨域问题
var allowCrossDomain = function(requset, response, next) {
    response.header('Access-Control-Allow-Origin', 'http://localhost:8080');
    response.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    response.header('Access-Control-Allow-Headers', 'Content-Type');
    response.header('Access-Control-Allow-Credentials','true');
    next();
};
app.use(allowCrossDomain);

//数据库连接设置
const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',              
	password: '12345678',
	database: 'msdata_management'
});
connection.connect();

//importAddress
app.post('/api/v1/importaddress', function(request, response) {  
	request.on('data', function(buffer) {
		var data = JSON.parse(buffer.toString());
		client.importAddress(data.address, data.username, function(err, result) {
			if(err) console.log(err);
			console.log(result);
		});
	});
});

//putMSDataKey
app.post('/api/v1/putmsdatakey', function(request, response) {  
	request.on('data', function(buffer) {
		var data = JSON.parse(buffer.toString());
		var sql, params;
		sql = 'update keylist set file_key="' + data.key + '" where txid="' + data.txid + '"';
		params = [data.key];
		connection.query(sql, params, function(err, result) {
			if(err){
				console.log('[update error] - ',err.message);
				return;
			}
			console.log('update success.');
			response.send('putmsdatakey success.');
		});
	});
});

//putMSFile
app.post('/api/v1/putmsfile', function(request, response) {  
	request.on('data', function(buffer) {
		var data = JSON.parse(buffer.toString());
		var sql, params;
		if(data.file_crypto === '0') {//文件未加密
			sql = 'insert into filelist(owner, file_name, file_description, file_crypto, file_hash) values(?,?,?,0,?)';
			params = [data.owner, data.file_name, data.file_description, data.file_hash];
		}
		else {//文件是加密的
			sql = 'insert into filelist(owner, file_name, file_description, file_crypto, file_amount, file_hash) values(?,?,?,?,?,?)';
			params = [data.owner, data.file_name, data.file_description, data.file_crypto, data.file_amount, data.file_hash];
		}
		connection.query(sql, params, function(err, result) {
			if(err){
				console.log('[insert error] - ',err.message);
				return;
			}
			console.log('insert success.');
			response.send('putmsfile success.');
		});
	})
});

//sendMSDataTX
app.post('/api/v1/sendmsdatatx', function(request, response) {
	request.on('data', function(buffer) {
		var data = JSON.parse(buffer.toString());

		client.sendRawTransaction(data.txhex, function(err, txid){
			if(err) console.log(err);
			console.log(txid);
			var sql, params;
			var date = new Date();
			var time = date.toLocaleString();
			sql = 'insert into txlist(txid, buyer, owner, file_name, file_amount, time) values(?,?,?,?,?,?)';
			params = [txid, data.buyer, data.owner, data.file_name, data.file_amount, time];
			connection.query(sql, params, function(err, result) {
				if(err){
					console.log('[insert error] - ',err.message);
					return;
				}
				console.log('insert success.');
				sql = 'insert into keylist(txid) values(?)';
				params = [txid];
				connection.query(sql, params, function(err, result) {
					if(err){
						console.log('[insert error] - ',err.message);
						return;
					}
					console.log('insert success.');
					response.send('tx send success.');
				});
			});
			
		})
	});
});

//getAllMSFile
app.get('/api/v1/getallmsfile', function(request, response) {
	var sql = 'select owner, file_name, file_description, file_crypto, file_amount from filelist';
	connection.query(sql, function(err, filelist) {
		if(err){
			console.log('[query error] - ',err.message);
			return;
		}
		console.log('query success.');
		response.send(filelist);
	});
});

//getTXID
app.get('/api/v1/gettxid', function(request, response) {
	var url = decodeURI(request.url);
	params = url.split("&");
	var owner = params[0].substring(22);
	var file_name = params[1].substring(10);
	var buyer = params[2].substring(6);
	var sql = 'select txid from txlist where owner="' + owner + '" and buyer="' + buyer + '" and file_name="' + file_name + '"';
	connection.query(sql, function(err, result) {
		if(err){
			console.log('[query error] - ',err.message);
			return;
		}
		console.log('query success.');
		response.send(result[0].txid);
	});
});

//getAllUsername
app.get('/api/v1/getallusername', function(request, response) {
	var sql = 'select distinct owner from filelist';
	connection.query(sql, function(err, usernamelist) {
		if(err){
			console.log('[query error] - ',err.message);
			return;
		}
		console.log('query success.');
		response.send(usernamelist);
	});
});

//getMSDataKey
app.get('/api/v1/getmsdatakey', function(request, response) {
	var url = request.url;
	var txid = url.substring(26);
	var sql = 'select file_key from keylist where keylist.file_key is not null and txid="' + txid + '"';
	connection.query(sql, function(err, result) {
		if(err){
			console.log('[query error] - ',err.message);
			return;
		}
		console.log('query success.');
		if(result.length === 1)
			response.send(result[0].file_key);
		else if(result.length === 0)
			response.send("---404 NOT FOUND---");
	});
});

//listUnspent
app.get('/api/v1/listunspent', function(request, response) {
	var url = request.url;
	var address = url.substring(28);
	var address_arr = [];
	address_arr.push(address);
	client.listUnspent(6,999999, address_arr, function(err, unspent) {
		if(err) console.log(err);
		response.send(unspent);
	});
});

//getMSDataTX
app.get('/api/v1/getmsdatatx', function(request, response) {
	var url = request.url;
	var username = url.substring(29);
	var sql;
	sql = 'select txid, file_name, owner, file_amount, time from txlist where owner="' + username + '" or buyer="' + username + '"';
	connection.query(sql, function(err, undotxlist) {
		if(err){
			console.log('[query error] - ',err.message);
			return;
		}
		console.log('query success.');
		response.send(undotxlist);
	});
});

//getUndoTX
app.get('/api/v1/getundotx', function(request, response) {
	var url = request.url;
	var username = url.substring(27);
	var sql;
	sql = 'select txlist.txid, file_name, buyer, file_amount, time from txlist,keylist where txlist.txid=keylist.txid and keylist.file_key is null and owner="' + username + '"';
	connection.query(sql, function(err, txlist) {
		if(err){
			console.log('[query error] - ',err.message);
			return;
		}
		console.log('query success.');
		response.send(txlist);
	});
});

//getBlockCount
app.get('/api/v1/getblockcount', function(request, response) {
	client.getBlockCount(function(err, blockCount) {
		if(err) console.log(err);
		response.send("" + blockCount);
	});
});

//getBlock
app.get('/api/v1/getblock', function(request, response) {
	var url = request.url;
	var height = parseInt(url.substring(24));
	client.getBlockHash(height, function(err, blockHash) {
		if(err) console.log(err);
		client.getBlock(blockHash, function(err, block) {
			if(err) console.log(err);
			response.send(block);
		});
	});
});

//getRawTX
app.get('/api/v1/getrawtx', function(request, response) {
	var url = request.url;
	var txid = url.substring(22);
	console.log(txid);
	client.getRawTransaction(txid, function(err, txhex) {
		if(err) console.log(err);
		console.log(txhex);
		client.decodeRawTransaction(txhex, function(err, tx) {
			if(err) console.log(err);
			response.send(tx);
		});
	});
});

var server = app.listen(8081, function () {
	var host = server.address().address;
	var port = server.address().port;
	console.log('server starting in http://%s:%s', host, port);
})
