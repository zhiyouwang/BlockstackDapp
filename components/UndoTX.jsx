import '../styles/style.css';
import '../styles/myfile.css';
import React, {Component} from 'react';
import TopBar from './TopBar.jsx';
import LeftBar from './LeftBar.jsx';
import SmallFoot from './SmallFoot.jsx';
import { loadUserData, getFile } from 'blockstack';
import * as API from './API.js';

export default class UndoTX extends Component {

	constructor(props) {
		super(props);
		this.state = {
			undotxlist: [],
			isLoading: true
		};
	}

	componentDidMount() {
		API.getUndoTX(loadUserData().username).then( (undotxlist) => {
			console.log(undotxlist);
			this.setState({
				undotxlist: undotxlist,
				isLoading: false
			});
		});
	}

	handleUploadKey(txid, file_name, buyer) {
		console.log("buyer:" + buyer);
		getFile("fileKeyList",{ decrypt:true }).then( (data) => {
			let fileKeyList = JSON.parse(data);
			let key = "";
			for(let i in fileKeyList) 
				if(fileKeyList[i].file_name === file_name)
					key = fileKeyList[i].file_key;
			console.log(key);
			API.putMSDataKey(txid, key)
			if(this.state.undotxlist.length === 1) {
				this.setState({
					undotxlist: [],
					isLoading: false
				});
			}else {
				let undotxlist = this.state.undotxlist;
				for(let i in undotxlist) {
					if(undotxlist[i].txid === txid) {
						this.setState({
							undotxlist: undotxlist = undotxlist.slice(i,1),
							isLoading: false
						});
						break;
					}
				}
			}

		})
	}

	render() {
		let key = 0;
		return (
			<div>
				<TopBar/>
				<div className="index-content">
					<LeftBar/>
					<div className="main-content">
						{ this.state.undotxlist.length === 0 ? <h3>没有待处理交易！</h3> :
						<div>
							<h3>未处理的交易</h3>
							<hr/>
							{ this.state.undotxlist.length === 0 ? null : !this.state.isLoading ?
							<table className="table table-bordered">
								<thead>
									<tr>
										<th>#</th>
										<th>交易ID</th>
										<th>文件名</th>
										<th>购买者</th>
										<th>金额</th>
										<th>时间</th>
										<th>操作</th>
									</tr>
								</thead>
								<tbody>
								{ this.state.undotxlist.map( (undotx) => {
									return (
										<tr key = { key++ }>
											<td>{ key }</td>
											<td>{ undotx.txid }</td>
											<td>{ undotx.file_name }</td>
											<td>{ undotx.buyer }</td>
											<td>{ undotx.file_amount }</td>
											<td>{ undotx.time }</td>
											<td><a onClick={ () => this.handleUploadKey(undotx.txid, undotx.file_name, undotx.buyer) }>上传密钥</a></td>
										</tr>
									)
								}) }
								</tbody>
							</table> : <span>加载中...</span> }
						</div> }
					</div>
				</div>
 				<SmallFoot/>
			</div>
		);
	}

}
