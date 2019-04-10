import './polyfill';
import ElementUI from 'element-ui';
import './style/element-variables.scss';
import Vue from 'vue';

import App from './App';
import {baseRoutes} from './config/utils';
import {httpHelperProvider} from './config/http';
import {router} from './router/';
import store from './store/';

isLogin().finally(() => {
  // 加载路由页面
  baseRoutes.forEach(name => require(`./page/base${name}${name}.route`));
  require(`./page/manage/manage.route`);
  Vue.config.productionTip = false;
  Vue.use(ElementUI);

  new Vue({
    el: '#app',
    router,
    store,
    template: '<App/>',
    components: {App},
  });
});

/**
 * 进行http request拦截，在请求之间做一些操作
 * @callback HttpHelperProvider~requestCallback
 */
httpHelperProvider.request(function (request) {
  // console.log(request);
});

/**
 * 进行http response拦截，在处理返回之前做通用的操作处理
 * @callback HttpHelperProvider~requestCallback
 */
httpHelperProvider.response(function (response) {
  if (response?.status === 401 || response?.body?.ret_code === 401) {
    window.sessionStorage.removeItem('accessToken');
    router.replace('/login');
    store.commit('isLogin', false);
  }
});

/**
 * 判断是否有权限进入特定的页面
 */
router.beforeEach((to, from, next) => {
  if (store.state.isLogin && (to.path === '/error' || to.path === '/login' || to.path === '/')) {
    if (from.path === '/error' || from.path === '/login' || from.path === '/' || from.path === '/404') {
      next('/manage');
    } else {
      next(false);
    }
    return;
  }
  next(true);
  /* if (store.state.urlList.find((uri) => ~to.path.indexOf(uri))) {
    next(true);
  } else {
    next('/404');
  }*/
});

/**
 * 判断是否登录
 */
async function isLogin() {
  store.commit('setURL', baseRoutes);
  if (window.sessionStorage.getItem('accessToken')) {
    store.commit('setMenus', []);
    store.commit('isLogin', true);
  } else {
    router.push('/login');
    store.commit('isLogin', false);
  }
}


