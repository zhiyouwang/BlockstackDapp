import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import '../styles/style.css';
import '../styles/head.css';
import {
    isSignInPending,
    isUserSignedIn,
    redirectToSignIn,
    handlePendingSignIn,
    signUserOut
} from 'blockstack';

export default class Head extends Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        if (isSignInPending()) {
            handlePendingSignIn().then((userData) => {
                console.log(userData);
                window.location = window.location.origin;
			});
        }
    }

    handleSignIn(e) {
        e.preventDefault();
	let origin = window.location.origin;
        redirectToSignIn(origin, origin + '/manifest.json', ['store_write', 'publish_data']);
    }

    handleSignOut(e) {
        e.preventDefault();
        signUserOut(window.location.origin);
    }

    render() {
        return (
            <div>
                <nav className="header-nav">
                    <ul>
                        <li className="left-li"><Link to="/">首页</Link></li>
                        <li className="left-li"><Link to="/post">公告</Link></li>
                        <li className="left-li"><Link to="/contact">联系</Link></li>
                        <li className="left-li"><Link to="/about">关于</Link></li>
                        {!isUserSignedIn() ?
                            null :
                            <li className="right-li">
                                <a className="log-out" onClick={() => this.handleSignOut(event)}><span>退出</span></a>
                            </li>
                        }
                    </ul>
                </nav>
                <div className="header">
                    <div className="header-inner-div">
                        <p>欢迎使用质谱数据管理系统</p>
                        <h2>在这里您能：1.安全储存质谱数据；2.通过分享质谱数据获取收益。</h2>
                        {!isUserSignedIn() ?
                            <button className="log-in-btn"
                                    onClick={() => this.handleSignIn(event)}><span>立即登录</span>
                            </button>
                            :
                            <Link className="log-in-btn" to="/index"><span>进入系统</span></Link>
                        }
                    </div>
                </div>
            </div>
        );
    }
}
