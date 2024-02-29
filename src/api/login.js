import service from "@/utils/request";

// 登录
export const loginApi = (data) => {
  return service({
    url: "/park/login",
    method: "POST",
    data,
  });
};

// 获取用户信息
export const profileApi = () => {
  return service({
    url: "/park/user/profile",
    method: "GET",
  });
};
