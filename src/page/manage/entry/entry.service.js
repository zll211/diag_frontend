import Vue from 'vue';
import {baseUrl} from '@/config/utils';

class EntryService {
  constructor() {

  }

  //得到切片列表
  sliceList(params) {
    return Vue.http.get(`${baseUrl}/slices`, {params: params});
  }

  // 切片录入
  sliceEntry(params) {
    return Vue.http.get(`${baseUrl}/slices/scan`, {params});
  }

  //下载图片
  downloadJSON(params) {
    return Vue.http.get(`${baseUrl}/download/labels`, {params: params});
  }

  uploadJson(data) {
    return Vue.http.post(`${baseUrl}/image_annotation/upload`, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  }

  progressStatus(params) {
    return Vue.http.get(`${baseUrl}/file/queue_status`, {params: params});
  }

  batchParseJson(data) {
    return Vue.http.post(`${baseUrl}/analytical/batch`, data);
  }

  autoParseJson(data) {
    return Vue.http.post(`${baseUrl}/analytical/all`, data);
  }


  analyzeSlide(data) {
    return Vue.http.post(`${baseUrl}/analyze`, data);
  }
}

const entryService = new EntryService();
export {entryService}
