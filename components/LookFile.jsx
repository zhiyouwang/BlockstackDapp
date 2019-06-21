import '../styles/style.css';
import '../styles/uploadfile.css';
import React, { Component } from 'react';
import TopBar from './TopBar.jsx';
import LeftBar from './LeftBar.jsx';
import SmallFoot from './SmallFoot.jsx';
import { getFile, putFile, loadUserData } from "blockstack";
import FileSaver from 'file-saver';
import * as API from './API.js';
import bitcoin from 'bitcoinjs-lib';

const NETWORK = bitcoin.networks.regtest;

export default class LookFile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fileList: [],
			currentFileList: [],
			buyFileList: [],
			lookId: "",
			isLoading: true,
			userId: "",
			searchName: "",
			searchCrypto: "",
			fileOwnerId: "",
			isBuying: false
		};
	}

	componentDidMount() {
		//putFile("buyFileList", "", { encrypt: true });
		getFile("buyFileList", { decrypt: true }).then( (buyfile) => {
 			let buyFileList = JSON.parse(buyfile || '[]');
			this.state.buyFileList = buyFileList;
			console.log(buyFileList);
			API.getAllMSFile().then((allFile) => {
				allFile = allFile.filter(function(item) {
					return item.owner != loadUserData().username;
				});
				for(let i in allFile)
					for(let j in buyFileList)
						if(allFile[i].owner === buyFileList[j].owner)
							for(let k in buyFileList[j].list)
								if(allFile[i].file_name === buyFileList[j].list[k].file_name)
									allFile[i].buy = 1;
				this.setState({
					fileList: allFile,
					currentFileList: allFile,
					isLoading: false
				})
			});
		}).catch( (error) => {
			console.log(error);
			this.setState({ isLoading: false });
		});
	}

	handleLookIdChange(event) {
		this.setState({
			lookId: event.target.value
		});
	}

	handleSearchNameChange(event) {
		this.setState({
			searchName: event.target.value
		});
	}

	handleCryptoSelectChange(event) {
		this.setState({
			searchCrypto: event.target.value
		});
	}

	handleLook() {
		if(this.state.lookId === "")
			alert("请输入要查找的用户的ID！");
		else if(this.state.lookId === this.state.userId)
			alert("不能查找自己！");
		else {
			this.setState({
				isLoading: true,
				fileOwnerId: this.state.lookId
			});
			getFile("myFileList", { username: this.state.lookId, decrypt: false }).then( (file) => {
				let fileList = JSON.parse(file || '[]');
				let buylist = [];
				for(let i in this.state.buyFileList)
					if(this.state.buyFileList[i].owner === this.state.lookId)
						buylist = this.state.buyFileList[i].file_list;
				for(let i in fileList) {
					fileList[i].owner = this.state.lookId;
					for(let j in buylist)
						if(buylist[j].file_name === fileList[i].file_name)
							fileList[i].buy = 1;
				}
				console.log(fileList);
				this.setState({
					fileList: fileList,
					currentFileList: fileList,
					isLoading: false
				});
			}).catch( (error) => {
				console.log(error);
				alert("找不到该用户或文件。");
				this.setState({ isLoading: false });
			})
		}
	}

	handleReset() {
		this.setState({ isLoading: false });
		getFile("buyFileList", { decrypt: true }).then( (buyfile) => {
 			let buyFileList = JSON.parse(buyfile || '[]');
			this.state.buyFileList = buyFileList;
			API.getAllMSFile().then((allFile) => {
				allFile = allFile.filter(function(item) {
					return item.owner != loadUserData().username;
				});
				for(let i in allFile)
					for(let j in buyFileList)
						if(allFile[i].owner === buyFileList[j].owner)
							for(let k in buyFileList[j].file_list)
								if(allFile[i].file_name === buyFileList[j].file_list[k].file_name)
									allFile[i].buy = 1;
				this.setState({
					fileList: allFile,
					currentFileList: allFile,
					isLoading: false,
					lookId: "",
					searchName: "",
					searchCrypto: ""
				})
			});
		}).catch( (error) => {
			console.log(error);
			this.setState({ isLoading: false });
		})
	}

	getId(userId) {
		this.setState({
			userId: userId
		})
	}

	handleSearch() {
		this.setState({ isLoading: false });
		let searchList = [];
		for(let i in this.state.fileList) {
			if(((this.state.fileList[i].file_name.indexOf(this.state.searchName) !== -1) || (this.state.searchName === "")) && ((this.state.fileList[i].file_crypto === parseInt(this.state.searchCrypto)) || (this.state.searchCrypto === "")) )
				searchList.push(this.state.fileList[i]);
		}
		if(searchList.length === 0) {
			alert("找不到目标文件！！");
			searchList = this.state.fileList;
			this.setState({
				searchName: "",
				searchCrypto: "",
			});
		}
		this.setState({
			currentFileList: searchList,
			isLoading: false
		})
	}

	handleSearchReset() {
		this.setState({
			searchName: "",
  			searchCrypto: "",
			currentFileList: this.state.fileList
		})
	}

	handleDownloadEvent(owner, file_name) {
		getFile(file_name, { username: owner, decrypt: false }).then( (fileData) => {
			let blob = new Blob([fileData], {
				type: "text/plain;charset=utf-8"
			});
			FileSaver.saveAs(blob, file_name + ".mzml");
		})
	}

	handleBuy(owner, file_name, file_amount){
		this.setState({ isBuying:true });
		let buyer = loadUserData().username;
		getFile("myFileList", { username: owner, decrypt: false }).then( (data1) => {
			let myFileList = JSON.parse(data1);
			let flag = 0;
			for(let i in myFileList)
				if(myFileList[i].file_name === file_name)
					flag = 1;
			if(flag) {
				getFile("myAccount", { decrypt: true }).then( (data2) => {
					let myAccount = JSON.parse(data2);
					console.log(myAccount);
					let array = myAccount.__d.data;
					let hex = "";
					for(let i in array)
						if(array[i] < 16) hex = hex + "0" + array[i].toString(16);
						else hex = hex + array[i].toString(16);
					let privateKey = Buffer.from(hex, 'hex');
					let keyPair = bitcoin.ECPair.fromPrivateKey(privateKey, { network: NETWORK });
					let p2pkh = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: NETWORK });
					console.log(p2pkh.address);
					getFile("myAddress", { username:owner, decrypt: false }).then( (data) => {
						var owner_address = JSON.parse(data);
						API.listUnspent(p2pkh.address).then( (unspent) => {
							console.log(unspent);
							let sum = 0;
							let fee = 1000;//手续费
							let txb = new bitcoin.TransactionBuilder(NETWORK);
							let data = Buffer.from('MS000001:' + buyer + ',' + owner + ',' + file_name, 'utf8');
							let embed = bitcoin.payments.embed({ data: [data] });
							let k = 0;
							for(let i in unspent) {//输入
								k++;
								txb.addInput(unspent[i].txid, unspent[i].vout);
								sum += unspent[i].amount * 10000 * 10000;
								if(sum >= file_amount + fee) break;
							}
							if(sum < file_amount + fee){
								alert("余额不足！");
								this.setState({ isBuying: false });
							}
							else {
								txb.addOutput(embed.output, 0);//支付信息
								txb.addOutput(owner_address, file_amount);//支付
								txb.addOutput(p2pkh.address, sum - file_amount - fee);//找零
								for(let i = 0; i < k; i++)
									txb.sign(i, keyPair);//签名
								var txid = txb.build().getId();//交易的哈希值
								var txhex = txb.build().toHex();//交易的原始十六进制
								console.log(txid);
								console.log(txhex);
								API.sendMSDataTX(txhex, buyer, owner, file_name, file_amount);//发送交易
								let buyFileList = this.state.buyFileList;
								let record = {
									file_name: file_name,
									txid: txid
								};
								let find = 0;
								for(let i in buyFileList) {
									if(buyFileList[i].owner === owner) {
										buyFileList[i].list.push(record);
										find = 1;
									}
								}
								if(find === 0) {
									let list = [];
									list.push(record);
									let buyRecord = {
										owner: owner,
										list: list
									}
									buyFileList.push(buyRecord);
								}
								putFile("buyFileList", JSON.stringify(buyFileList), { encrypt: true }).then( () => {
									alert("购买成功！");
									let currentFileList = this.state.currentFileList;
									let fileList = this.state.fileList;
									for(let i in fileList)
										if(fileList[i].file_name === file_name && fileList[i].owner === owner)
											fileList[i].buy = 1;
									for(let i in currentFileList)
										if(currentFileList[i].file_name === file_name && currentFileList[i].owner === owner)
											currentFileList[i].buy = 1;
									this.setState({
										fileList: fileList,
										currentFileList: currentFileList,
										isBuying: false
									})
								}).catch( (err) => { console.log(err); })
							}
						});
					}).catch( (err) => { console.log(err); })
				}).catch( (err) => { console.log(err); })
			}
		}).catch( (err) => { console.log(err); })
		
	}

	handleGetMSDataKey(owner, file_name) {
		API.getTXID(owner, file_name, loadUserData().username).then( (txid) => {
			API.getMSDataKey(txid).then( (key) => {
				if(key === "---404 NOT FOUND---")
					alert("对方还未上传密钥，请耐心等候...");
				else alert("密钥为："+ key +"(请注意保存好)");
			});
		});
	}

	render() {
		let i = 0;
		return (
			<div>
			<TopBar getId={this.getId.bind(this)}/>
				<div className="index-content">
					<LeftBar/>
					<div className="main-content">
						<h3>查找文件</h3>
						<hr/>
						<div>
							<lable>文件拥有者:</lable>
							<input className="form-group" onChange={e => this.handleLookIdChange(e)} value={this.state.lookId}/><br/>
							<button className="btn btn-default" onClick={this.handleLook.bind(this)}>查找</button>
							&nbsp;&nbsp;
							<button className="btn btn-default" onClick={this.handleReset.bind(this)}>重置</button>
							<br/>
						</div>
						<hr/>
						<div>
							<div>
								<div className="search-div">
									<lable>文件名称:</lable>
									<input className="form-group" onChange={e => this.handleSearchNameChange(e)} value={this.state.searchName}/><br/>
									<lable>加密/非加密:</lable>
									<select className="form-group" onChange={e => this.handleCryptoSelectChange(e)} value={this.state.searchCrypto}>
										<option value="">--请选择--</option>
										<option value="0">非加密</option>
										<option value="1">加密</option>
									</select><br/>
									<button className="btn btn-default" onClick={this.handleSearch.bind(this)}>搜索</button>
									&nbsp;&nbsp;
									<button className="btn btn-default" onClick={this.handleSearchReset.bind(this)}>重置</button>
								</div>
								<hr/>
								{this.state.isBuying ? <span>购买中，请稍等......</span> : !this.state.isLoading ?
								<table className="table table-bordered">
									<thead>
										<tr>
											<th>#</th>
											<th>文件拥有者</th>
											<th>文件名</th>
											<th>文件描述</th>
											<th>加密</th>
											<th>金额</th>
											<th>下载</th>
											<th>操作</th>
										</tr>
									</thead>
									<tbody>
									{ this.state.currentFileList.map( (aFile) => {
									return (
										<tr key={ i++ }>
											<td>{ i }</td>
											<td>{ aFile.owner }</td>
											<td>{ aFile.file_name }</td>
											<td>{ aFile.file_description }</td>
											<td>{ aFile.file_crypto === 1 ? "是" : "否" }</td>
											<td>{ aFile.file_amount || "/" }</td>
											<td><a onClick={ () => this.handleDownloadEvent(aFile.owner, aFile.file_name) }>下载</a></td>
											<td>{ aFile.buy === 1 ? <a onClick={ () => this.handleGetMSDataKey(aFile.owner, aFile.file_name) }>获取密钥</a> : aFile.file_crypto === 1 || parseInt(aFile.file_crypto) === 1 ? <a onClick={ () => this.handleBuy(aFile.owner, aFile.file_name, aFile.file_amount) }>购买</a> : "/"}</td>
										</tr>
									)})}
									</tbody>
								</table> : <span>加载中...</span> }
							</div>
						</div>
					</div>
				</div>
				<SmallFoot/>
			</div>
		);
	}
}
