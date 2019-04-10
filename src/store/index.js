import Vue from 'vue';
import Vuex from 'vuex';
import {stompModule} from "../service/stomp.store";

Vue.use(Vuex);

const state = {
  urlList: [],
  menus: [],
  isLogin: false,
  user: {},
  collapse: false,
};

const mutations = {
  setUser(state, user) {
    state.user = user;
  },
  setURL(state, list) {
    state.urlList = list;
  },
  setMenus(state, menus) {
    state.menus = menus;
  },
  isLogin(state, status) {
    state.isLogin = status;
  },
  setCollapse(state, collapse) {
    state.collapse = collapse;
  },
};

const actions = {};

export default new Vuex.Store({
  state,
  actions,
  mutations,
  modules: {
    stomp: stompModule
  }
});
