<template>
  <div>
    <el-button size="small" type="primary" @click="dialogVisible = true"
      >添加区域</el-button
    >
    <!-- 表格 -->
    <el-table :data="areaList" style="width: 100%">
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="areaName" label="区域名称"></el-table-column>
      <el-table-column prop="spaceNumber" label="车位数(个)"></el-table-column>
      <el-table-column prop="areaProportion" label="面积(㎡)"></el-table-column>
      <el-table-column prop="ruleName" label="计费规则">
        <template v-slot="{ row }">
          <el-tooltip
            class="item"
            effect="dark"
            :content="row.hoverRuleName"
            placement="top"
          >
            <span>{{ row.ruleName }}</span>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="{ row }">
          <el-button type="text" @click="editArea(row)">编辑</el-button>
          <el-button type="text" @click="delArea(row.id)">删除</el-button>
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
        layout="total, prev, pager, next, sizes, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
    <!-- 添加区域模态框 -->
    <el-dialog
      :title="ruleForm.id ? '编辑区域' : '添加区域'"
      :visible.sync="dialogVisible"
      width="40%"
      :before-close="handleClose"
    >
      <el-form
        label-position="top"
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
        size="mini"
      >
        <el-form-item label="区域名称" prop="areaName">
          <el-input
            v-model="ruleForm.areaName"
            placeholder="请输入区域名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="车位数(个)" prop="spaceNumber">
          <el-input
            v-model="ruleForm.spaceNumber"
            placeholder="请输入车位个数"
          ></el-input>
        </el-form-item>
        <el-form-item label="面积(㎡)" prop="areaProportion">
          <el-input v-model="ruleForm.areaProportion" placeholder="请输入面积">
            <template slot="append">㎡</template></el-input
          >
        </el-form-item>
        <el-form-item label="关联计费规则" prop="ruleId">
          <el-select
            style="width: 100%"
            v-model="ruleForm.ruleId"
            placeholder="请选择"
          >
            <el-option
              v-for="item in list"
              :label="item.ruleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input
            type="textarea"
            v-model="ruleForm.remark"
            placeholder="请输入备注"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleClose">取消</el-button>
        <el-button size="mini" type="primary" @click="addArea">确定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getAreaListApi,
  getListApi,
  addAreaApi,
  delAreaApi,
  editAreaApi,
} from "@/api/area";
export default {
  name: "CarArea",
  data() {
    return {
      query: {
        page: 1,
        pageSize: 10,
      },
      total: 0,
      areaList: [],
      dialogVisible: false,
      ruleForm: {
        areaName: "",
        spaceNumber: "",
        areaProportion: "",
        ruleId: "",
        remark: "",
      },
      rules: {
        areaName: [
          { required: true, message: "请输入区域名称", trigger: "blur" },
        ],
        spaceNumber: [
          { required: true, message: "请输入车位个数", trigger: "blur" },
        ],
        areaProportion: [
          { required: true, message: "请输入面积", trigger: "blur" },
        ],
        ruleId: [
          { required: true, message: "请选择关联计费规则", trigger: "blur" },
        ],
      },
      list: [],
    };
  },
  methods: {
    // 获取区域列表
    async getAreaList() {
      const res = await getAreaListApi(this.query);
      this.total = res.data.total;
      this.areaList = res.data.rows;
    },
    // 分页
    handleSizeChange(num) {
      this.query.pageSize = num;
      this.getAreaList();
    },
    handleCurrentChange(num) {
      this.query.page = num;
      this.getAreaList();
    },
    // 删除区域
    delArea(id) {
      this.$confirm("是否确认删除当前区域？", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await delAreaApi(id);
        this.getAreaList();
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      });
    },
    // 关闭添加/编辑区域
    handleClose() {
      this.ruleForm = {
        areaName: "",
        spaceNumber: "",
        areaProportion: "",
        ruleId: "",
        remark: "",
      };
      this.$refs.ruleForm.resetFields();
      this.dialogVisible = false;
    },
    // 获取关联区域下拉列表
    async getList() {
      const res = await getListApi();
      this.list = res.data.rows;
    },
    // 添加/编辑区域
    addArea() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          if (this.ruleForm.id) {
            await editAreaApi(this.ruleForm);
            this.$message.success("编辑成功");
          } else {
            await addAreaApi(this.ruleForm);
            this.$message.success("添加成功");
          }
          this.handleClose();
          this.getAreaList();
        }
      });
    },
    // 编辑(回显)
    editArea(row) {
      this.dialogVisible = true;
      this.ruleForm.id = row.id;
      this.ruleForm.areaName = row.areaName;
      this.ruleForm.spaceNumber = row.spaceNumber;
      this.ruleForm.areaProportion = row.areaProportion;
      this.ruleForm.ruleId = row.ruleId;
      this.ruleForm.remark = row.remark;
    },
  },
  created() {
    this.getAreaList();
    this.getList();
  },
};
</script>
<style lang="scss" scoped>
.page {
  text-align: right;
  margin-top: 20px;
}
</style>
