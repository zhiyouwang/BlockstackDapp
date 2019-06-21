import '../styles/style.css';
import '../styles/uploadfile.css';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import TopBar from './TopBar.jsx';
import LeftBar from './LeftBar.jsx';
import SmallFoot from './SmallFoot.jsx';
import { loadUserData } from "blockstack";
import * as API from './API.js';

export default class TxList extends Component {

	constructor(props) {
		super(props);
		this.state = {
			buyFileLoad: false,
			txList:[],
			currenttxList: [],
			searchtxID: "",
			isLoading: true
		};
	}

	componentDidMount() {
		API.getMSDataTX(loadUserData().username).then( (txList) => {
			console.log(txList);
			this.setState({
				txList: txList,
				currenttxList: txList,
				isLoading: false
			})
		})
	}


	handleSearchtxIDChange(event) {
		this.setState({
			searchtxID: event.target.value
		});
	}

	handleSearch() {
		this.setState({ isLoading: true });
		let searchList = [];
		for (let i in this.state.txList) 
			if(this.state.txList[i].txid.indexOf(this.state.searchtxID) !== -1)
				searchList.push(this.state.txList[i]);
		if(searchList.length === 0) {
			alert("找不到目标文件！！");
			searchList = this.state.txList;
			this.setState({
				searchtxID: ""
			})
		}
		this.setState({
			currenttxList: searchList,
			isLoading: false
		})
	}

	handleReset() {
		this.setState({
			searchtxID: "",
			currenttxList: this.state.txList
		})
	}

	render() {
		let i = 0;
		return (
			<div>
				<TopBar/>
				<div className="index-content">
					<LeftBar/>
					<div className="main-content">
						<h3>交易记录</h3>
						<hr/>
						<div className="search-div">
							<lable>查找交易:</lable>
							<input className="form-group" onChange={e => this.handleSearchtxIDChange(e)} value={this.state.searchtxID}/><br/>
						</div>
						<button className="btn btn-default" onClick={this.handleSearch.bind(this)}>查找</button>
						&nbsp;&nbsp;
						<button className="btn btn-default" onClick={this.handleReset.bind(this)}>重置</button>
						<br/>
						<hr/>
						{ this.state.txList.length === 0 ? "没有交易记录!" : !this.state.isLoading ?
						<table className="table table-bordered">
							<thead>
								<tr>
									<th>#</th>
									<th>交易ID</th>
									<th>文件名</th>
									<th>拥有者</th>
									<th>金额(单位:聪)</th>
									<th>购买/出售</th>
									<th>交易时间</th>
								</tr>
							</thead>
							<tbody>
							{ this.state.currenttxList.map( (tx) => {
							return (
								<tr key={ i++ }>
									<td>{ i }</td>
									<td>{ tx.txid }</td>
									<td>{ tx.file_name }</td>
									<td>{ tx.owner }</td>
									<td>{ tx.file_amount }</td>
									<td>{ tx.owner === loadUserData().username? "出售" : "购买"}</td>
									<td>{ tx.time }</td>
								</tr>
							)})}
							</tbody>
						</table> : <span>加载中...</span> }
					</div>
				</div>
 				<SmallFoot/>
			</div>
		);
	}

}
