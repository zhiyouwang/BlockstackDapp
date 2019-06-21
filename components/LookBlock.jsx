import '../styles/style.css';
//import '../styles/lookblock.css';
import React, {Component} from 'react';
import TopBar from './TopBar.jsx';
import LeftBar from './LeftBar.jsx';
import SmallFoot from './SmallFoot.jsx';
import * as API from './API.js';

export default class LookBlock extends Component {

	constructor(props) {
		super(props);
		this.state = {
			blockInfo: "",
			height: "",
			isLoading: false
		};
	}

	componentDidMount() {
		API.getBlockCount().then((blockCount) => {
			this.setState({
				blockCount: parseInt(blockCount)
			});
		});
	}

	handleSearch() {
		let height = parseInt(this.state.height);
		if(height > this.state.blockCount || height <= 0) {
			alert("输入正确的高度！");
			return;
		}
		if(height) {
			this.setState({ isLoading: true })
			API.getBlock(height).then( (block) => {
				this.setState({
					blockInfo: block,
					isLoading: false
				});
			});
		}else alert("输入正确的高度！");
	}

	handleReset() {
		this.setState({
			blockInfo: "",
			height: ""
		})
	}

	handleHeightChange(event) {
		this.setState({
			height: event.target.value
		})
	}

	render() {
		return (
			<div>
				<TopBar/>
				<div className="index-content">
					<LeftBar/>
					<div className="main-content">
						<h3>区块查看</h3>
						<hr/>
						<div className="search-div">
							<lable>区块高度(当前区块高度为{ this.state.blockCount }):</lable>
							<input className="form-group" placeholder="请输入要查询的区块高度" onChange={ e => this.handleHeightChange(e) } value={ this.state.height }/>
						</div>
						<button className="btn btn-default" onClick={ this.handleSearch.bind(this) }>搜索</button>
						&nbsp;&nbsp;
						<button className="btn btn-default" onClick={ this.handleReset.bind(this) }>重置</button>
						<br/>
						<hr/>
						{ this.state.blockInfo === "" ? null : !this.state.isLoading ?
						<table className="table table-hover" id="personinfo-table">
							<tbody>
								<tr>
									<td>bits:</td>
									<td>{ this.state.blockInfo.bits }</td>
								</tr>
								<tr>
									<td>version:</td>
									<td>{ this.state.blockInfo.version }</td>
								</tr>
								<tr>
									<td>previousblockhash:</td>
									<td>{ this.state.blockInfo.previousblockhash }</td>
								</tr>
								<tr>
									<td>hash:</td>
									<td>{ this.state.blockInfo.hash }</td>
								</tr>
								<tr>
									<td>height:</td>
									<td>{ this.state.blockInfo.height }</td>
								</tr>
								<tr>
									<td>merkleroot:</td>
									<td>{ this.state.blockInfo.merkleroot }</td>
								</tr>
								<tr>
									<td>tx:</td>
									<td>{ this.state.blockInfo.tx.map( (tx) => { return "[" + tx + "]"; }) }</td>
								</tr>
								<tr>						
									<td>size:</td>
									<td>{ this.state.blockInfo.size }</td>
								</tr>
								<tr>
									<td>confirmations:</td>
									<td>{ this.state.blockInfo.confirmations }</td>
								</tr>
								<tr>
									<td>weight:</td>
									<td>{ this.state.blockInfo.weight }</td>
								</tr>
								<tr>
									<td>versionHex:</td>
									<td>{ this.state.blockInfo.versionHex }</td>
								</tr>
								<tr>
									<td>nTx:</td>
									<td>{ this.state.blockInfo.nTx }</td>
								</tr>
								<tr>
									<td>time:</td>
									<td>{ this.state.blockInfo.time }</td>
								</tr>
								<tr>
									<td>mediantime:</td>
									<td>{ this.state.blockInfo.mediantime }</td>
								</tr>
								<tr>
									<td>chainwork:</td>
									<td>{ this.state.blockInfo.chainwork }</td>
								</tr>
								<tr>
									<td>difficulty:</td>
									<td>{ this.state.blockInfo.difficulty }</td>
								</tr>
								<tr>
									<td>strippedsize:</td>
									<td>{ this.state.blockInfo.strippedsize }</td>
								</tr>
               							<tr>
									<td>nextblockhash:</td>
									<td>{ this.state.blockInfo.nextblockhash }</td>
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
