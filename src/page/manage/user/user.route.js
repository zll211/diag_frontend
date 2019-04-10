export const userRoute = [{
  path: '/user',
  component: () => import(/* webpackChunkName: "user" */ './user'),
  name: '用户管理',
  beforeEnter: (to, from, next) => {
    next();
  },
  // redirect: '/manage',
  children: [],
  icon: 'assets/img/menu/user.png',
}];
