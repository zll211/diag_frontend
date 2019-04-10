export const analyzedRoute = [{
  path: 'analyzed',
  component: () => import(/* webpackChunkName: "analyzed" */ './analyzed'),
  name: '已分析',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/manage',
  children: [],
  show: false,
}];
