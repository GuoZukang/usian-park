<template>
  <div class="pay">
    <el-form size="mini" :inline="true" :model="formInline">
      <el-form-item label="车牌号码:">
        <el-input
          v-model="formInline.carNumber"
          placeholder="请输入车牌号码"
        ></el-input>
      </el-form-item>
      <el-form-item label="缴纳状态:">
        <el-select v-model="formInline.paymentStatus" placeholder="未选择">
          <el-option label="全部" :value="null"></el-option>
          <el-option label="未缴纳" :value="0"></el-option>
          <el-option label="已缴纳" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="payList" style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="carNumber" label="车牌号码"></el-table-column>
      <el-table-column prop="chargeType" label="收费类型">
        <template v-slot="{ row }">
          {{ row.chargeType == "card" ? "月卡" : "临时停车" }}
        </template>
      </el-table-column>
      <el-table-column prop="parkingTime" label="停车总时长"></el-table-column>
      <el-table-column
        prop="actualCharge"
        label="缴纳费用(元)"
      ></el-table-column>
      <el-table-column prop="paymentStatus" label="缴纳状态">
        <template v-slot="{ row }">
          {{ row.paymentStatus === 0 ? "未缴纳" : "已缴纳" }}
        </template>
      </el-table-column>
      <el-table-column prop="paymentMethod" label="缴纳方式">
        <template v-slot="{ row }">
          <span v-if="row.paymentMethod == 'Alipay'">支付宝</span>
          <span v-else-if="row.paymentMethod == 'WeChat'">微信</span>
          <span v-else-if="row.paymentMethod == 'Cash'">线下</span>
          <span v-else>--</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="paymentTime"
        label="缴纳时间"
        width="150"
      ></el-table-column>
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
  </div>
</template>
<script>
import { getPayListApi } from "@/api/pay";
export default {
  name: "CarPay",
  data() {
    return {
      formInline: {
        page: 1,
        pageSize: 10,
        carNumber: "",
        paymentStatus: "",
      },
      payList: [],
      total: 0,
    };
  },
  methods: {
    // 获取停车缴费列表
    async getPayList() {
      const { data } = await getPayListApi(this.formInline);
      this.total = data.total;
      this.payList = data.rows;
    },
    // 分页
    handleSizeChange(num) {
      this.formInline.pageSize = num;
      this.getPayList();
    },
    handleCurrentChange(num) {
      this.formInline.page = num;
      this.getPayList();
    },
    // 搜索
    search() {
      this.getPayList();
    },
  },
  created() {
    this.getPayList();
  },
};
</script>
<style lang="scss" scoped>
.page {
  text-align: right;
  margin-top: 10px;
}
</style>
