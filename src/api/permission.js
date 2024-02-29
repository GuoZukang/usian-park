import service from "@/utils/request";

// 查询所有角色
export const getAllRoleApi = () => {
  return service({
    url: "/park/sys/role",
    method: "GET",
  });
};

// 查询所有功能权限(树形)
export const getAllTreeApi = () => {
  return service({
    url: "/park/sys/permision/all/tree",
    method: "GET",
  });
};

// 查询当前角色详情-权限和分配人数
export const getRoleDetailApi = (roleId) => {
  return service({
    url: `/park/sys/role/${roleId}`,
    method: "GET",
  });
};

// 角色关联的用户列表
export const getRoleListApi = (params) => {
  return service({
    url: `/park/sys/roleUser/${params.roleId}`,
    method: "GET",
    params,
  });
};

// 删除角色
export const delRoleApi = (id) => {
  return service({
    url: `/park/sys/role/${id}`,
    method: "DELETE",
  });
};
