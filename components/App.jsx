import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import '../styles/style.css';
import '../styles/app.css';
import {BrowserRouter as Router,Route} from 'react-router-dom';
import Home from './Home.jsx';
import Post from './Post.jsx';
import Contact from './Contact.jsx';
import About from './About.jsx';
import Advice from './Advice.jsx';
import Index from './Index.jsx';
import MyFile from './MyFile.jsx';
import UploadFile from './UploadFile.jsx';
import LookFile from './LookFile.jsx';
import BoughtFile from './BoughtFile.jsx';
import UndoTX from './UndoTX.jsx';
import TxList from './TxList.jsx';
import PersonInfo from './PersonInfo.jsx';
import Wallet from './Wallet.jsx';
import LookBlock from './LookBlock.jsx';
import LookTX from './LookTX.jsx';
import DecryptFile from './DecryptFile.jsx';

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="app-div">
                <Router>
                    <div>
                        <Route exact path="/" component={Home}/>
                        <Route path="/post" component={Post}/>
                        <Route path="/contact" component={Contact}/>
                        <Route path="/about" component={About}/>
                        <Route path="/advice" component={Advice}/>
			<Route path="/index" component={Index}/>
			<Route path="/myfile" component={MyFile}/>
			<Route path="/uploadfile" component={UploadFile}/>
			<Route path="/lookfile" component={LookFile}/>
			<Route path="/boughtfile" component={BoughtFile}/>
			<Route path="/undotx" component={ UndoTX }/>
			<Route path="/txlist" component={TxList}/>
			<Route path="/personinfo" component={PersonInfo}/>
			<Route path="/wallet" component={Wallet}/>
			<Route path="/lookblock" component={LookBlock}/>
			<Route path="/looktx" component={LookTX}/>
			<Route path="/decryptfile" component={DecryptFile}/>
                    </div>
                </Router>
            </div>
        );
    }
}
