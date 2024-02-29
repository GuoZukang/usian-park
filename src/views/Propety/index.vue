<template>
  <div>
    <el-form size="mini" :inline="true" :model="formInline">
      <el-form-item label="企业名称:">
        <el-input
          v-model="formInline.enterpriseName"
          placeholder="请输入企业名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="缴费时间:">
        <el-date-picker
          style="width: 250px"
          v-model="data"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <el-button size="mini" type="primary" @click="add">添加账单</el-button>
    <!-- 表格 -->
    <el-table
      ref="singleTable"
      :data="costList"
      highlight-current-row
      style="width: 100%; margin-top: 10px"
    >
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column
        property="billNumber"
        label="账单编号"
        width="150"
      ></el-table-column>
      <el-table-column
        property="enterpriseName"
        label="企业名称"
        width="150"
      ></el-table-column>
      <el-table-column
        property="buildingName"
        label="租赁楼宇"
      ></el-table-column>
      <el-table-column
        property="propertyFeePrice"
        label="物业费(元/㎡)"
      ></el-table-column>
      <el-table-column
        property="paymentAmount"
        label="账单金额(元)"
      ></el-table-column>
      <el-table-column property="createTime" label="缴费时间"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="text" @click="detailCost(row.id)">查看</el-button>
          <el-button type="text" @click="delCost(row.id)">删除</el-button>
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
    <!-- 添加账单模态框 -->
    <el-dialog
      title="添加账单"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
    >
      <el-form
        style="width: 70%; margin: auto"
        size="mini"
        label-position="top"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="选择租户" prop="enterpriseId">
          <el-select
            style="width: 100%"
            v-model="ruleForm.enterpriseId"
            placeholder="请选择用户"
          >
            <el-option
              v-for="item in allEnterprise"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="租赁楼宇" prop="buildingId">
          <el-select
            style="width: 100%"
            v-model="ruleForm.buildingId"
            placeholder="请选择租赁楼宇"
          >
            <el-option
              v-for="item in allBuilding"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="缴费周期" prop="data1">
          <el-date-picker
            style="width: 100%"
            v-model="data1"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="dataChange"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="支付金额" prop="paymentAmount">
          <el-input
            v-model="ruleForm.paymentAmount"
            placeholder="请输入支付金额"
            disabled
          ></el-input>
        </el-form-item>
        <el-form-item label="支付方式" prop="paymentMethod">
          <el-select
            style="width: 100%"
            v-model="ruleForm.paymentMethod"
            placeholder="请选择支付方式"
          >
            <el-option label="微信" :value="1"></el-option>
            <el-option label="支付宝" :value="2"></el-option>
            <el-option label="现金" :value="3"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleClose">取 消</el-button>
        <el-button size="mini" type="primary" @click="addCost">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 查看详情模态框 -->
    <el-dialog
      title="查看账单"
      :visible.sync="dialogVisible1"
      width="40%"
      :before-close="handleClose1"
    >
      <el-form
        style="width: 80%; margin: auto"
        :model="form"
        label-width="100px"
      >
        <el-form-item label="租户名称:">{{ form.enterpriseName }}</el-form-item>
        <el-form-item label="租赁楼宇:">{{ form.buildingName }}</el-form-item>
        <el-form-item label="缴费周期:"
          >{{ form.startTime }}至{{ form.endTime }}</el-form-item
        >
        <el-form-item label="物业费(元/㎡):">{{
          form.propertyFeePrice
        }}</el-form-item>
        <el-form-item label="账单金额(元):">{{
          form.paymentAmount
        }}</el-form-item>
        <el-form-item label="支付方式:">
          <span v-if="form.paymentMethod == 1">微信</span>
          <span v-else-if="form.paymentMethod == 2">支付宝</span>
          <span v-else>现金</span>
        </el-form-item>
        <el-form-item label="缴费时间:">{{ form.createTime }}</el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleClose1">取 消</el-button>
        <el-button size="mini" type="primary" @click="handleClose1"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getCostListApi,
  delCostApi,
  getAllEnterpriseApi,
  getAllBuildingApi,
  getPriceApi,
  addCostApi,
  detailCostApi,
} from "@/api/propetyCost";
export default {
  name: "Propety",
  data() {
    return {
      formInline: {
        enterpriseName: "",
        start: "",
        end: "",
        page: 1,
        pageSize: 10,
      },
      costList: [],
      total: 0,
      data: [],
      dialogVisible: false,
      ruleForm: {
        enterpriseId: "",
        buildingId: "",
        startTime: "",
        endTime: "",
        paymentAmount: "",
        paymentMethod: "",
      },
      rules: {
        enterpriseId: [
          { required: true, message: "请选择租户", trigger: "blur" },
        ],
        buildingId: [
          { required: true, message: "请选择租赁楼宇", trigger: "blur" },
        ],
        paymentAmount: [
          { required: true, message: "请输入支付金额", trigger: "blur" },
        ],
        paymentMethod: [
          { required: true, message: "请选择支付方式", trigger: "blur" },
        ],
      },
      data1: [],
      allEnterprise: [],
      allBuilding: [],
      dialogVisible1: false,
      form: {},
    };
  },
  methods: {
    // 获取物业费列表
    async getCostList() {
      const { data } = await getCostListApi(this.formInline);
      this.costList = data.rows;
      this.total = data.total;
    },
    // 分页
    handleSizeChange(num) {
      this.formInline.pageSize = num;
      this.getCostList();
    },
    handleCurrentChange(num) {
      this.formInline.page = num;
      this.getCostList();
    },
    // 搜索
    search() {
      if (this.data == [] || this.data == null) {
        this.formInline.start = "";
        this.formInline.end = "";
        this.getCostList();
      } else {
        this.formInline.start = this.data[0];
        this.formInline.end = this.data[1];
        this.getCostList();
      }
    },
    // 删除
    delCost(id) {
      this.$confirm("是否确认删除当前账单?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await delCostApi(id);
        this.getCostList();
        this.$message.success("删除成功");
      });
    },
    // 关闭添加模态框
    handleClose() {
      this.$refs.ruleForm.resetFields();
      this.ruleForm = {
        enterpriseId: "",
        buildingId: "",
        startTime: "",
        endTime: "",
        paymentAmount: "",
        paymentMethod: "",
      };
      this.data1 = [];
      this.dialogVisible = false;
    },
    // 打开模态框
    add() {
      this.getAllEnterprise();
      this.getAllBuilding();
      this.dialogVisible = true;
    },
    // 添加账单
    addCost() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          await addCostApi(this.ruleForm);
          this.handleClose();
          this.getCostList();
        }
      });
    },
    // 查询所有企业
    async getAllEnterprise() {
      const { data } = await getAllEnterpriseApi();
      this.allEnterprise = data;
    },
    // 查询所有楼宇
    async getAllBuilding() {
      const { data } = await getAllBuildingApi();
      this.allBuilding = data;
    },
    // 预算金额
    async getPrice() {
      const form = {
        buildingId: this.ruleForm.buildingId,
        startTime: this.ruleForm.startTime,
        endTime: this.ruleForm.endTime,
      };
      const { data } = await getPriceApi(form);
      this.ruleForm.paymentAmount = data;
    },
    // 选定日期触发
    dataChange() {
      this.ruleForm.startTime = this.data1[0];
      this.ruleForm.endTime = this.data1[1];
      this.getPrice();
    },
    // 关闭详情模态框
    handleClose1() {
      this.form = {};
      this.dialogVisible1 = false;
    },
    // 查看账单
    async detailCost(id) {
      this.dialogVisible1 = true;
      const { data } = await detailCostApi(id);
      this.form = data;
    },
  },
  created() {
    this.getCostList();
  },
};
</script>
<style lang="scss" scoped>
.page {
  text-align: right;
  margin-top: 20px;
}
</style>
