// 以下文件格式为描述路由的协议格式
// 你可以调整 routerConfig 里的内容
// 变量名 routeAsync routerConfig 为检测关键字，请不要修改名称

import React from 'react';
import { Icon } from 'antd';
import AdminLayout from './../h-react-library/layouts/AdminLayout';
import NotFound from './pages/NotFound';

const Layout = [AdminLayout, { theme: 'light', primaryColor: '#00BFFF' }];
const routerConfig = [
  /**
   * 路由
   * 参数
   *   path[ must ]
   *   name[ must ]
   *   component
   *   layout
   *   icon[ default::null ] see https://ant.design/components/icon-cn/
   *   hide[ default::false ]
   *   disabled[ default::false ]
   *   async[ default::routerAsync ]
   * must 参数 必须设置
   * 如果该路由使用过程中无需访问或者说仅仅作为children一个包容器，则 component 可不设置
   * hide === true 时不会在导航显示(注意 '/' 'sign' '*' 默认为hide且设定无效)
   */
  {
    path: '/',
    name: '首页',
    layout: Layout,
    component: () => import('./pages/Home/AccountChangeLoginName'),
  },
  {
    path: '/index',
    name: '我的',
    icon: <Icon type="home" theme="filled" />,
    children: [
      {
        path: '/account',
        name: '我的账号',
        icon: <Icon type="user" />,
        layout: Layout,
        children: [
          {
            path: '/changeLoginName',
            name: '设定个性登录名',
            layout: Layout,
            component: () => import('./pages/Home/AccountChangeLoginName'),
          },
          {
            path: '/changeLoginPwd',
            name: '设定登录密码',
            layout: Layout,
            component: () => import('./pages/Home/AccountChangeLoginPwd'),
          },
          {
            path: '/changeSafePwd',
            name: '设定安全码',
            layout: Layout,
            component: () => import('./pages/Home/AccountChangeSafePwd'),
          },
        ],
      },
    ],
  },
  {
    path: '/system',
    name: '系统',
    icon: <Icon type="setting" />,
    children: [
      {
        path: '/systemConfig',
        name: '系统配置',
        icon: <Icon type="hdd" />,
        layout: Layout,
        component: () => import('./pages/System/SystemConfig'),
      },
      {
        path: '/platform',
        name: '平台配置',
        icon: <Icon type="border" />,
        layout: Layout,
        component: () => import('./pages/System/Platform'),
      },
      {
        path: '/permission',
        name: '权限配置',
        icon: <Icon type="cluster" />,
        layout: Layout,
        component: () => import('./pages/System/Permission'),
      },
      {
        path: '/path',
        name: '限制性路径',
        icon: <Icon type="branches" />,
        layout: Layout,
        component: () => import('./pages/System/Path'),
      },
      {
        path: '/tipsI18n',
        name: '国际化',
        icon: <Icon type="global" />,
        layout: Layout,
        component: () => import('./pages/System/TipsI18n'),
      },
    ],
  },
  // sign里面的所有路由不会出现在导航之中
  {
    path: '/sign',
    name: '无需认证',
    children: [
      {
        path: '/in',
        name: '登录',
        component: () => import('./pages/Sign/In'),
      },
    ],
  },
  // 除上面外所有其他路由的指向 *
  {
    path: '*',
    component: NotFound,
    async: false,
  },
];

export default routerConfig;
