import service from "@/utils/request";

// 获取楼宇数据
export const getBuildingListApi = (params) => {
  return service({
    url: "/park/building",
    method: "GET",
    params,
  });
};

// 添加楼宇
export const addBuildingApi = (data) => {
  return service({
    url: "/park/building",
    method: "POST",
    data,
  });
};

// 删除楼宇
export const delBuildingApi = (id) => {
  return service({
    url: `/park/building/${id}`,
    method: "DELETE",
  });
};

// 编辑楼宇(回显)
export const editBuildingApi = (id) => {
  return service({
    url: `/park/building/${id}`,
    method: "GET",
  });
};

// 修改楼宇
export const confirmBuildingApi = (data) => {
  return service({
    url: "/park/building",
    method: "PUT",
    data,
  });
};

// 查询可租赁楼宇
export const getRentBuildingApi = () => {
  return service({
    url: "/park/rent/building",
    method: "GET",
  });
};
