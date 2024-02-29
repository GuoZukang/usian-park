import Layout from "@/layout";
export const asyncRoutes = [
  {
    path: "/park",
    component: Layout,
    alwaysShow: true,
    permission: "park",
    meta: { title: "园区管理", icon: "el-icon-office-building" },
    children: [
      {
        path: "building",
        permission: "park:building",
        meta: { title: "楼宇管理" },
        component: () => import("@/views/Park/Building/index"),
      },
      {
        path: "enterprise",
        permission: "park:enterprise",
        meta: { title: "企业管理" },
        component: () => import("@/views/Park/Enterprise/index"),
      },
    ],
  },
  {
    path: "/car",
    component: Layout,
    alwaysShow: true,
    permission: "parking",
    meta: { title: "行车管理", icon: "el-icon-guide" },
    children: [
      {
        path: "area",
        permission: "parking:area",
        meta: { title: "区域管理" },
        component: () => import("@/views/Car/Area"),
      },
      {
        path: "monthCard",
        permission: "parking:card",
        meta: { title: "月卡管理" },
        component: () => import("@/views/Car/MonthCard"),
      },
      {
        path: "pay",
        permission: "parking:payment",
        meta: { title: "停车缴费管理" },
        component: () => import("@/views/Car/Pay"),
      },
      {
        path: "billing",
        permission: "parking:rule",
        meta: { title: "计费规则管理" },
        component: () => import("@/views/Car/Billing"),
      },
    ],
  },
  {
    path: "/propety",
    component: Layout,
    children: [
      {
        path: "cost",
        component: () => import("@/views/Propety/index"),
        meta: { title: "物业费管理", icon: "el-icon-data-board" },
      },
    ],
  },
  {
    path: "/rod",
    permission: "pole",
    component: Layout,
    meta: { title: "一体杆管理", icon: "el-icon-refrigerator" },
    children: [
      {
        path: "manage",
        permission: "pole:info",
        component: () => import("@/views/Rod/Manage"),
        meta: { title: "一体杆管理" },
      },
      {
        path: "warnList",
        permission: "pole:warning",
        component: () => import("@/views/Rod/WarnList"),
        meta: { title: "告警记录" },
      },
    ],
  },
  {
    path: "/system",
    alwaysShow: true,
    permission: "sys",
    component: Layout,
    meta: { title: "系统管理", icon: "el-icon-setting" },
    children: [
      {
        path: "employee",
        permission: "sys:user",
        component: () => import("@/views/System/Employee"),
        meta: { title: "员工管理" },
      },
      {
        path: "permission",
        permission: "sys:role",
        component: () => import("@/views/System/Permission"),
        meta: { title: "角色管理" },
      },
    ],
  },
];
