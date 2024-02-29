import service from "@/utils/request";

// 获取区域列表
export const getAreaListApi = (params) => {
  return service({
    url: "/parking/area/list",
    method: "GET",
    params,
  });
};

// 获取关联区域下拉列表
export const getListApi = () => {
  return service({
    url: "/parking/rule/list",
    method: "GET",
  });
};

// 添加区域
export const addAreaApi = (data) => {
  return service({
    url: "/parking/area",
    method: "POST",
    data,
  });
};

// 删除区域
export const delAreaApi = (id) => {
  return service({
    url: `parking/area/${id}`,
    method: "DELETE",
  });
};

// 编辑区域
export const editAreaApi = (data) => {
  return service({
    url: "/parking/area",
    method: "PUT",
    data,
  });
};
