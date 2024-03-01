<template>
  <div class="Permission">
    <el-row>
      <!-- left -->
      <el-col class="col" :span="4">
        <div
          v-for="(item, index) in allRole"
          :key="index"
          class="role-item"
          :class="{ roleClass: roleId == item.roleId }"
          @click="roleItem(item.roleId)"
        >
          <div style="width: 100px">
            <i class="el-icon-user"></i>
            <el-tooltip
              class="item"
              effect="dark"
              :content="item.remark"
              placement="top"
            >
              <span>
                {{ item.roleName }}
              </span>
            </el-tooltip>
          </div>
          <el-popover placement="bottom" trigger="click">
            <div
              style="color: #000; cursor: pointer"
              @click="$router.push(`/system/role/add?id=${item.roleId}`)"
            >
              编辑角色
            </div>
            <div
              style="color: red; margin-top: 10px; cursor: pointer"
              @click="delRole(item)"
            >
              删除
            </div>
            <img
              slot="reference"
              @click="visible = true"
              src="../../../assets/三个点.png"
              alt=""
            />
          </el-popover>
        </div>
        <el-button plain @click="$router.push('/system/role/add')"
          >添加角色</el-button
        >
      </el-col>
      <!-- right -->
      <el-col :span="20" style="padding-left: 10px">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="功能权限" name="0">
            <div style="display: flex; width: 100%">
              <div class="module" v-for="(item, index) in allTree" :key="index">
                <div class="title">{{ item.title }}</div>
                <!-- tree结构 -->
                <el-tree
                  :data="item.children"
                  show-checkbox
                  :props="{ label: 'title' }"
                  :default-expand-all="true"
                  :expand-on-click-node="false"
                  :default-checked-keys="roleIdArr"
                  node-key="id"
                >
                </el-tree>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="'成员(' + userTotal + ')'" name="1">
            <!-- 表格 -->
            <el-table
              ref="singleTable"
              :data="roleList"
              highlight-current-row
              style="width: 100%"
            >
              <el-table-column
                type="index"
                label="序号"
                width="200"
              ></el-table-column>
              <el-table-column
                property="name"
                label="员工姓名"
              ></el-table-column>
              <el-table-column
                property="userName"
                label="登录账号"
              ></el-table-column>
            </el-table>
            <!-- 分页 -->
            <div class="page">
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="query.page"
                :page-sizes="[10, 20, 50, 100]"
                :page-size="query.pageSize"
                layout="total, prev, pager, next, sizes"
                :total="total"
              >
              </el-pagination>
            </div>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import {
  getAllRoleApi,
  getAllTreeApi,
  getRoleDetailApi,
  getRoleListApi,
  delRoleApi,
} from "@/api/permission";
import { addDisabled } from "@/utils/index";
export default {
  name: "Permission",
  data() {
    return {
      allRole: [],
      roleId: "",
      activeName: 0,
      allTree: [],
      perms: [],
      roleIdArr: [],
      userTotal: "",
      query: {
        page: 1,
        pageSize: 10,
      },
      roleList: [],
      total: 0,
    };
  },
  methods: {
    // 查询所有角色
    async getAllRole() {
      const { data } = await getAllRoleApi();
      this.allRole = data;
      this.roleId = data[0].roleId;
      this.getRoleDetail(this.roleId);
    },
    // 查询所有功能权限(树形)
    async getAllTree() {
      const { data } = await getAllTreeApi();
      this.allTree = data;
      addDisabled(this.allTree);
    },
    // 切换角色
    roleItem(id) {
      this.roleId = id;
      this.getRoleDetail(id);
      this.getRoleList();
    },
    // 查询当前角色详情-权限和分配人数
    async getRoleDetail(roleId) {
      this.roleIdArr = [];
      const { data } = await getRoleDetailApi(roleId);
      this.perms = data.perms;
      this.userTotal = data.userTotal;
      this.perms.forEach((item) => {
        item.forEach((ite) => {
          this.roleIdArr.push(ite);
        });
      });
      this.getAllTree();
    },
    // 角色关联的用户列表
    async getRoleList() {
      const { data } = await getRoleListApi({
        roleId: this.roleId,
        ...this.query,
      });
      this.roleList = data.rows;
      this.total = data.total;
    },
    // 点击tab触发的事件
    handleClick() {
      this.getRoleList();
    },
    // 分页
    handleSizeChange(num) {
      this.query.pageSize = num;
      this.getRoleList();
    },
    handleCurrentChange(num) {
      this.query.page = num;
      this.getRoleList();
    },
    // 删除角色
    async delRole(item) {
      const { data } = await getRoleDetailApi(item.roleId);
      if (data.userTotal == 0) {
        this.$confirm("删除后该角色下的用户权限失效，是否删除？", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(async () => {
          await delRoleApi(item.roleId);
          this.getAllRole();
          this.$message.success("操作成功");
        });
      } else {
        this.$confirm("删除角色前，请先移除角色内的所有成员", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {});
      }
    },
  },
  created() {
    this.getAllRole();
    this.getAllTree();
  },
};
</script>
<style lang="scss" scoped>
.Permission {
  height: 100%;
}
.role-item {
  width: 100%;
  height: 40px;
  font-size: 12px;
  display: flex;
  justify-content: space-between;
  justify-items: center;
  line-height: 40px;
  cursor: pointer;
  padding: 0 10px;
  box-sizing: border-box;
  img {
    width: 20px;
    height: 25px;
    margin-top: 10px;
  }
}
.roleClass {
  background-color: #edf5ff;
  color: #4770ff;
}
.el-button {
  width: 100%;
  height: 20px;
  line-height: 0px;
  margin-top: 10px;
}
.col {
  border-right: 1px solid #ccc;
  padding: 0 5px;
}
.module {
  width: 25%;
  height: 60vh;
  border-right: 1px solid #ccc;
  overflow: hidden;
  .title {
    width: 80%;
    height: 30px;
    background-color: #f5f7fa;
    margin: auto;
    font-size: 12px;
    text-align: center;
    line-height: 30px;
  }
}
.page {
  text-align: right;
  margin-top: 20px;
}
</style>
