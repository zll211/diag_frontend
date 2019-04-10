export const unanalyzedRoute = [{
  path: 'unanalyzed',
  component: () => import(/* webpackChunkName: "unanalyzed" */ './unanalyzed'),
  name: '未分析',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/manage',
  children: [],
  show: false,
}];
