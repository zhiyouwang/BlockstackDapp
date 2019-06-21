import '../styles/style.css';
import '../styles/leftbar.css';
import React, { Component } from 'react';
import {Link} from 'react-router-dom';

export default class LeftBar extends Component {
	
    constructor(props) {
        super(props);
    }

    render() {
        return (
	    <ul className="left-bar">
		<li><Link to="/index">欢迎使用</Link></li>
		<li><Link to="/myfile">我的文件</Link></li>
		<li><Link to="/uploadfile">文件上传</Link></li>
		<li><Link to="/lookfile">文件查找</Link></li>
		<li><Link to="/boughtfile">已购买的文件</Link></li>
		<li><Link to="/undotx">未处理的交易</Link></li>
		<li><Link to="/txlist">交易记录</Link></li>
		<li><Link to="/lookblock">区块查看</Link></li>
		<li><Link to="/looktx">交易查看</Link></li>
		<li><Link to="/decryptfile">文件解密</Link></li>
            </ul>
        );
    }

}
