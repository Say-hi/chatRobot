import Vue from 'vue'
import Router from '../router'
var axios = require("axios");
var qs = require("qs");
var md5 = require('js-md5')
var store = require('../store.js')
let elVue = new Vue();

function get(url, param) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, param && {
        params: param
      })
      .then((res) => {
        let data = res.data || {
          code: -99,
          msg: res.statusText
        };
        return resolve(data);
      })
      .catch((err) => {
        handleError(err, reject);
      });
  })
}

function post(url, data) {
  return new Promise((resolve, reject) => {
    let timestamp = new Date().getTime()
    // console.log('store', store)
    let token = store.default.getters.token
    // let str = `${token}${timestamp}`
    // for (let val in data) {
    //   str += data[val]
    // }
    axios.request({
      url,
      data,
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
        token,
        timestamp
        // sign: md5(str)
      }
    }).then(res => {
      if (res.data.code === 500) {
        elVue.$alert(res.data.message || "服务器出错啦~")
        reject(res.data)
      } else if (res.data.code === 401) {
        elVue.$alert(res.data.message || "服务器出错啦~")
        Router.push({
          name: 'Login'
        })
      } else {
        resolve(res.data.data)
      }
    })
  })
}

function getScript(src, cb) {
  var script = document.createElement("script");
  script.type = 'text/javascript';
  script.async = true;
  script.charset = 'utf-8';
  script.src = src;
  if (cb) {
    script.onload = cb;
  }
  document.getElementsByTagName("head")[0].appendChild(script);
}

function upload(url, file) {
  return new Promise((resolve, reject) => {
    //创建form对象
    let param = new FormData();
    //通过append向form对象添加数据
    param.append('file', file, file.name);
    console.log(param.get('file'));
    let config = {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }; //添加请求头
    axios.post(url, param, config)
      .then((res) => {
        let data = res.data || {
          code: -99,
          msg: res.statusText
        };
        return resolve(data);
      })
      .catch((err) => {
        handleError(err, reject);
      });
  });
}

function handleError(err, reject) {
  if (err.message.indexOf("302") >= 0) {
    this.$message.warning("长时间不使用session过期,自动刷新页面");
    window.location.reload();
  } else {
    console.error(err);
    return reject({
      code: -100,
      msg: "网络错误，如多次出现请尝试刷新页面"
    });
  }
}
export default {
  get,
  post,
  getScript,
  upload
};