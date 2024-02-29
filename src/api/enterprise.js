import service from "@/utils/request";

// 获取企业列表
export const getEnterpriseListApi = (params) => {
  return service({
    url: "/park/enterprise",
    method: "GET",
    params,
  });
};

// 删除企业
export const delEnterpriseApi = (id) => {
  return service({
    url: `/park/enterprise/${id}`,
    method: "DELETE",
  });
};

// 查看企业
export const detailEnterpriseApi = (id) => {
  return service({
    url: `/park/enterprise/${id}`,
    method: "GET",
  });
};

// 查询企业所属行业列表
export const getIndustryApi = () => {
  return service({
    url: "/park/industry",
    method: "GET",
  });
};

// 上传接口
export const uploadFilesApi = (data) => {
  return service({
    url: "/upload",
    method: "POST",
    headers: {
      "Content-Type": "multipart/form-data",
    },
    data,
  });
};

// 添加企业
export const addEnterpriseApi = (data) => {
  return service({
    url: "/park/enterprise",
    method: "POST",
    data,
  });
};

// 编辑企业
export const editEnterpriseApi = (data) => {
  return service({
    url: "/park/enterprise",
    method: "PUT",
    data,
  });
};

// 企业租赁信息列表-展开查看
export const getRentListApi = (id) => {
  return service({
    url: `/park/enterprise/rent/${id}`,
    method: "GET",
  });
};

// 添加/续租企业的租赁合同
export const addContractApi = (data) => {
  return service({
    url: "/park/enterprise/rent",
    method: "POST",
    data,
  });
};

// 退租租赁合同
export const quitRentApi = (id) => {
  return service({
    url: `/park/enterprise/rent/${id}`,
    method: "PUT",
  });
};

// 删除企业的租赁合同
export const delRentApi = (id) => {
  return service({
    url: `/park/enterprise/rent/${id}`,
    method: "DELETE",
  });
};

// 合同下载
export const downloadApi = (id) => {
  return service({
    url: `/download/${id}`,
    method: "GET",
    responseType: "blob",
  });
};
