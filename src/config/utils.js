const baseRoutes = [
  '/404', '/login', '/error',
];
const url = window.location.origin;

let STOMP_SERVICE = '';

const env = process.env.NODE_ENV;
if(env === "production" || env === "none"){
  STOMP_SERVICE= `wss://${window.location.hostname}:15675/ws`;
}else{
  STOMP_SERVICE = `ws://192.168.1.91:15674/ws`;
}

const STOMP_HEADERS = {
  login: 'guest',
  passcode: 'guest',
};

const baseUrl = `${url}/api`;

const formatDate = (date, type = '/') => {
  const {toString} = Object.prototype;
  if (!date) return;
  if (date::toString() === '[Object String]') {
    date = new date();
  }
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return [year, month, day].map(formatNumber).join(type);
};

const formatDateTime = (date, type = '-') => {
  if (!date) return;
  return formatDate(date, type) + ' ' + formatTime(date);
};

const formatTime = (date) => {
  const {toString} = Object.prototype;
  if (!date) return;
  if (date::toString() === '[Object String]') {
    date = new date(date);
  }
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  return [hour, minute, second].map(formatNumber).join(':');
};

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : '0' + n;
};

const strSplice = (str, index, count, newstr = '') => {
  if (!str) return '';
  if (index >= 0) {
    return str.slice(0, index) + newstr + str.slice(index + count);
  } else {
    return str.slice(0, str.length + index) + newstr + str.slice(str.length + index + count);
  }
};

const encodeQueryData = (data) => {
  let ret = [];
  for (let d in data) {
    if (Object.prototype.hasOwnProperty.call(data, d)) {
      ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]));
    }
  }
  return ret.join('&');
};

export {
  baseRoutes,
  baseUrl,
  url,
  formatDateTime,
  formatDate,
  formatTime,
  formatNumber,
  strSplice,
  STOMP_SERVICE,
  STOMP_HEADERS,
  encodeQueryData,
};

