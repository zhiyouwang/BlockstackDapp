import React, {Component} from 'react';
import '../styles/style.css';
import Head from './Head.jsx';
import Foot from './Foot.jsx';

export default class Contact extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <Head/>
                <div className="content">
                    <h1>Contact.</h1>
                </div>
                <Foot/>
            </div>
        );
    }

}
