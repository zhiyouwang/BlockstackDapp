import '../styles/style.css';
import '../styles/index.css';
import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import TopBar from './TopBar.jsx';
import LeftBar from './LeftBar.jsx';
import SmallFoot from './SmallFoot.jsx';

export default class Index extends Component {
	
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
		<TopBar/>
		<div className="index-content">
		    <LeftBar/>
		    <div className="main-content">
			<h1>欢迎使用质谱数据管理系统</h1>
		    </div>
	        </div>
		<SmallFoot/>
            </div>
        );
    }

}
