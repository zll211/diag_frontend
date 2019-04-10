import Vue from 'vue';

import {baseUrl} from '@/config/utils';

/**
 * @class
 */
class PisSlideViewService {

  getImageInfo(fileName) {
    return Vue.http.get(`${baseUrl}/slice/info`, {params: {file: fileName}});
  }


  labelList(params) {
    return  Vue.http.get(`${baseUrl}/image_annotation`, {params});
  }

  saveLabel(content,fileName) {
    return  Vue.http.post(`${baseUrl}/image_annotation`,  content, {params: {path: fileName}});
  }

  deleteLabel(id,fileName) {
    return  Vue.http.delete(`${baseUrl}/image_annotation`, {params: {path: fileName}, body: {id: id}});
  }

  modifyLabel(id, content,fileName) {
    return  Vue.http.patch(`${baseUrl}/image_annotation`, content, {params: {path: fileName}});
  }

  navigatorPointList(fileName) {
    return  Vue.http.get(`${baseUrl}/image_annotation/above`, {params: {path: fileName}});
  }

  navigatorPoint(content, fileName) {
    return  Vue.http.post(`${baseUrl}/image_annotation/above`, content, {params: {path: fileName}});
  }

  labelImageList(params) {
    return  Vue.http.get(`${baseUrl}/slice/labels`, {params});
  }

  labelCount(fileName) {
    return  Vue.http.get(`${baseUrl}/image_annotation/count`, {params: {path: fileName}});
  }

  labelAverageInfo(fileName) {
    return  Vue.http.get(`${baseUrl}/image_annotation/mean`, {params: {path: fileName}});
  }

}

const pisSlideViewService = new PisSlideViewService();

export {pisSlideViewService};
