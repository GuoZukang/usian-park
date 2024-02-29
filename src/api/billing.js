import service from "@/utils/request";

// 查看计费规则列表
export const getBillingListApi = (params) => {
  return service({
    url: "/parking/rule/list",
    method: "GET",
    params,
  });
};

// 删除计费规则
export const delBillingApi = (id) => {
  return service({
    url: `/parking/rule/${id}`,
    method: "DELETE",
  });
};

// 添加计费规则
export const addBillingApi = (data) => {
  return service({
    url: "/parking/rule",
    method: "POST",
    data,
  });
};

// 编辑(回显)
export const editBillingApi = (id) => {
  return service({
    url: `/parking/rule/${id}`,
    method: "GET",
  });
};

// 确定编辑
export const confirmEditApi = (data) => {
  return service({
    url: "/parking/rule",
    method: "PUT",
    data,
  });
};
