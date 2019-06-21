import '../styles/style.css';
import '../styles/wallet.css';
import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import TopBar from './TopBar.jsx';
import LeftBar from './LeftBar.jsx';
import SmallFoot from './SmallFoot.jsx';
import { getFile, putFile } from "blockstack";
import bitcoin from 'bitcoinjs-lib';
import * as API from './API.js';

const NETWORK = bitcoin.networks.regtest;

export default class Wallet extends Component {
	constructor(props) {
		super(props);
		this.state = {
			balance: 0,
			accounts: [],
			isLoading: true
		};
	}

	componentDidMount() {
/*
		let myAccounts = [];
		myAccounts.push("myAccount");
		putFile("myAccounts", JSON.stringify(myAccounts), { encrypt: true }).catch( (err) => { console.log(err); });
*/
		let sum_balance = 0;
		getFile("myAccounts",{ decrypt: true }).then( (data) =>{
			let myAccounts = JSON.parse(data);
			let accounts = [];
			for(let i in myAccounts) {
				getFile(myAccounts[i],{ decrypt: true }).then( (data) =>{
					let account = JSON.parse(data);
					let privatekey_arr = account.__d.data;
					let publickey_arr = account.__Q.data;
					let privatekey_hex = "";
					let publickey_hex = "";
					for(let i in privatekey_arr)
						if(privatekey_arr[i] < 16) privatekey_hex = privatekey_hex + "0" + privatekey_arr[i].toString(16);
						else privatekey_hex = privatekey_hex + privatekey_arr[i].toString(16);
					for(let i in publickey_arr)
						if(publickey_arr[i] < 16) publickey_hex = publickey_hex + "0" + publickey_arr[i].toString(16);
						else publickey_hex = publickey_hex + publickey_arr[i].toString(16);
					let privateKey = Buffer.from(privatekey_hex, 'hex');
					let keyPair = bitcoin.ECPair.fromPrivateKey(privateKey, { network: NETWORK });
					let p2pkh = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: NETWORK });
					let balance = API.listUnspent(p2pkh.address).then( function(unspents) {
						console.log(unspents);
						let balance = 0;
						for(let i in unspents)
							balance += unspents[i].amount * 10000;
						sum_balance += balance;
						let one_account = {
							privatekey: privatekey_hex,
							publickey: publickey_hex,
							address: p2pkh.address,
							balance: balance
						}
						accounts.push(one_account);
						if(parseInt(i) === myAccounts.length - 1){
							this.setState({
								accounts: accounts,
								balance: sum_balance,
								isLoading: false
							})
						}
					}.bind(this) );
				}).catch( (err) => { console.log(err); });
			}
		}).catch( (err) => { console.log(err); });
	}

	render() {
		let key = 0;
		return (
			<div>
				<TopBar/>
				<div className="index-content">
					<LeftBar/>
					<div className="main-content">
						<h2>我的钱包</h2><br/>
						<img className="personinfo-img" src="http://localhost:8080/wallet.png"/><br/>
						<br/><br/>
						{ !this.state.isLoading ?
						<h2 className="all-balance" >总余额:{ this.state.balance * 10000 }聪</h2> : null }<br/>
						{ !this.state.isLoading ?
						<table className="table table-bordered">
							<thead>
								<tr>
									<td>私钥</td>
									<td>公钥</td>
									<td>地址</td>
									<td>余额(单位:聪)</td>
								</tr>
							</thead>
							<tbody>
							{ this.state.accounts.map( (account) => {
								return(
									<tr key = { key++ }>
										<td>{ account.publickey }</td>
										<td>{ account.privatekey }</td>
										<td>{ account.address }</td>
										<td>{ account.balance * 10000 }</td>
									</tr>
								)
							})}
							</tbody>
						</table> : <span>加载中...</span> }
						{ !this.state.isLoading ? <a>添加新地址</a> : null }
					</div>
				</div>
				<SmallFoot/>
			</div>
		);
	}
}
