import service from "@/utils/request";

// 查询所有角色
export const getAllRoleApi = () => {
  return service({
    url: "/park/sys/role",
    method: "GET",
  });
};
