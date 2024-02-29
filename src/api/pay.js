import service from "@/utils/request";

// 查看停车缴费列表
export const getPayListApi = (params) => {
  return service({
    url: "/parking/payment/list",
    method: "GET",
    params,
  });
};
