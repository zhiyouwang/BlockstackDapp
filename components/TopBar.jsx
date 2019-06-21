import '../styles/style.css';
import '../styles/topbar.css';
import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import {
loadUserData,
signUserOut
} from 'blockstack';

export default class TopBar extends Component {
	
    constructor(props) {
        super(props);
		let userData = loadUserData();
		let userImage = 'http://localhost:8080/avatar-placeholder.jpg';
		if(userData.profile.image)
            userImage = userData.profile.image[0].contentUrl;
		this.state = {
			username: userData.profile.name || userData.username,
			userImgUrl: userImage,
			userData: userData
        };
		if(this.props.getId)
        	this.props.getId(userData.username);
    	}

    handleSignOut(e) {
        e.preventDefault();
        signUserOut(window.location.origin);
    }

    render() {
        return (
            <ul className="bar-ul">
					<li className="welcome"><span className="welcome-text">欢迎使用质谱数据管理系统！</span></li>
					<li className="log-out"><button className="log-out-btn" onClick={() => this.handleSignOut(event)}>退出</button></li>
					<div className="dropdown">
						<button className="dropbtn"><span className="person"><img className="img-circle" src={this.state.userImgUrl}/>&nbsp;&nbsp;{this.state.username}</span></button>
						<div className="dropdown-content">
							<Link to={
                                {
                                    pathname:`/personinfo`,
                                    state:{
                                    	userData: this.state.userData,
                                        userImgUrl: this.state.userImgUrl
									}
                            	}
                            }>个人信息</Link>
							<Link to="/wallet">我的钱包</Link>
						</div>
					</div>
				</ul>
        );
    }

}
