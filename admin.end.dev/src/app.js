import ReactDOM from 'react-dom';

import { HashRouter as Router } from 'react-router-dom';
import routerConfig from './routerConfigSync';

import Api from './../h-react-library/common/Api';
import hRouter from './../h-react-library/hRouter';

const CONTAINER = document.getElementById('h-container');

if (!CONTAINER) {
  throw new Error('当前页面不存在 <div id="h-container"></div> 节点.');
}

let apiHost = 'http://a.hunzsig.my/api/http';
/*
if (window.location.hostname === '' || !window.location.hostname) {
  apiHost = 'ws://salary.hunzsig.com/api/ws'; // local
} else if (window.location.hostname.indexOf('127.0.0.1') === 0 || window.location.hostname.indexOf('localhost') === 0) {
  apiHost = 'ws://mysalary.com/api/ws'; // test
} else {
  apiHost = `ws://${window.location.host}/api/ws`; // common
}
*/


Api.setType('HTTP');
Api.setHost(apiHost);
hRouter.setRouter(Router);
hRouter.setIsAsync(true);
hRouter.setConfig(routerConfig);
ReactDOM.render(hRouter.build(), CONTAINER);
