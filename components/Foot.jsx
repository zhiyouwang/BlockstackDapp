import React, { Component } from 'react';
import '../styles/foot.css';
import { Link } from 'react-router-dom';

export default class Foot extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="footer">
		<div className="footer-font-div">
		    <h4>质谱数据管理系统</h4>
		    <a href="http://localhost:8080/advice">意见反馈</a>
		    <p>联系电话:13823125942  QQ:505978299  E-mail:505978299@qq.com</p>
		</div>
            </div>
        );
    }
}
