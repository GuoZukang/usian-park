import service from "@/utils/request";

// 物业费列表
export const getCostListApi = (params) => {
  return service({
    url: "/park/propertyfee",
    method: "GET",
    params,
  });
};

// 删除账单信息
export const delCostApi = (id) => {
  return service({
    url: `/park/propertyfee/${id}`,
    method: "DELETE",
  });
};

// 添加账单信息
export const addCostApi = (data) => {
  return service({
    url: "/park/propertyfee",
    method: "POST",
    data,
  });
};

// 查询所有企业
export const getAllEnterpriseApi = () => {
  return service({
    url: "/park/all/enterprise",
    method: "GET",
  });
};

// 查询所有楼宇
export const getAllBuildingApi = () => {
  return service({
    url: "/park/all/building",
    method: "GET",
  });
};

// 预算金额
export const getPriceApi = (data) => {
  return service({
    url: "/park/propertyfee/pre/payment",
    method: "POST",
    data,
  });
};

// 查看账单详情
export const detailCostApi = (id) => {
  return service({
    url: `/park/propertyfee/${id}`,
    method: "GET",
  });
};
