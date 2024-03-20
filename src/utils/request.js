import axios from "axios";
import store from "@/store";
import { getToken } from "@/utils/auth";
import { Message } from "element-ui";
import router from "@/router";

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 100000,
});
// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    if (store.getters.token) {
      config.headers.Authorization = "Bearer " + getToken();
    }
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  (response) => {
    const res = response.data;
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    if (res.code === 10000) {
      return res;
    }
    Message({
      message: res.msg || "Error",
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(new Error(res.msg || "Error"));
  },
  async (error) => {
    // token失效处理
    if (error.response.status === 401 && error.response.data.code === 40001) {
      // 1.清除token与用户信息
      await store.dispatch("user/logout");
      await store.commit("menu/removeMenu");

      // 2. 跳转到登录
      router.push("/login");

      // 3.跳转到登录页
      Message({
        message: "登录已过期，请重新登录",
        type: "error",
        duration: 5 * 1000,
      });
      return Promise.reject(new Error("登录已过期，请重新登录"));
    }

    Message({
      message: error.message,
      type: "error",
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

export default service;
