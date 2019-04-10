import Vue from 'vue';

import {baseUrl} from '@/config/utils';

/**
 * 用户模块的服务
 * @class
 */
class UserService {
  /**
   * @constructor
   */
  constructor() {
  }

  /**
   * 添加用户
   * @param {Object} data 用户信息
   * @return {Promise}
   */
  addUser(data) {
    return Vue.http.post(`${baseUrl}/users`, data);
  }

  /**
   * 用户列表接口
   * @return {Promise}
   */
  userInfo(id) {
    return Vue.http.get(`${baseUrl}/users/${id}`);
  }

  /**
   * 用户列表接口
   * @return {Promise}
   */
  userList() {
    return Vue.http.get(`${baseUrl}/users`);
  }

  /**
   * 删除用户
   * @param {number} id 用户id
   * @return {Promise}
   */
  delUser(id) {
    return Vue.http.delete(`${baseUrl}/users/${id}`);
  }

  /**
   * 修改用户
   * @param {Object} data 用户信息
   * @return {Promise}
   */
  saveUser(data) {
    return Vue.http.put(`${baseUrl}/users`, data);
  }

  /**
   * 修改用户
   * @param {Object} data 用户信息
   * @return {Promise}
   */
  saveDirectory(data) {
    return Vue.http.post(`${baseUrl}/user_path`, data);
  }

}

const userService = new UserService();

export {userService};
