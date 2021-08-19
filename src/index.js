import React from 'react';
import ReactDOM from 'react-dom';
import './css/style.css';
import Home from './components/Home';

console.log("process.env: " + process.env);

let apiInvokeUrl = process.env.REACT_APP_API_INVOKE_URL;

let userPoolData = {
  UserPoolId: process.env.REACT_APP_USER_POOL_ID,
  ClientId: process.env.REACT_APP_USER_POOL_CLIENT_ID
};

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
let cognitoUserPool = new AmazonCognitoIdentity.CognitoUserPool(userPoolData);

ReactDOM.render(
  <React.StrictMode>
    <Home userPool={cognitoUserPool} apiUrl={apiInvokeUrl} />
  </React.StrictMode>,
  document.getElementById('app')
);
