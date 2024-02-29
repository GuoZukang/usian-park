import service from "@/utils/request";

// 获取角色管理列表数据
export const getRoleListApi = (params) => {
  return service({
    url: "/park/sys/user",
    method: "GET",
    params,
  });
};

// 添加员工
export const addRoleApi = (data) => {
  return service({
    url: "/park/sys/user",
    method: "POST",
    data,
  });
};

// 编辑员工(回显)
export const editRoleApi = (id) => {
  return service({
    url: `/park/sys/user/${id}`,
    method: "GET",
  });
};

// 确定编辑
export const editOkApi = (data) => {
  return service({
    url: "/park/sys/user",
    method: "PUT",
    data,
  });
};

// 删除
export const delRoleApi = (id) => {
  return service({
    url: `/park/sys/user/${id}`,
    method: "DELETE",
  });
};

// 重置密码
export const resetPwdApi = (data) => {
  return service({
    url: "/park/sys/user/resetPwd",
    method: "PUT",
    data,
  });
};
