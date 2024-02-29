import service from "@/utils/request";

// 查看月卡信息列表
export const getMonthCardListApi = (params) => {
  return service({
    url: "/parking/card/list",
    method: "GET",
    params,
  });
};

// 删除月卡
export const delMonthCardApi = (ids) => {
  return service({
    url: `/parking/card/${ids}`,
    method: "DELETE",
  });
};
