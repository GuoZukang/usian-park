<template>
  <div>
    <el-form size="mini" :inline="true" :model="formInline">
      <el-form-item label="一体杆名称:">
        <el-input
          v-model="formInline.poleName"
          placeholder="请输入一体杆名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="一体杆编号:">
        <el-input
          v-model="formInline.poleNumber"
          placeholder="请输入一体杆编号"
        ></el-input>
      </el-form-item>
      <el-form-item label="运行状态:">
        <el-select v-model="formInline.poleStatus" placeholder="请选择运行状态">
          <el-option label="全部" :value="null"></el-option>
          <el-option label="正常" :value="0"></el-option>
          <el-option label="异常" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getInfoList">查询</el-button>
      </el-form-item>
    </el-form>
    <div style="margin: 10px 0">
      <el-button size="mini" type="primary" @click="dialogVisible = true"
        >添加一体杆</el-button
      >
      <el-button size="mini" @click="delAll">批量删除</el-button>
    </div>
    <!-- 表格 -->
    <el-table
      ref="multipleTable"
      :data="infoList"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection"></el-table-column>
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="poleName" label="一体杆名称"></el-table-column>
      <el-table-column prop="poleNumber" label="一体杆编号"></el-table-column>
      <el-table-column prop="poleIp" label="一体杆IP"></el-table-column>
      <el-table-column prop="areaName" label="安装区域"></el-table-column>
      <el-table-column prop="poleType" label="一体杆类型">
        <template v-slot="{ row }">
          {{ row.poleType == "entrance" ? "入口" : "出口" }}
        </template>
      </el-table-column>
      <el-table-column prop="poleStatus" label="运行状态">
        <template v-slot="{ row }">
          {{ row.poleStatus == 0 ? "正常" : "异常" }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="text" @click="editInfo(row)">编辑</el-button>
          <el-button type="text" @click="delInfo(row.id)">删除</el-button>
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
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <!-- 添加/编辑模态框 -->
    <el-dialog
      :title="ruleForm.id ? '编辑一体杆' : '添加一体杆'"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
    >
      <el-form
        style="width: 70%; margin: auto"
        label-position="top"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        size="mini"
      >
        <el-form-item label="一体杆名称" prop="poleName">
          <el-input
            v-model="ruleForm.poleName"
            placeholder="请输入一体杆名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="一体杆编号" prop="poleNumber">
          <el-input
            v-if="!ruleForm.id"
            v-model="ruleForm.poleNumber"
            placeholder="请输入一体杆编号"
          ></el-input>
          <el-input
            v-else
            v-model="ruleForm.poleNumber"
            placeholder="请输入一体杆编号"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="一体杆IP" prop="poleIp">
          <el-input
            v-model="ruleForm.poleIp"
            placeholder="请输入一体杆IP"
          ></el-input>
        </el-form-item>
        <el-form-item label="关联区域" prop="areaId">
          <el-select
            style="width: 100%"
            v-model="ruleForm.areaId"
            placeholder="请选择关联区域"
          >
            <el-option
              v-for="item in dropList"
              :label="item.areaName"
              :value="item.areaId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="一体杆类型" prop="poleType">
          <el-select
            style="width: 100%"
            v-model="ruleForm.poleType"
            placeholder="请选择一体杆类型"
          >
            <el-option label="入口" value="entrance"></el-option>
            <el-option label="出口" value="export"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleClose">取 消</el-button>
        <el-button size="mini" type="primary" @click="addInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getInfoListApi,
  getDropListApi,
  addInfoApi,
  editInfoApi,
  delInfoApi,
} from "@/api/info";
export default {
  name: "Manage",
  data() {
    return {
      formInline: {
        page: 1,
        pageSize: 10,
        poleName: "",
        poleNumber: "",
        poleStatus: "",
      },
      infoList: [],
      total: 0,
      dialogVisible: false,
      ruleForm: {
        poleName: "",
        poleNumber: "",
        poleIp: "",
        areaId: "",
        poleType: "",
      },
      rules: {
        poleName: [
          { required: true, message: "请输入一体杆名称", trigger: "blur" },
        ],
        poleNumber: [
          { required: true, message: "请输入一体杆编号", trigger: "blur" },
        ],
        poleIp: [
          { required: true, message: "请输入一体杆IP", trigger: "blur" },
        ],
        areaId: [
          { required: true, message: "请选择关联区域", trigger: "blur" },
        ],
        poleType: [
          { required: true, message: "请选择一体杆类型", trigger: "blur" },
        ],
      },
      dropList: [],
      idArr: "",
    };
  },
  methods: {
    // 查看一体杆列表
    async getInfoList() {
      const { data } = await getInfoListApi(this.formInline);
      this.infoList = data.rows;
      this.total = data.total;
    },
    // 获取关联区域列表
    async getDropList() {
      const { data } = await getDropListApi();
      this.dropList = data;
    },
    // 分页
    handleSizeChange(num) {
      this.formInline.pageSize = num;
      this.getInfoList();
    },
    handleCurrentChange(num) {
      this.formInline.page = num;
      this.getInfoList();
    },
    // 关闭模态框
    handleClose() {
      this.$refs.ruleForm.resetFields();
      this.ruleForm = {
        poleName: "",
        poleNumber: "",
        poleIp: "",
        areaId: "",
        poleType: "",
      };
      this.dialogVisible = false;
    },
    // 添加/编辑一体杆
    addInfo() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          if (this.ruleForm.id) {
            delete this.ruleForm.poleStatus;
            delete this.ruleForm.areaName;
            await editInfoApi(this.ruleForm);
            this.$message.success("编辑成功");
          } else {
            await addInfoApi(this.ruleForm);
            this.$message.success("添加成功");
          }
          this.handleClose();
          this.getInfoList();
        }
      });
    },
    // 编辑(回显)
    editInfo(row) {
      this.ruleForm = { ...row };
      this.dialogVisible = true;
    },
    // 删除一体杆
    delInfo(id) {
      this.$confirm("是否确认删除当前选中的一体杆?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await delInfoApi(id);
        this.getInfoList();
        this.$message.success("删除成功");
      });
    },
    // 批量删除
    handleSelectionChange(data) {
      // 将选中数据的id返回到一个新数组
      const ids = data.map((item) => item.id);
      // 将数组转化为字符串
      this.idArr = ids.join();
    },
    delAll() {
      if (this.idArr == []) {
        return this.$message({
          message: "请选择要删除的一体杆",
          type: "warning",
          center: true,
        });
      }
      // 调用删除的方法，将选中的id传过去
      this.delInfo(this.idArr);
    },
  },
  created() {
    this.getInfoList();
    this.getDropList();
  },
};
</script>
<style lang="scss" scoped>
.page {
  text-align: right;
  margin-top: 20px;
}
</style>
