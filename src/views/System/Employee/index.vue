<template>
  <div>
    <el-form size="mini" :inline="true" :model="formInline">
      <el-form-item label="员工姓名:">
        <el-input
          v-model="formInline.name"
          placeholder="请输入员工姓名"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getRoleList">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 添加按钮 -->
    <el-button style="margin: 10px 0" size="mini" type="primary" @click="open"
      >添加员工</el-button
    >
    <!-- 表格 -->
    <el-table
      ref="singleTable"
      :data="roleList"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column property="name" label="员工姓名"></el-table-column>
      <el-table-column property="userName" label="登录账号"></el-table-column>
      <el-table-column
        property="phonenumber"
        label="联系方式"
      ></el-table-column>
      <el-table-column
        property="roleName"
        label="角色"
        width="130"
      ></el-table-column>
      <el-table-column property="status" label="状态">
        <template v-slot="{ row }">
          {{ row.status === 0 ? "禁用" : "启用" }}
        </template>
      </el-table-column>
      <el-table-column
        property="createTime"
        label="添加时间"
        width="180"
      ></el-table-column>
      <el-table-column label="操作" width="180">
        <template v-slot="{ row }">
          <el-button type="text" @click="editRole(row.id)">编辑</el-button>
          <el-button type="text" @click="delRole(row.id)">删除</el-button>
          <el-button type="text" @click="resetPwd(row.id)">重置密码</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="formInline.page"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="formInline.pageSize"
        layout="total, prev, pager, next, sizes"
        :total="total"
      >
      </el-pagination>
    </div>
    <!-- 添加/编辑模态框 -->
    <el-dialog
      :title="ruleForm.id ? '编辑员工' : '添加员工'"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
    >
      <el-form
        style="width: 80%; margin: auto"
        label-position="top"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        size="mini"
      >
        <el-form-item label="员工姓名" prop="name">
          <el-input
            v-model="ruleForm.name"
            placeholder="请填写员工姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="登录账号" prop="userName">
          <el-input
            v-model="ruleForm.userName"
            placeholder="请填写登录账号"
          ></el-input>
        </el-form-item>
        <el-form-item label="联系方式" prop="phonenumber">
          <el-input
            v-model="ruleForm.phonenumber"
            placeholder="请填写联系方式"
          ></el-input>
        </el-form-item>
        <el-form-item>默认密码：123456</el-form-item>
        <el-form-item label="分配角色" prop="roleId">
          <el-select
            style="width: 100%"
            v-model="ruleForm.roleId"
            placeholder="请选择分配角色"
          >
            <el-option
              v-for="(item, index) in allRole"
              :key="index"
              :label="item.roleName"
              :value="item.roleId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="员工状态" prop="status">
          <el-radio-group v-model="ruleForm.status">
            <el-radio :label="0">禁用</el-radio>
            <el-radio :label="1">启用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="handleClose">取 消</el-button>
        <el-button size="mini" type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getRoleListApi,
  addRoleApi,
  editRoleApi,
  editOkApi,
  delRoleApi,
  resetPwdApi,
} from "@/api/role";
import { getAllRoleApi } from "@/api/user";
export default {
  name: "Employee",
  data() {
    return {
      formInline: {
        name: "",
        page: 1,
        pageSize: 10,
      },
      roleList: [],
      total: 0,
      allRole: [],
      dialogVisible: false,
      ruleForm: {
        name: "",
        userName: "",
        phonenumber: "",
        roleId: "",
        status: "",
      },
      rules: {
        name: [{ required: true, message: "请填写员工姓名", trigger: "blur" }],
        userName: [
          { required: true, message: "请填写登录账号", trigger: "blur" },
        ],
        phonenumber: [
          { required: true, message: "请填写联系方式", trigger: "blur" },
        ],
        roleId: [
          { required: true, message: "请选择分配角色", trigger: "blur" },
        ],
        status: [
          { required: true, message: "请选择员工状态", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 获取角色管理列表数据
    async getRoleList() {
      const { data } = await getRoleListApi(this.formInline);
      this.roleList = data.rows;
      this.total = data.total;
    },
    // 分页
    handleSizeChange(num) {
      this.formInline.pageSize = num;
      this.getRoleList();
    },
    handleCurrentChange(num) {
      this.formInline.page = num;
      this.getRoleList();
    },
    // 关闭模态框
    handleClose() {
      this.$refs.ruleForm.resetFields();
      this.ruleForm = {
        name: "",
        userName: "",
        phonenumber: "",
        roleId: "",
        status: "",
      };
      this.dialogVisible = false;
    },
    // 打开模态框
    async open() {
      // 查询所有角色
      const { data } = await getAllRoleApi();
      this.allRole = data;
      this.dialogVisible = true;
    },
    // 添加/编辑员工
    addRole() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          if (this.ruleForm.id) {
            await editOkApi(this.ruleForm);
            this.$message.success("编辑成功");
          } else {
            await addRoleApi(this.ruleForm);
            this.$message.success("添加成功");
          }
          this.getRoleList();
          this.handleClose();
        }
      });
    },
    // 编辑员工(回显)
    async editRole(id) {
      const { data } = await editRoleApi(id);
      this.ruleForm = {
        id: data.id,
        name: data.name,
        userName: data.userName,
        phonenumber: data.phonenumber,
        roleId: data.roleId,
        roleName: data.roleName,
        status: data.status,
      };
      this.dialogVisible = true;
    },
    // 删除员工
    async delRole(id) {
      this.$confirm("删除员工后，该员工账号将无法登录，是否删除？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await delRoleApi(id);
        this.getRoleList();
        this.$message.success("删除成功");
      });
    },
    // 重置密码
    resetPwd(id) {
      this.$confirm("确定将密码重置为“123456”？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await resetPwdApi({ id: id });
        this.getRoleList();
        this.$message.success("重置密码成功");
      });
    },
  },
  created() {
    this.getRoleList();
  },
};
</script>
<style lang="scss" scoped>
.page {
  text-align: right;
  margin-top: 20px;
}
</style>
