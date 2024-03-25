import router from "./router";
import store from "./store";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";
import { asyncRoutes } from "@/router/asyncRoutes";
import { Message } from "element-ui";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

// 过滤出一级路由所需要的权限点数据
const getFirstRoutePerms = (permiss) => {
  const newArr = permiss.map((item) => {
    return item.split(":")[0];
  });
  return [...new Set(newArr)];
};

// 过滤出二级路由所需要的权限点数据
const getSecondRoutePerms = (permiss) => {
  const newArr = permiss.map((item) => {
    const arr = item.split(":");
    return `${arr[0]}:${arr[1]}`;
  });
  return [...new Set(newArr)];
};

// 根据权限点从自定义路由表(动态路由表)匹配出当前用户所拥有的动态路由
const getRoutes = (firstPerms, secondPerms, asyncRoutes) => {
  if (firstPerms.includes("*")) {
    return asyncRoutes;
  }
  const routes = asyncRoutes
    .filter((item) => {
      // 过滤出当前用户所拥有的一级路由,返回出去
      return firstPerms.includes(item.permission);
    })
    .map((item) => {
      return {
        ...item,
        // 过滤出当前用户所拥有的二级路由,返回出去
        children: item.children.filter((child) =>
          secondPerms.includes(child.permission)
        ),
      };
    });
  return routes;
};

const whiteList = ["/login", "/404"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start();

  // set page title
  document.title = getPageTitle(to.meta.title);

  // determine whether the user has logged in
  const hasToken = getToken();

  if (hasToken) {
    if (to.path == "/login") {
      next("/");
      NProgress.done();
    } else {
      const hasGetUserInfo = store.getters.id;
      if (hasGetUserInfo) {
        next();
      } else {
        try {
          // 1. 先拿到后台返回的权限点数据
          const { permissions } = await store.dispatch("user/profile");
          // console.log("permissions=>", permissions);
          // 拿到一级路由权限点数据
          const firstPerms = getFirstRoutePerms(permissions);
          // console.log("firstPerms=>", firstPerms);
          // 拿到二级路由权限点数据
          const secondPerms = getSecondRoutePerms(permissions);
          // console.log("secondPerms=>", secondPerms);
          // 2. 再拿到自定义的路由表
          // 3. 匹配出当前登录的用户所有拥有的自定义的动态路由表
          const newRoutes = getRoutes(firstPerms, secondPerms, asyncRoutes);
          // console.log("newRoutes=>", newRoutes);
          router.addRoutes([
            ...newRoutes,
            // { path: "*", redirect: "/404", hidden: true },
          ]);
          store.commit("menu/setMenus", newRoutes);
          next(to.fullPath);
        } catch (error) {
          console.log(error);
          // 失败, 清空token 以及 用户信息
          await store.dispatch("user/logout");
          await store.commit("menu/removeMenu");
          // 进行错误信息提示
          Message.error(error || "Has Error");
          // 跳转到登录页
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    if (whiteList.includes(to.path)) {
      next();
    } else {
      next("/login");
      NProgress.done();
    }
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
