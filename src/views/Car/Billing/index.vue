<template>
  <div>
    <el-button
      style="margin-bottom: 10px"
      size="mini"
      type="primary"
      @click="dialogVisible = true"
      >增加停车计费规则</el-button
    >
    <!-- 表格 -->
    <el-table
      ref="singleTable"
      :data="billingList"
      highlight-current-row
      style="width: 100%"
    >
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column
        property="ruleNumber"
        label="计费规则编号"
      ></el-table-column>
      <el-table-column
        property="ruleName"
        label="计费规则名称"
      ></el-table-column>
      <el-table-column
        property="freeDuration"
        label="免费时长(分钟)"
      ></el-table-column>
      <el-table-column property="chargeCeiling" label="收费上限(元)">
        <template v-slot="{ row }">
          <span v-if="row.chargeCeiling == null">--</span>
          <span v-else>{{ row.chargeCeiling }}</span>
        </template>
      </el-table-column>
      <el-table-column property="chargeType" label="计费方式">
        <template v-slot="{ row }">
          <span v-if="row.chargeType == 'duration'">时长收费</span>
          <span v-else-if="row.chargeType == 'turn'">按次收费</span>
          <span v-else>分段收费</span>
        </template>
      </el-table-column>
      <el-table-column
        property="ruleNameView"
        label="计费规则"
      ></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="text" @click="editBilling(row.id)">编辑</el-button>
          <el-button type="text" @click="delBilling(row.id)">删除</el-button>
        </template>
      </el-table-column>
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
    <!-- 添加计费规则模态框 -->
    <el-dialog
      :title="ruleForm.id ? '编辑计费规则' : '添加计费规则'"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
    >
      <el-form
        style="width: 80%; margin: auto"
        size="mini"
        label-position="top"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="计费规则编号" prop="ruleNumber">
          <el-input
            v-model="ruleForm.ruleNumber"
            placeholder="请输入计费规则编号"
          ></el-input>
        </el-form-item>
        <el-form-item label="计费规则名称" prop="ruleName">
          <el-input
            v-model="ruleForm.ruleName"
            placeholder="请输入计费规则名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="计费方式(全天免费)" prop="chargeType">
          <el-radio-group v-model="ruleForm.chargeType" size="small">
            <el-radio label="duration" border>时长收费</el-radio>
            <el-radio label="turn" border>按次收费</el-radio>
            <el-radio label="partition" border>分段收费</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <div
            style="
              display: flex;
              justify-content: space-between;
              line-height: 20px;
            "
          >
            <div>
              <div>免费时长</div>
              <div>
                <el-input-number
                  style="width: 150px"
                  v-model="ruleForm.freeDuration"
                  controls-position="right"
                  :min="1"
                  placeholder="请输入免费时长"
                ></el-input-number>
              </div>
            </div>
            <div style="line-height: 70px">分钟</div>
            <div>
              <div>收费上限</div>
              <div>
                <el-input
                  v-model="ruleForm.chargeCeiling"
                  placeholder="请输入收费上限"
                ></el-input>
              </div>
            </div>
            <div style="line-height: 70px">元</div>
          </div>
        </el-form-item>
        <el-form-item label="计费规则">
          <!-- 时长收费显示 -->
          <div
            v-if="ruleForm.chargeType == 'duration'"
            style="display: flex; justify-content: space-between"
          >
            <div>每</div>
            <div>
              <el-input-number
                style="width: 100px"
                v-model="ruleForm.durationTime"
                controls-position="right"
                :min="1"
                placeholder="请输入"
              ></el-input-number>
            </div>
            <div>
              <el-select v-model="ruleForm.durationType" placeholder="请选择">
                <el-option label="分钟" value="minute"></el-option>
                <el-option label="小时" value="hour"></el-option>
              </el-select>
            </div>
            <div>
              <el-input
                v-model="ruleForm.durationPrice"
                placeholder="请输入"
              ></el-input>
            </div>
            <div>元</div>
          </div>
          <!-- 按次收费显示 -->
          <div
            v-if="ruleForm.chargeType == 'turn'"
            style="width: 200px; display: flex; justify-content: space-around"
          >
            <div>每次</div>
            <el-input
              style="width: 140px"
              v-model="ruleForm.turnPrice"
              placeholder="请输入金额"
            ></el-input>
            <div>元</div>
          </div>
          <!-- 分段收费显示 -->
          <div v-if="ruleForm.chargeType == 'partition'">
            <div style="display: flex; justify-content: space-between">
              <div>
                <el-input-number
                  style="width: 100px"
                  v-model="ruleForm.partitionFrameTime"
                  controls-position="right"
                  :min="1"
                  placeholder="请输入"
                ></el-input-number>
              </div>
              <div>小时内，每小时收费</div>
              <el-input
                style="width: 100px"
                v-model="ruleForm.partitionFramePrice"
                placeholder="请输入"
              ></el-input>
              <div>元</div>
            </div>
            <div
              style="
                display: flex;
                justify-content: space-between;
                margin-top: 20px;
              "
            >
              <div>每增加</div>
              <div>
                <el-input-number
                  style="width: 100px"
                  v-model="ruleForm.partitionIncreaseTime"
                  controls-position="right"
                  :min="1"
                  placeholder="请输入"
                ></el-input-number>
              </div>
              <div>小时，增加</div>
              <el-input
                style="width: 100px"
                v-model="ruleForm.partitionIncreasePrice"
                placeholder="请输入"
              ></el-input>
              <div>元</div>
            </div>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button size="mini" @click="handleClose">取 消</el-button>
        <el-button size="mini" type="primary" @click="addBilling"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getBillingListApi,
  delBillingApi,
  addBillingApi,
  editBillingApi,
  confirmEditApi,
} from "@/api/billing";
export default {
  name: "CarRule",
  data() {
    return {
      query: {
        page: 1,
        pageSize: 10,
      },
      billingList: [],
      total: 0,
      dialogVisible: false,
      ruleForm: {
        ruleNumber: "",
        ruleName: "",
        chargeType: "duration",
        freeDuration: "",
        chargeCeiling: "",
        durationTime: "",
        durationType: "",
        durationPrice: "",
        turnPrice: "",
        partitionFrameTime: "",
        partitionFramePrice: "",
        partitionIncreaseTime: "",
        partitionIncreasePrice: "",
      },
      rules: {},
    };
  },
  methods: {
    // 获取计费规则列表
    async getBillingList() {
      const { data } = await getBillingListApi(this.query);
      this.billingList = data.rows;
      this.total = data.total;
    },
    // 分页
    handleSizeChange(num) {
      this.query.pageSize = num;
      this.getBillingList();
    },
    handleCurrentChange(num) {
      this.query.page = num;
      this.getBillingList();
    },
    // 删除计费规则
    delBilling(id) {
      this.$confirm("是否确认删除当前计费规则？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        const { code, msg } = await delBillingApi(id);
        if (code == 10000) {
          this.$message.success(msg);
        } else {
          this.$message.error(msg);
        }
        this.getBillingList();
      });
    },
    // 关闭添加模态框
    handleClose() {
      this.$refs.ruleForm.resetFields();
      this.ruleForm = {
        ruleNumber: "",
        ruleName: "",
        chargeType: "duration",
        freeDuration: "",
        chargeCeiling: "",
        durationTime: "",
        durationType: "",
        durationPrice: "",
        turnPrice: "",
        partitionFrameTime: "",
        partitionFramePrice: "",
        partitionIncreaseTime: "",
        partitionIncreasePrice: "",
      };
      this.dialogVisible = false;
    },
    // 添加/编辑计费规则
    addBilling() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          if (this.ruleForm.id) {
            await confirmEditApi(this.ruleForm);
            this.$message.success("编辑成功");
          } else {
            await addBillingApi(this.ruleForm);
            this.$message.success("添加成功");
          }
          this.handleClose();
          this.getBillingList();
        }
      });
    },
    // 编辑(回显)
    async editBilling(id) {
      const { data } = await editBillingApi(id);
      this.ruleForm = data;
      this.dialogVisible = true;
    },
  },
  created() {
    this.getBillingList();
  },
};
</script>
<style lang="scss" scoped>
.page {
  text-align: right;
  margin-top: 10px;
}
</style>
