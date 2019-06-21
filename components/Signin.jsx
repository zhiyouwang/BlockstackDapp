import React, { Component } from 'react';
import '../styles/signin.css';
import {redirectToSignIn} from "blockstack";

export default class Signin extends Component {
  constructor(props) {
    super(props);
  }

  render() {

    return (
      <div className="sign_in">
          sign in...
      </div>
    );
  }
}
