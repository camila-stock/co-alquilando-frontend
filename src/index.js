import React from 'react';
import './i18n';
import ReactDOM from 'react-dom';
import App from './routes';
import config from './config.json'
import Amplify from 'aws-amplify';
import * as serviceWorker from './serviceWorker';
import './styles/index.scss';
import 'antd/dist/antd.css';

Amplify.configure({
  Auth: {
    mandatorySignId: true,
    region: config.cognito.REGION,
    userPoolId: config.cognito.USER_POOL_ID,
    userPoolWebClientId: config.cognito.APP_CLIENT_ID
  }
})

ReactDOM.render(
  <React.Fragment>
    <App />
  </React.Fragment>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
