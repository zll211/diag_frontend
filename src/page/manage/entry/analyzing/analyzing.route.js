export const analyzingRoute = [{
  path: 'analyzing',
  component: () => import(/* webpackChunkName: "analyzing" */ './analyzing'),
  name: '分析中',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/manage',
  children: [],
  show: false,
}];
