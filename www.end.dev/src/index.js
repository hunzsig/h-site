import ReactDOM from 'react-dom';

import { BrowserRouter as Router } from 'react-router-dom';
import routerConfig from './routerConfigAsync';

import Api from './../h-react-library/common/Api';
import Auth from './../h-react-library/common/Auth';
import I18n from './../h-react-library/common/I18n';
import hRouter from './../h-react-library/hRouter';

import ExternalI18n from './i18n';

const CONTAINER = document.getElementById('h-container');

if (!CONTAINER) {
  throw new Error('当前页面不存在(Page has not) <div id="h-container"></div> 节点(Tag).');
}

const httpHost = '/api/http';
/*
const wxHost = 'ws://a.emc.jsontec.com/api/ws';
Api.setType('ws');
Api.setHost(wxHost);
Api.setCrypto({ mode: 'des-cbc', secret: 'UJJh6uG2', iv: 'fVR3noyO' });
Auth.setLoginPath('/sign/in');
*/

Api.setType('http');
Api.setHost(httpHost);
Auth.setLoginPath('/login');
I18n.setDefaultLang('zh_cn');
I18n.setExternal(ExternalI18n);
hRouter.setRouter(Router);
hRouter.setIsAsync(true);
hRouter.setConfig(routerConfig);
ReactDOM.render(hRouter.build(), CONTAINER);
