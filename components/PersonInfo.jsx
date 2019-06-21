import '../styles/style.css';
import '../styles/personinfo.css';
import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import TopBar from './TopBar.jsx';
import LeftBar from './LeftBar.jsx';
import SmallFoot from './SmallFoot.jsx';

export default class PersonInfo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: props.location.state.userData,
            userImgUrl: props.location.state.userImgUrl
        };
        console.log(this.state);
    }

    componentDidMount() {

    }

    render() {
        return (
	    <div>
		<TopBar/>
		<div className="index-content">
		    <LeftBar/>
			<div className="main-content">
			    <h2>个人信息</h2><hr/>
                <img className="personinfo-img" src={this.state.userImgUrl}/><br/>
                <span>ID:{this.state.userData.username}</span>
                <br/><br/>
                <table className="table table-hover" id="personinfo-table">
                    <tbody>
                    <tr>
                        <td>名称:</td>
                        <td>{ this.state.userData.profile.name || "该用户还未设置名称" }</td>
                    </tr>
                    <tr>
                        <td>简介:</td>
                        <td>{ this.state.userData.profile.description || "该用户还未填写简介"}</td>
                    </tr>
                    <tr>
                        <td>比特币地址:</td>
                        <td>{ this.state.userData.identityAddress }<br/>(该地址用于Blockstack个人信息修改，不可用于文件交易)</td>
                    </tr>
                    <tr>
                        <td>hubUrl:</td>
                        <td>{ this.state.userData.hubUrl }</td>
                    </tr>
                    </tbody>
                </table><br/>
                <a className="btn btn-default" href="https://browser.blockstack.org/profiles">修改信息</a>
			</div>
		</div>
		<SmallFoot/>
	    </div>
        );
    }
}
