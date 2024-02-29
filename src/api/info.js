import service from "@/utils/request";

// 查看一体杆列表
export const getInfoListApi = (params) => {
  return service({
    url: "/pole/info/list",
    method: "GET",
    params,
  });
};

// 获取关联区域列表
export const getDropListApi = () => {
  return service({
    url: "/parking/area/dropList",
    method: "GET",
  });
};

// 添加一体杆
export const addInfoApi = (data) => {
  return service({
    url: "/pole/info",
    method: "POST",
    data,
  });
};

// 编辑一体杆
export const editInfoApi = (data) => {
  return service({
    url: "/pole/info",
    method: "PUT",
    data,
  });
};

// 删除一体杆
export const delInfoApi = (ids) => {
  return service({
    url: `/pole/info/${ids}`,
    method: "DELETE",
  });
};
