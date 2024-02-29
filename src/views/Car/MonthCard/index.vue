<template>
  <div>
    <el-form size="mini" :inline="true" :model="formInline">
      <el-form-item label="车牌号码:">
        <el-input
          v-model="formInline.carNumber"
          placeholder="请输入车牌号码"
        ></el-input>
      </el-form-item>
      <el-form-item label="车主姓名:">
        <el-input
          v-model="formInline.personName"
          placeholder="请输入车主姓名"
        ></el-input>
      </el-form-item>
      <el-form-item label="状态:">
        <el-select v-model="formInline.cardStatus" placeholder="未选择">
          <el-option label="全部" :value="null"></el-option>
          <el-option label="可用" :value="0"></el-option>
          <el-option label="已过期" :value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <div style="margin: 10px 0">
      <el-button size="mini" type="primary">添加月卡</el-button>
      <el-button size="mini" type="primary">批量删除</el-button>
      <el-tag style="margin-left: 400px">
        <i class="el-icon-warning"></i>
        <span style="color: #000; margin-left: 5px"
          >本园区共计 1530 个车位，月卡用户 0 人，车位占有率 0.00%</span
        >
      </el-tag>
    </div>
    <!-- 表格 -->
    <el-table
      ref="multipleTable"
      :data="monthCardList"
      tooltip-effect="dark"
      style="width: 100%"
    >
      <el-table-column type="selection" width="50"></el-table-column>
      <el-table-column type="index" label="序号" width="50"></el-table-column>
      <el-table-column
        prop="personName"
        label="车主名称"
        width="100"
      ></el-table-column>
      <el-table-column
        prop="phoneNumber"
        label="联系方式"
        width="130"
      ></el-table-column>
      <el-table-column
        prop="carNumber"
        label="车牌号码"
        width="130"
      ></el-table-column>
      <el-table-column
        prop="carBrand"
        label="车辆品牌"
        width="130"
      ></el-table-column>
      <el-table-column
        prop="totalEffectiveDate"
        label="剩余有效天数"
        width="130"
      ></el-table-column>
      <el-table-column prop="cardStatus" label="状态" width="80">
        <template v-slot="{ row }">
          {{ row.cardStatus === 0 ? "可用" : "已过期" }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="text">续费</el-button>
          <el-button type="text">查看</el-button>
          <el-button type="text">编辑</el-button>
          <el-button type="text" @click="delMonthCard(row.id)">删除</el-button>
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
  </div>
</template>
<script>
import { getMonthCardListApi, delMonthCardApi } from "@/api/monthCard";
export default {
  name: "CarCard",
  data() {
    return {
      formInline: {
        page: 1,
        pageSize: 10,
        carNumber: "",
        personName: "",
        cardStatus: "",
      },
      monthCardList: [],
      total: 0,
    };
  },
  methods: {
    // 获取月卡信息列表
    async getMonthCardList() {
      const { data } = await getMonthCardListApi(this.formInline);
      this.total = data.total;
      this.monthCardList = data.rows;
    },
    // 分页
    handleSizeChange(num) {
      this.formInline.pageSize = num;
      this.getMonthCardList();
    },
    handleCurrentChange(num) {
      this.formInline.page = num;
      this.getMonthCardList();
    },
    // 删除月卡
    delMonthCard(id) {
      this.$confirm("是否确定删除月卡?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const { code, msg } = await delMonthCardApi(id);
        if (code === 10000) {
          this.$message.success(msg);
        } else {
          this.$message.error(msg);
        }
        this.getMonthCardList();
      });
    },
  },
  created() {
    this.getMonthCardList();
  },
};
</script>
<style lang="scss" scoped>
.page {
  margin-top: 10px;
  text-align: right;
}
</style>
