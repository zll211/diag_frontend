import Vue from 'vue';

import {baseUrl} from '@/config/utils';

/**
 * @class
 */
class ManageService {

  /**
   * 获取用户信息
   * @return {Promise}
   */
  userInfo(id) {
    return Vue.http.get(`${baseUrl}/user/${id}`);
  }
}

const manageService = new ManageService();

export {manageService};
