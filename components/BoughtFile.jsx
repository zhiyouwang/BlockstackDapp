import '../styles/style.css';
import '../styles/myfile.css';
import React, {Component} from 'react';
import TopBar from './TopBar.jsx';
import LeftBar from './LeftBar.jsx';
import SmallFoot from './SmallFoot.jsx';
import { getFile, putFile, loadUserData } from "blockstack";
import FileSaver from 'file-saver';
import * as API from './API.js';

export default class BoughtFile extends Component {

	constructor(props) {
		super(props);
		this.state = {
			buyFileLoad: false,
			fileList:[],
			currentFileList: [],
			select: "全部",
			searchName: "",
			searchCrypto: "",
			isLoading: true
		};
	}

	componentDidMount() {
		let fileList = [];
		getFile("buyFileList", { decrypt: true }).then( (data) => {
			let buyFileList = JSON.parse(data);
			for(let i in buyFileList) {
				let fileList = [];
				let owner = buyFileList[i].owner;
				getFile("myFileList", { username: owner, decrypt: false }).then( (data) => {
					let myFileList = JSON.parse(data);
					for(let j in myFileList) {
						for(let k in buyFileList[i].list) {
							if(myFileList[j].file_name === buyFileList[i].list[k].file_name) {
								myFileList[j].owner = owner;
								myFileList[j].txid = buyFileList[i].list[k].txid;
								myFileList[j].file_crypto = 1;
								fileList.push(myFileList[j]);
								this.setState({
									fileList: fileList,
									currentFileList: fileList,
									isLoading: false
								});
							}

						}
					}
				}).catch( (err) => { console.log(err); });
			}
		}).catch( (err) => { console.log(err); });
	}

	handleDownloadEvent(owner, file_name) {
		getFile(file_name, { username: owner, decrypt: false }).then( (fileData) => {
			let blob = new Blob([fileData], {
				type: "text/plain;charset=utf-8"
			});
			FileSaver.saveAs(blob, file_name + ".mzml");
		})
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

	handleSearch() {
		let searchList = [];
		for (let i in this.state.fileList) {
		if(((this.state.fileList[i].file_name.indexOf(this.state.searchName) !== -1) || (this.state.searchName === "")) && ((this.state.fileList[i].file_crypto === parseInt(this.state.searchCrypto)) || (this.state.searchCrypto === "")))
			searchList.push(this.state.fileList[i]);
		}
		if(searchList.length === 0) {
			alert("找不到目标文件！！");
			searchList = this.state.fileList;
			this.setState({
				searchName: "",
				searchCrypto: ""
			})
		}
		this.setState({
			currentFileList: searchList
		})
	}

	handleReset() {
		this.setState({
			searchName: "",
			searchCrypto: "",
			currentFileList: this.state.fileList
		})
	}

	handleGetMSDataKey(txid) {
		API.getMSDataKey(txid).then( (key) => {
			if(key === "---404 NOT FOUND---")
				alert("对方还未上传密钥，请耐心等候...");
			else alert("密钥为："+ key +"(请注意保存好)");
		});
	}

	render() {
		let i = 0;
		return (
			<div>
				<TopBar/>
				<div className="index-content">
					<LeftBar/>
					<div className="main-content">
						<h3>已购买的文件</h3>
						<hr/>
						<div className="search-div">
							<lable>文件名称:</lable>
							<input className="form-group" onChange={e => this.handleSearchNameChange(e)} value={this.state.searchName}/>
							<lable>加密/非加密:</lable>
							<select className="form-group" onChange={e => this.handleCryptoSelectChange(e)} value={this.state.searchCrypto}>
								<option value="">--请选择--</option>
								<option value="0">非加密</option>
								<option value="1">加密</option>
							</select>
						</div>
						<button className="btn btn-default" onClick={this.handleSearch.bind(this)}>搜索</button>
						&nbsp;&nbsp;
						<button className="btn btn-default" onClick={this.handleReset.bind(this)}>重置</button>
						<br/>
						<hr/>
						{ this.state.isLoading ? <span>加载中...</span> : this.state.fileList.length === 0 ? "您还没有购买文件!" :
						<table className="table table-bordered">
							<thead>
								<tr>
									<th>#</th>
									<th>文件名</th>
									<th>文件描述</th>
									<th>拥有者</th>
									<th>交易ID</th>
									<th>下载</th>
									<th>密钥</th>
								</tr>
							</thead>
							<tbody>
							{ this.state.currentFileList.map( (aFile) => {
							return (
								<tr key={ i++ }>
									<td>{ i }</td>
									<td>{ aFile.file_name }</td>
									<td>{ aFile.file_description }</td>
									<td>{ aFile.owner }</td>
									<td>{ aFile.txid }</td>
									<td><a onClick={ () => this.handleDownloadEvent(aFile.owner, aFile.file_name) }>下载</a></td>
									<td>{ aFile.file_crypto === 1 ? <a onClick={ () => this.handleGetMSDataKey(aFile.txid) }>获取密钥</a> : "非加密"}</td>
								</tr>
							)})}
							</tbody>
						</table> }
					</div>
				</div>
 				<SmallFoot/>
			</div>
		);
	}

}
