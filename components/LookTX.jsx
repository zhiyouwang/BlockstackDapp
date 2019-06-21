import '../styles/style.css';
//import '../styles/LookTX.css';
import React, {Component} from 'react';
import TopBar from './TopBar.jsx';
import LeftBar from './LeftBar.jsx';
import SmallFoot from './SmallFoot.jsx';
import * as API from './API.js';

export default class LookTX extends Component {

	constructor(props) {
		super(props);
		this.state = {
			txInfo: "",
			txid: "",
			isLoading: false,
			msInfo: []
		};
	}

	componentDidMount() {}

	handleSearch() {
		this.setState({ isLoading: true })
		API.getRawTX(this.state.txid).then( (tx) => {
			console.log(tx);
			let hex = tx.vout[0].scriptPubKey.hex;
			if(hex[0] === '6' && hex[1] === 'a' && hex[2] === '4' && hex[3] === 'c') {
				hex = hex.substring(4);
				let trimedStr = hex.trim();
				let rawStr = trimedStr.substr(0,2).toLowerCase() === "0x" ? trimedStr.substr(2) : trimedStr;
				let len = rawStr.length;
				let curCharCode;
				let resultStr = "";
				for(var i = 0; i < len;i = i + 2) {
					curCharCode = parseInt(rawStr.substr(i, 2), 16);
					resultStr += String.fromCharCode(curCharCode);
				}
				let info = resultStr.split(':')[1];
				this.setState({ msInfo: info.split(',') });
			}
			this.setState({
				txInfo: tx,
				isLoading: false
			});
		});
	}

	handleReset() {
		this.setState({
			txInfo: "",
			txid: ""
		})
	}

	handleTxidChange(event) {
		this.setState({
			txid: event.target.value
		})
	}

	render() {
		return (
			<div>
				<TopBar/>
				<div className="index-content">
					<LeftBar/>
					<div className="main-content">
						<h3>交易查看</h3>
						<hr/>
						<div className="search-div">
							<lable>交易ID:</lable>
							<input className="form-group" placeholder="输入交易ID" onChange={ e => this.handleTxidChange(e) } value={ this.state.txid }/>
						</div>
						<button className="btn btn-default" onClick={ this.handleSearch.bind(this) }>搜索</button>
						&nbsp;&nbsp;
						<button className="btn btn-default" onClick={ this.handleReset.bind(this) }>重置</button>
						<br/>
						<hr/>
						{ this.state.txInfo === "" ? null : !this.state.isLoading ?
						<table className="table table-hover" id="personinfo-table">
							<tbody>
								<tr>
									<td>version:</td>
									<td>{ this.state.txInfo.version }</td>
								</tr>
								<tr>
									<td>hash:</td>
									<td>{ this.state.txInfo.hash }</td>
								</tr>
								<tr>
									<td>txid:</td>
									<td>{ this.state.txInfo.txid }</td>
								</tr>
								<tr>
									<td>vin:</td>
									<td>{ this.state.txInfo.vin.map( (vin) => { return JSON.stringify(vin) ; }) }</td>

								</tr>
								<tr>
									<td>vout:</td>
									<td>{ this.state.txInfo.vout.map( (vout) => { return JSON.stringify(vout); }) }</td>
								</tr>
								<tr>
									<td>vsize:</td>
									<td>{ this.state.txInfo.vsize }</td>
								</tr>
								<tr>
									<td>weight:</td>
									<td>{ this.state.txInfo.weight }</td>
								</tr>
								<tr>
									<td>质谱数据交易信息:</td>
									<td>{ this.state.msInfo.length === 0 ? "无" : "[购买者:" + this.state.msInfo[0] + "],[拥有者:" + this.state.msInfo[1] + "],[文件:" + this.state.msInfo[2] + "],[金额(单位:聪):" + this.state.txInfo.vout[1].value * 10000 * 10000 + "]" }</td>
								</tr>
							</tbody>
						</table> : <span>读取中...</span> }
					</div>
				</div>
 				<SmallFoot/>
			</div>
		);
	}

}
