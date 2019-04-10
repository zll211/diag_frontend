import {routerHelperProvider} from '../../router';
import {entryRoute} from "./entry/entry.route";
import {userRoute} from "./user/user.route";

export const manageRoute = [{
  path: '/manage',
  component: () => import(/* webpackChunkName: "manage" */ './manage'),
  name: 'manage',
  beforeEnter: (to, from, next) => {
    next();
  },
  redirect: '/entry',
  children: [...entryRoute, ...userRoute],
}];

routerHelperProvider.configureRoutes(manageRoute);
