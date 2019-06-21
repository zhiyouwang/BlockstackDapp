import '../styles/style.css';
//import '../styles/decryptfile.css';
import React, {Component} from 'react';
import TopBar from './TopBar.jsx';
import LeftBar from './LeftBar.jsx';
import SmallFoot from './SmallFoot.jsx';
import CryptoJS from 'crypto-js/crypto-js';
import tripledes from 'crypto-js/tripledes';
import FileSaver from 'file-saver';
import $ from 'jquery';

let fileData = "";//save file data

export default class DecryptFile extends Component {

	constructor(props) {
		super(props);
		this.state = {
			sourceFile: "未选择文件",
			file_key: ""
		};
	}

	componentDidMount() {}

	handleDecrypt() {
		if(this.state.sourceFile === "未选择文件") {
			alert("请选择要解密的文件!");
		} else if(!(/.+\.mzml/i.test(this.state.sourceFile))) {
			alert("请上传.mzml格式的文件！");
		} else if(this.state.file_key === "") {
			alert("请输入解密密钥!");
		} else {
			let decryptedData = tripledes.decrypt(fileData, this.state.file_key).toString();
			let blob = new Blob([decryptedData], {
				type: "text/plain;charset=utf-8"
			});
			FileSaver.saveAs(blob, "decryptedFile.mzml");
		}
	}

	handleButtonClick(event) {
		$('#fileUpload').click();
	}

	handleFileChange(event) {
		let file = document.getElementById("fileUpload").files[0];
		if (file !== undefined) {
			this.setState({ sourceFile: event.target.value.slice(12) });
			let reader = new FileReader();
			reader.onload = function() {
				fileData = this.result;
				console.log(fileData);
				alert("选择成功！");
			};
			reader.readAsBinaryString(file);
		}else { this.setState({ sourceFile: "未选择文件" }); }
	}

	handleFileKeyChange(event) {
		this.setState({
			file_key: event.target.value
		});
	}

	render() {
		return (
			<div>
				<TopBar/>
				<div className="index-content">
					<LeftBar/>
					<div className="main-content">
						<h3>文件解密</h3>
						<hr/>
						<table className="table table-bordered">
							<tbody>
								<tr>
									<td><label className="control-label">需要解密的文件</label></td>
									<td>
										<button id="fileUpload-btn" className="btn btn-default" onClick={e => this.handleButtonClick(e)}>{this.state.sourceFile}</button>
										<input type="file" id="fileUpload" className="hidden" onChange={e => this.handleFileChange(e)}/>
									</td>
								</tr>
								<tr>
									<td><label className="control-label">密钥</label></td>
									<td><input className="form-control" onChange={ e => this.handleFileKeyChange(e) }  placeholder="请输入密钥" value={ this.state.file_key }/></td>
								</tr>
							</tbody>
						</table>
						<button className="btn btn-default" onClick={ this.handleDecrypt.bind(this) }>解密文件</button>
					</div>
				</div>
 				<SmallFoot/>
			</div>
		);
	}

}
