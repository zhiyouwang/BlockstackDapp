import '../styles/style.css';
import '../styles/uploadfile.css';
import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import TopBar from './TopBar.jsx';
import LeftBar from './LeftBar.jsx';
import SmallFoot from './SmallFoot.jsx';
import {getFile, putFile, loadUserData} from "blockstack";
import $ from 'jquery';
import CryptoJS from 'crypto-js';
import tripledes from 'crypto-js/tripledes';
import * as API from './API.js';

let fileData = "";//save file data

export default class UploadFile extends Component {
	constructor(props) {
		super(props);
		this.state = {
			fileKeyList: [],
			mySecureFileList: [],
			myFileList: [],
			file_name: "",
			file_description: "",
			file_crypto: "-1",
			file_amount: "",
			file_key: "",
			beSearched: "-1",
			sourceFile: "未选择文件",
			select: ""
		};
	}

	componentDidMount() {
		getFile("myFileList", { decrypt: false, zoneFileLookupURL: 'https://core.blockstack.org/v1/names/' }).then( (file) => {
			let myFileList = JSON.parse(file || '[]');
			this.setState({
				myFileList: myFileList
			});
			console.log(myFileList);
		});

		getFile("mySecureFileList", { decrypt: true, zoneFileLookupURL: 'https://core.blockstack.org/v1/names/' }).then( (file) => {
			let mySecureFileList = JSON.parse(file || '[]');
			this.setState({
				mySecureFileList: mySecureFileList
			});
			console.log(mySecureFileList);
		});

		getFile("fileKeyList", { decrypt: true, zoneFileLookupURL: 'https://core.blockstack.org/v1/names/' }).then( (file) => {
			let fileKeyList = JSON.parse(file || '[]');
			this.setState({
				fileKeyList: fileKeyList
			});
			console.log(fileKeyList);
		});
	}

	handleFileKeyChange(event) {
		this.setState({
			file_key: event.target.value
		});
	}

	handleFileAmountChange(event) {
		this.setState({
			file_amount: event.target.value
		});
	}

	handleFileNameChange(event) {
		this.setState({
			file_name: event.target.value
		});
	}

	handleDescriptionChange(event) {
		this.setState({
			file_description: event.target.value
		});
	}

	handleSelectChange(event) {
		this.setState({
			select: event.target.value
		});
	}

	handleButtonClick(event) {
		$('#fileUpload').click();
	}

	handleFileChange(event) {
		let file = document.getElementById("fileUpload").files[0];
		if (file !== undefined) {
			this.setState({
				sourceFile: event.target.value.slice(12)
			});
			let reader = new FileReader();
			reader.onload = function() {
				fileData = this.result;
				alert("选择成功！");
			};
			reader.readAsBinaryString(file);
		}else {
			this.setState({
				sourceFile: "未选择文件"
			});
		}
		$("#fileUpload-btn").blur();
	}

	handleCryptoChange(e) {
		if(e.target.value === "1") {
			$("#crypto-1")[0].checked = true;
			$("#crypto-0")[0].checked = false;
		} else if (e.target.value === "0") {
			$("#crypto-1")[0].checked = false;
			$("#crypto-0")[0].checked = true;
		}
		this.setState({
			file_crypto: e.target.value
		});
	}

	handleBeSearchChange(e) {
		this.setState({
			beSearched: e.target.value
		});
	}

	handleSubmit() {
		if(this.state.file_name === "") {
			alert("文件名不能为空!");
		}else if(this.state.file_description === "") {
			alert("文件描述不能为空!");
		}else if(this.state.sourceFile === "未选择文件") {
			alert("请选择源文件!");
		}else if(!(/.+\.mzml/i.test(this.state.sourceFile))) {
			alert("请上传.mzml格式的文件！");
		}else if(this.state.beSearched === "-1") {
			alert("请选择是否对他人可见！");
		}else if(this.state.file_description.length > 255) {
			alert("文件描述过长！");
		}else if(this.state.file_name.length > 50) {
			alert("文件名过长！");
		}else {
			let aFile = {
				file_name: this.state.file_name,
				file_description: this.state.file_description,
				file_kind: this.state.select
			};
			if(this.state.beSearched === "0") {//对他人不可见
				document.getElementById("submit-btn").disabled = true;
				this.state.mySecureFileList.push(aFile);
				putFile("mySecureFileList", JSON.stringify(this.state.mySecureFileList), { encrypt: true });
				putFile(aFile.file_name, fileData, { encrypt: true }).then( () => {
					fileData = "";
					alert("提交成功!");
					this.setState({
						file_name: "",
						file_description: "",
						sourceFile: "未选择文件",
						select: "",
						beSearched: "-1"
					});
					document.getElementById("fileUpload").value = "";
					$("#beSearched-1")[0].checked = false;
					$("#beSearched-0")[0].checked = false;
				}).finally( () => {
					document.getElementById("submit-btn").disabled = false;
				});
			}else {//对他人可见
				if(this.state.file_crypto === "-1"){//未选择是否加密
					alert("请选择是否加密")
				}
				else {
					if(this.state.file_crypto === "1") {//加密
						aFile.file_crypto = "1";
						if(this.state.file_key === "")//密钥为空
							alert("请输入密钥！");
						else if(!(parseInt(this.state.file_amount) > 0)) {//金额输入不合法
							alert("请输入正确的金额！");
						}else {//密钥、金额输入正常
							fileData = tripledes.encrypt(fileData, this.state.file_key).toString();
							aFile.file_amount = parseInt(this.state.file_amount);

							let fileKeyList_data = {
								file_name: this.state.file_name,
								file_key: this.state.file_key
							};
							this.state.fileKeyList.push(fileKeyList_data);
							putFile("fileKeyList", JSON.stringify(this.state.fileKeyList), { encrypt: true }).then( () => {
								console.log("fileKeyList上传成功。");
							});
							document.getElementById("submit-btn").disabled = true;
							this.state.myFileList.push(aFile);
							putFile("myFileList", JSON.stringify(this.state.myFileList), { encrypt: false });
							putFile(aFile.file_name, fileData, { encrypt: false }).then( () => {
								fileData = "";
								API.putMSFile(loadUserData().username, aFile.file_name, aFile.file_description, aFile.file_crypto, aFile.file_amount, "file_hash");
								alert("提交成功!");
								this.setState({
									file_name: "",
									file_description: "",
									sourceFile: "未选择文件",
									select: "",
									file_crypto: "-1",
									beSearched: "-1",
									file_amount: ""
								});
								document.getElementById("fileUpload").value = "";
								$("#beSearched-1")[0].checked = false;
								$("#beSearched-0")[0].checked = false;
							}).finally( () => {
								document.getElementById("submit-btn").disabled = false;
							});
						}
					}else if(this.state.file_crypto === "0") {//不加密
						aFile.file_crypto = "0";
						document.getElementById("submit-btn").disabled = true;
						this.state.myFileList.push(aFile);
						putFile("myFileList", JSON.stringify(this.state.myFileList), { encrypt: false });
						putFile(aFile.file_name, fileData, { encrypt: false }).then( () => {
							fileData = "";
							API.putMSFile(loadUserData().username, aFile.file_name, aFile.file_description, aFile.file_crypto, 0, "file_hash");
							alert("提交成功!");
							this.setState({
								file_name: "",
								file_description: "",
								sourceFile: "未选择文件",
								select: "",
								file_crypto: "-1",
								beSearched: "-1",
								file_amount: ""
							});
							document.getElementById("fileUpload").value = "";
							$("#beSearched-1")[0].checked = false;
							$("#beSearched-0")[0].checked = false;
						}).finally( () => {
							document.getElementById("submit-btn").disabled = false;
						});
					}
				}
			}
		}
	}

