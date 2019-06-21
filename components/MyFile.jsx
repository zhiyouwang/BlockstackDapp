import '../styles/style.css';
import '../styles/myfile.css';
import React, {Component} from 'react';
import TopBar from './TopBar.jsx';
import LeftBar from './LeftBar.jsx';
import SmallFoot from './SmallFoot.jsx';
import {getFile, putFile} from "blockstack";
import FileSaver from 'file-saver';
import CryptoJS from 'crypto-js';
import tripledes from 'crypto-js/tripledes';

export default class MyFile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fileList: [],
			currentFileList: [],
			select: "全部",
			fileLoad: false,
			searchName: "",
			searchKind: "",
			searchCrypto: "",
			searchBeSearched: "",
		};
	}

	componentDidMount() {
/*
		putFile("myFileList", "", { encrypt: false });
		putFile("mySecureFileList", "", { encrypt: true });
		putFile("buyFileList", "", { encrypt: true });
		putFile("keyFileList", "", { encrypt: true });
*/
		getFile("myFileList", { decrypt: false, zoneFileLookupURL: 'https://core.blockstack.org/v1/names/' }).then( (file) => {
			let myFileList = JSON.parse(file || '[]');
			for(let i in myFileList)
				myFileList[i].beSearched = "1";
			this.state.fileList = myFileList;
			getFile("mySecureFileList", { decrypt: true, zoneFileLookupURL: 'https://core.blockstack.org/v1/names/' }).then( (file) => {
				let mySecureFileList = JSON.parse(file || '[]');
				let fileList = this.state.fileList;
				for(let i in mySecureFileList) {
					mySecureFileList[i].beSearched = "0";
					fileList.push(mySecureFileList[i]);
				}
				this.state.fileList = fileList;
				this.state.currentFileList = fileList;
				this.setState({
					fileLoad: true
				});
			});
		});
	}

	handleDownloadEvent(file_name, beSearched, file_crypto) {
		if(beSearched === "0") {//私有
			getFile(file_name, { decrypt: true, zoneFileLookupURL: 'https://core.blockstack.org/v1/names/' }).then( (file) => {
				let blob = new Blob([file], {
					type: "text/plain;charset=utf-8"
				});
				FileSaver.saveAs(blob, file_name + ".mzml");
			});
		}else {//公开
			if(file_crypto === "1") {//加密
				getFile(file_name, { decrypt: false, zoneFileLookupURL: 'https://core.blockstack.org/v1/names/' }).then( (file) => {
					let fileEncryptData = file;
					getFile("fileKeyList", { decrypt: true, zoneFileLookupURL: 'https://core.blockstack.org/v1/names/' }).then( (file) => {
						let fileKeyList = JSON.parse(file || '[]');
						for(let i in fileKeyList) {
							if(file_name === fileKeyList[i].file_name) {
								let fileData = tripledes.decrypt(fileEncryptData, fileKeyList[i].fileKey).toString(CryptoJS.enc.Utf8);
								let blob = new Blob([fileData], {
									type: "text/plain;charset=utf-8"
								});
								FileSaver.saveAs(blob, fileName + ".mzml");
								break;
							}
						}
					});
				});
			}else {//未加密
				getFile(file_name, { decrypt: false, zoneFileLookupURL: 'https://core.blockstack.org/v1/names/' }).then( (file) => {
					let blob = new Blob([file], {
						type: "text/plain;charset=utf-8"
					});
					FileSaver.saveAs(blob, file_name + ".mzml");
				});
			}
		}
	}

	handleSearchNameChange(event) {
		this.setState({
			searchName: event.target.value
		});
	}

	handleKindSelectChange(event) {
		this.setState({
			searchKind: event.target.value
		});
	}

	handleCryptoSelectChange(event) {
		this.setState({
			searchCrypto: event.target.value
		});
	}

	handleBeSearchedSelectChange(event) {
		this.setState({
			searchBeSearched: event.target.value
		});
	}

	handleSearch() {
		let searchList = [];
		for(let i in this.state.fileList) 
			if (((this.state.fileList[i].file_name.indexOf(this.state.searchName) !== -1) || (this.state.searchName === "")) && ((this.state.fileList[i].file_kind === this.state.searchKind) || (this.state.searchKind === "")) && ((this.state.fileList[i].file_crypto === this.state.searchCrypto) || (this.state.searchCrypto === "")) && ((this.state.fileList[i].beSearched === this.state.searchBeSearched) || (this.state.searchBeSearched === "")))
				searchList.push(this.state.fileList[i]);
		if(searchList.length === 0) {
			alert("找不到目标文件！！");
			searchList = this.state.fileList;
			this.setState({
				searchName: "",
				searchKind: "",
				searchCrypto: "",
				searchBeSearched: ""
			})
		}
		this.setState({
			currentFileList: searchList
		});
	}

	handleReset() {
		this.setState({
			searchName: "",
			searchKind: "",
			searchCrypto: "",
			searchBeSearched: "",
 			currentFileList: this.state.fileList
		});
	}

	render() {
		let i = 0 ;
		return (
			<div>
				<TopBar/>
				<div className="index-content">
					<LeftBar/>
					<div className="main-content">
						<h3>我的文件</h3>
						<hr/>
						<div className="search-div">
							<lable>文件名称:</lable>
							<input className="form-group" onChange={e => this.handleSearchNameChange(e)} value={this.state.searchName}/><br/>
							<lable>类别:</lable>
							<select className="form-group" onChange={e => this.handleKindSelectChange(e)} value={this.state.searchKind}>
								<option value="">--请选择--</option>
								<option value="人类">人类</option>
								<option value="小鼠">小鼠</option>
								<option value="昆虫">昆虫</option>
							</select>
							&nbsp;&nbsp;
							<lable>私有/公开:</lable>
							<select className="form-group" onChange={e => this.handleBeSearchedSelectChange(e)} value={this.state.searchBeSearched}>
								<option value="">--请选择--</option>
								<option value="1">公开</option>
								<option value="0">私有</option>
							</select>
							&nbsp;&nbsp;
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
						{ this.state.fileLoad ?
						this.state.currentFileList.length === 0 ?
						<span>您还没有文件！</span> :
						<table className="table table-bordered">
							<thead>
								<tr>
									<th>#</th>
									<th>文件名</th>
									<th>文件描述</th>
									<th>文件类别</th>
									<th>私有/公开</th>
									<th>加密</th>
									<th>金额(单位:聪)</th>
									<th>下载</th>
								</tr>
							</thead>
							<tbody>
								{ this.state.currentFileList.map( (aFile) => {
									i++;
									return (
										<tr key={ i }>
											<td>{ i }</td>
											<td>{ aFile.file_name }</td>
											<td>{ aFile.file_description }</td>
											<td>{ aFile.file_kind || "/" }</td>
											<td>{ aFile.beSearched === "1" ? "公开" : "私有" }</td>
											<td>{ aFile.beSearched === "0" ? "/" : aFile.file_crypto === "1" ? "是" : "否" }</td>

											<td>{ aFile.file_amount || "/" }</td>
											<td><a onClick={ () => this.handleDownloadEvent(aFile.file_name, aFile.beSearched, aFile.file_crypto) }>下载</a></td>
										</tr>
									)
								})}
							</tbody>
						</table> :
						<span>加载中...</span>
						}
					</div>
				</div>
				<SmallFoot/>
			</div>
		);
	}
}
