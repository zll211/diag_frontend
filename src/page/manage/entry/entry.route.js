import {analyzedRoute} from "./analyzed/analyzed.route";
import {unanalyzedRoute} from "./unanalyzed/unanalyzed.route";
import {analyzingRoute} from "./analyzing/analyzing.route";

export const entryRoute = [{
  path: '/entry',
  component: () => import(/* webpackChunkName: "entry" */ './entry'),
  name: '分析列表',
  beforeEnter: (to, from, next) => {
    next();
  },
  redirect: '/entry/analyzed',
  children: [...analyzedRoute, ...unanalyzedRoute, ...analyzingRoute],
  icon: 'assets/img/menu/entry.png',
}];
