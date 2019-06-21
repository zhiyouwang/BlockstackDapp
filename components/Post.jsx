import React, {Component} from 'react';
import '../styles/style.css';
import Head from './Head.jsx';
import Foot from './Foot.jsx';

export default class Post extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Head/>
                <div className="content">
                    <h1>公告</h1>
                    <h2>暂无公告</h2>
                </div>
                <Foot/>
            </div>
        );
    }

}
