import axios from 'axios';

const url='http://127.0.0.1:8081/api/v1';

/*
axios.get('/user?ID=12345').then(function (response) {
	console.log(response);
}).catch(function (error) {
	console.log(error);
});
*/

export var putMSFile = (owner, file_name, file_description, file_crypto, file_amount, file_hash) => {
	axios.post(url + '/putmsfile', {
		owner: owner,
		file_name: file_name,
		file_description: file_description,
		file_crypto: file_crypto,
		file_amount: file_amount,
		file_hash: file_hash
	}).then( function(response) {
		console.log(response);
	}).catch( function(error) {
		console.log(error);
	});
}

export var getAllMSFile = () => {
	return axios.get(url + '/getallmsfile').then( function(response) {
		return response.data;
	}).catch( function(error) {
		console.log(error);
	});
}

export var getAllUsername = () => {
	return axios.get(url + '/getusername').then( function(response) {
		return response.data;
	}).catch( function(error) {
		console.log(error);
	});
}

export var listUnspent = (address) => {
	return axios.get(url + '/listunspent', { params: { address: address } }).then( function(response) {
		return response.data;
	}).catch( function(error) {
		console.log(error);
	});
}

export var importAddress = (address, username) => {
	axios.post(url + '/importaddress', {
		address: address,
		username: username
	}).then( function(response) {
		console.log(response);
	}).catch( function(error) {
		console.log(error);
	});
}

export var sendMSDataTX = (txhex, buyer, owner, file_name, file_amount) => {
	axios.post(url + '/sendmsdatatx', {
		txhex: txhex,
		buyer: buyer,
		owner: owner,
		file_name: file_name,
		file_amount: file_amount
	}).then( function(response) {
		console.log(response);
	}).catch( function(error) {
		console.log(error);
	});
}

export var getMSDataTX = (username) => {
	return axios.get(url + '/getmsdatatx', { params: { username: username } }).then( function(response) {
		return response.data;
	}).catch( function(error) {
		console.log(error);
	});
}

export var getUndoTX = (username) => {
	return axios.get(url + '/getundotx', { params: { username: username } }).then( function(response) {
		return response.data;
	}).catch( function(error) {
		console.log(error);
	});
}

export var putMSDataKey = (txid, key) => {
	axios.post(url + '/putmsdatakey', {
		txid: txid,
		key: key
	}).then( function(response) {
		alert("上传成功！");
		console.log(response);
	}).catch( function(error) {
		console.log(error);
	});
}

export var getTXID = (owner, file_name, buyer) => {
	return axios.get(url + '/gettxid', { params: { owner: owner, file_name: file_name, buyer: buyer } }).then( function(response) {
		return response.data;
	}).catch( function(error) {
		console.log(error);
	});
}

export var getMSDataKey = (txid) => {
	return axios.get(url + '/getmsdatakey', { params: { txid: txid } }).then( function(response) {
		return response.data;
	}).catch( function(error) {
		console.log(error);
	});
}

export var getBlock = (height) => {
	return axios.get(url + '/getblock', { params: { height: height } }).then( function(response) {
		return response.data;
	}).catch( function(error) {
		console.log(error);
	});
}

export var getBlockCount = () => {
	return axios.get(url + '/getblockcount').then( function(response) {
		return response.data;
	}).catch( function(error) {
		console.log(error);
	});
}

export var getRawTX = (txid) => {
	return axios.get(url + '/getrawtx', { params: { txid: txid } }).then( function(response) {
		return response.data;
	}).catch( function(error) {
		console.log(error);
	});
}

