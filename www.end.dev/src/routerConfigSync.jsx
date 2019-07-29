// 以下文件格式为描述路由的协议格式
// 你可以调整 routerConfig 里的内容
// 变量名 routeAsync routerConfig 为检测关键字，请不要修改名称

import AdminLayout from './library/layouts/AdminLayout';
import NotFound from './pages/NotFound';
import HomeIndex from './pages/Home/Index';
import PagesHomeAccountChangeLoginName from './pages/Home/AccountChangeLoginName';
import PagesHomeAccountChangeLoginPwd from './pages/Home/AccountChangeLoginPwd';
import PagesHomeAccountChangeSafePwd from './pages/Home/AccountChangeSafePwd';
import PagesSignIn from './pages/Sign/In';

const routerConfigSync = [
  /**
   * 路由
   * 参数
   *   path[ must ]
   *   name[ must ]
   *   component
   *   layout
   *   icon[ default::null ] see http://ant.design/components/icon-cn/
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
    layout: AdminLayout,
    component: HomeIndex,
  },
  {
    path: '/index',
    name: '中心',
    icon: 'laptop',
    children: [
      {
        path: '/data',
        name: '后台数据总览',
        icon: 'laptop',
        layout: AdminLayout,
        component: HomeIndex,
      },
      {
        path: '/account',
        name: '我的账号',
        icon: 'user',
        layout: AdminLayout,
        children: [
          {
            path: '/changeLoginName',
            name: '设定个性登录名',
            layout: AdminLayout,
            component: PagesHomeAccountChangeLoginName,
          },
          {
            path: '/changeLoginPwd',
            name: '设定登录密码',
            layout: AdminLayout,
            component: PagesHomeAccountChangeLoginPwd,
          },
          {
            path: '/changeSafePwd',
            name: '设定安全码',
            layout: AdminLayout,
            component: PagesHomeAccountChangeSafePwd,
          },
        ],
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
        component: PagesSignIn,
      },
    ],
  },
  // 除上面外所有其他路由的指向 *
  {
    path: '*',
    component: NotFound,
  },
];

export default routerConfigSync;
