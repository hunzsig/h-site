// 以下文件格式为描述路由的协议格式
// 你可以调整 routerConfig 里的内容
// 变量名 routeAsync routerConfig 为检测关键字，请不要修改名称
import React from 'react';
import { Icon } from 'antd';
import StaticLayout from './../h-react-library/layouts/StaticLayout';
import NotFound from './pages/NotFound';

const Layout = [StaticLayout, { theme: 'dark', primaryColor: '#3080fc' }];
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
    component: () => import('./pages/Home/Index'),
  },
  {
    path: '/index',
    name: '首页',
    icon: <Icon type="home" theme="outlined" />,
    layout: Layout,
    component: () => import('./pages/Home/Index'),
  },
  {
    path: '/power',
    name: '效率工具',
    icon: <Icon type="rise" />,
    children: [
      {
        path: '/sheinPoker',
        name: 'SHEIN扑克游戏',
        icon: <Icon type="pic-left" />,
        layout: Layout,
        component: () => import('./pages/Power/SheinPoker'),
      },
      {
        path: '/caleGym',
        name: '运算锻炼器',
        icon: <Icon type="calculator" />,
        layout: Layout,
        component: () => import('./pages/Power/CaleGym'),
      },
      {
        path: '/stockCale',
        name: '股票收益计算器',
        icon: <Icon type="stock" />,
        layout: Layout,
        component: () => import('./pages/Power/StockCale'),
      },
    ],
  },
  {
    path: '/netSource',
    name: '赋能网址',
    icon: <Icon type="global" />,
    layout: Layout,
    component: () => import('./pages/Home/NetSource'),
  },
  {
    path: '/project',
    name: '项目 · 经验',
    icon: <Icon type="appstore" theme="filled" />,
    layout: Layout,
    component: () => import('./pages/Home/Project'),
  },
  {
    path: '/login',
    name: '我要登录/注册',
    icon: <Icon type="user-add" />,
    component: () => import('./pages/Sign/In'),
  },
  // 除上面外所有其他路由的指向 *
  {
    path: '*',
    component: NotFound,
    async: false,
  },
];

export default routerConfig;
