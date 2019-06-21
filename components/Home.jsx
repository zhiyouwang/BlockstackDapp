import React, {Component} from 'react';
import '../styles/style.css';
import Head from './Head.jsx';
import Foot from './Foot.jsx';
import { getFile, putFile, loadUserData } from 'blockstack';
import bitcoin from 'bitcoinjs-lib';
import * as API from './API.js';

const NETWORK = bitcoin.networks.regtest;

export default class Home extends Component {
	constructor(props) {
		super(props);
	}

	componentDidMount() {
		getFile("myAccount", { decrypt: true }).then( (data) => {
			if(data === null) {//还未创建比特币账户
				let keyPair = bitcoin.ECPair.makeRandom({ network: NETWORK });
				let p2pkh = bitcoin.payments.p2pkh({ pubkey: keyPair.publicKey, network: NETWORK });
				putFile("myAccount", JSON.stringify(keyPair), { encrypt: true }).then( () => {
					console.log("创建比特币账户成功");
				}).catch( (err) => { console.log(err); });
				putFile("myAddress", JSON.stringify(p2pkh.address), { encrypt: false }).then( () => {
					console.log("创建地址成功");
					let myAccounts = [];
					myAccounts.push("myAccount");
					putFile("myAccounts", JSON.stringify(myAccounts), { encrypt: true }).catch( (err) => { console.log(err); });
					API.importAddress(p2pkh.address, loadUserData().username);
				}).catch( (err) => { console.log(err); });
			}
		}).catch( (err) => { console.log(err); });
	}

	render() {
		return (
			<div>
				<Head/>
				<div className="content">
                    项目背景：<br/><br/>
                    质谱是一种与光谱并列的谱学方法，通常意义上是指广泛应用于各个科学领域中通过制备、分离、检测气相离子来鉴定化合物的一种专门技术，广泛应用于食品、化学、环境、能源、医药、运动、刑事科学、生命科学、材料科学等各个领域。<br/><br/>
                    质谱法是当前许多科学研究所依赖的方法，然而在某些领域中，当下却存在着一些棘手的问题。比如在医学领域中，一个可能的新兴应用场景是这样的，医疗人员首先使用质谱仪器收集某人数据，然后通过一系列质谱分析和算法分析的结合，得出该目标患有疾病的可能性。然而在该场景中，算法分析可能需要大量样本数据，而大量样本数据的获取是个难题，另外，研究人员拥有数据后，对数据如何管理也是值得担心的问题。为此，建立一套数据管理的规则是有必要且有意义的。通过这个系统，我们能实现质谱数据的共享，可以使更多的人更充分地使用已有的数据资源，减少资料收集、数据采集等重复劳动和相应费用，而把精力重点放在开发新的应用程序或新的研究上，同时，通过该系统能有效管理数据，可以使数据共享者减少数据共享风险，从而更乐于分享自己的数据。<br/><br/>
                    为了解决上述问题，我们使用BlockStack平台，开发了基于区块链的质谱数据资产管理系统，用于管理用户自身的质谱数据。我们提倡质谱数据由用户所拥有，然后用户通过该系统，能将质谱数据存储到自己指定的云存储端，同时其他用户可以通过该系统搜索到特定的质谱数据文件，然后对指定的质谱数据进行购买，从而完成质谱数据的授权。<br/><br/>
				</div>
				<Foot/>
			</div>
		);
	}
}