	render() {
		return (
 			<div>
 				<TopBar/>
				<div className="index-content">
					<LeftBar/>
					<div className="main-content">
						<div className="form-content">
							<h3>文件上传</h3>
							<table className="table table-bordered">
								<tbody>
									<tr>
										<td><label className="control-label">文件名</label></td>
										<td><input className="form-control" placeholder="输入您上传后的文件名..." onChange={e => this.handleFileNameChange(e)} value={this.state.file_name}/></td>
									</tr>
									<tr>
										<td><label className="control-label">文件描述</label></td>
										<td><textarea className="form-control" rows="3" onChange={e => this.handleDescriptionChange(e)} placeholder="简单描述一下您的文件..." value={this.state.file_description}/></td>
									</tr>
									<tr>
										<td><label className="control-label">源文件</label></td>
										<td>
											<button id="fileUpload-btn" className="btn btn-default" onClick={e => this.handleButtonClick(e)}>{this.state.sourceFile}</button>
											<input type="file" id="fileUpload" className="hidden" onChange={e => this.handleFileChange(e)}/>
										</td>
									</tr>
									<tr>
										<td><label className="control-label">文件类别</label></td>
										<td>
											<select className="form-control se" onChange={ e => this.handleSelectChange(e) } value={ this.state.select }>
												<option value="">--请选择--</option>
												<option value="人类">人类</option>
												<option value="小鼠">小鼠</option>
												<option value="昆虫">昆虫</option>
											</select>
											<a href="http://localhost:8080/kindmanagement">类别管理</a>
										</td>
									</tr>
									<tr>
										<td><label className="control-label">对他人可见</label></td>
										<td>
											<input id="beSearched-1" name="beSearched" type="radio" value="1" onChange={ e => this.handleBeSearchChange(e) }/>是
											&nbsp;&nbsp;&nbsp;&nbsp;
											<input id="beSearched-0" name="beSearched" type="radio" value="0" onChange={ e => this.handleBeSearchChange(e) }/>否
										</td>
									</tr>
									{ this.state.beSearched === "1" ?
									<tr>
										<td><label className="control-label">加密</label></td>
										<td>
											<input id="crypto-1" name="crypto" type="radio" value="1" onChange={ e => this.handleCryptoChange(e) }/>是
											 &nbsp;&nbsp;&nbsp;&nbsp;
											<input id="crypto-0" name="crypto" type="radio" value="0" onChange={ e => this.handleCryptoChange(e) }/>否
										</td>
									</tr> : null
									}
									{ this.state.beSearched === "1" && this.state.file_crypto === "1" ?
									<tr>
										<td><label className="control-label">文件加密密钥</label></td>
										<td><input className="form-control" onChange={ e => this.handleFileKeyChange(e) }  placeholder="请输入密钥" value={ this.state.file_key }/></td>
									</tr> : null
									}
									{ this.state.beSearched === "1" && this.state.file_crypto === "1" ?
									<tr>
										<td><label className="control-label">金额(单位:聪)</label></td>
										<td><input className="form-control" onChange={ e => this.handleFileAmountChange(e) }  placeholder="请输入金额" value={ this.state.file_amount }/></td>
									</tr> : null
									}
								</tbody>
							</table>
							<h6>*对他人可见:其他用户能否通过搜索功能查找到该文件</h6>
							{ this.state.beSearched === "1" ? <h6>*加密:文件是否对他人加密</h6> : null }
							{ this.state.beSearched === "1" && this.state.file_crypto === "1" ? <h6>*金额:文件的售卖金额</h6> : null }
							<button id="submit-btn" className="btn btn-primary" onClick={this.handleSubmit.bind(this)}>提交</button>
						</div>
					</div>
				</div>
			<SmallFoot/>
			</div>
		);
	}

}
