<template>
  <div>
    <!-- 搜索 -->
    <el-form
      size="mini"
      :inline="true"
      :model="formInline"
      class="demo-form-inline"
    >
      <el-form-item label="楼宇名称:">
        <el-input
          v-model="formInline.name"
          placeholder="请输入楼宇名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 添加楼宇 -->
    <el-button
      type="primary"
      size="mini"
      style="margin: 10px 0"
      @click="dialogVisible = true"
      v-auth-btn="'park:building:add_edit'"
      >添加楼宇</el-button
    >
    <!-- 表格 -->
    <el-table
      v-auth-btn="'park:building:list'"
      :data="buildingList"
      style="width: 100%; margin-bottom: 10px"
    >
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column prop="name" label="楼宇名称"></el-table-column>
      <el-table-column prop="floors" label="层数"></el-table-column>
      <el-table-column prop="area" label="在管面积(㎡)"></el-table-column>
      <el-table-column
        prop="propertyFeePrice"
        label="物业费(元/㎡)"
      ></el-table-column>
      <el-table-column prop="status" label="状态">
        <template v-slot="{ row }">
          {{ row.status == 0 ? "空置中" : "租赁中" }}
        </template>
      </el-table-column>
      <el-table-column prop="demoFlag" label="操作">
        <template v-slot="{ row }">
          <el-button
            type="text"
            @click="editBuilding(row.id)"
            v-auth-btn="'park:building:add_edit'"
            >编辑</el-button
          >
          <el-button
            type="text"
            v-if="row.status == 0"
            @click="delBuilding(row.id)"
            v-auth-btn="'park:building:remove'"
            >删除</el-button
          >
          <el-button type="text" v-else disabled>删除</el-button>
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
    <!-- 模态框 -->
    <el-dialog
      :title="ruleForm.id ? '编辑楼宇' : '添加楼宇'"
      :visible.sync="dialogVisible"
      width="45%"
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
        <el-form-item label="楼宇名称" prop="name">
          <el-input
            v-model="ruleForm.name"
            placeholder="请输入楼宇名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="楼宇层数" prop="floors">
          <el-input
            v-model="ruleForm.floors"
            placeholder="请输入楼宇层数"
          ></el-input>
        </el-form-item>
        <el-form-item label="在管面积" prop="area">
          <el-input v-model="ruleForm.area" placeholder="请输入在管面积">
            <template slot="append">㎡</template>
          </el-input>
        </el-form-item>
        <el-form-item label="物业费" prop="propertyFeePrice">
          <el-input
            v-model="ruleForm.propertyFeePrice"
            placeholder="请输入物业费"
          >
            <template slot="append">元/㎡</template>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleClose">取 消</el-button>
        <el-button size="mini" type="primary" @click="addBuilding"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getBuildingListApi,
  addBuildingApi,
  delBuildingApi,
  editBuildingApi,
  confirmBuildingApi,
} from "@/api/building";
export default {
  name: "Building",
  data() {
    return {
      formInline: {
        name: "",
        page: 1,
        pageSize: 10,
      },
      buildingList: [],
      total: 0,
      dialogVisible: false,
      ruleForm: {
        name: "",
        floors: "",
        area: "",
        propertyFeePrice: "",
      },
      rules: {
        name: [{ required: true, message: "请输入楼宇名称", trigger: "blur" }],
        floors: [
          { required: true, message: "请输入楼宇层数", trigger: "blur" },
        ],
        area: [{ required: true, message: "请输入在管面积", trigger: "blur" }],
        propertyFeePrice: [
          { required: true, message: "请输入物业费", trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    // 获取楼宇管理数据
    async getBuildingList() {
      const { data } = await getBuildingListApi(this.formInline);
      this.buildingList = data.rows;
      this.total = data.total;
    },
    // 分页
    handleSizeChange(num) {
      this.formInline.pageSize = num;
      this.getBuildingList();
    },
    handleCurrentChange(num) {
      this.formInline.page = num;
      this.getBuildingList();
    },
    // 搜索
    search() {
      this.getBuildingList();
    },
    // 关闭模态框
    handleClose() {
      this.ruleForm = {
        name: "",
        floors: "",
        area: "",
        propertyFeePrice: "",
      };
      this.$refs.ruleForm.resetFields();
      this.dialogVisible = false;
    },
    // 添加/编辑楼宇
    addBuilding() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          if (this.ruleForm.id) {
            await confirmBuildingApi(this.ruleForm);
            this.$message.success("编辑成功");
          } else {
            await addBuildingApi(this.ruleForm);
            this.$message.success("添加成功");
          }
          this.getBuildingList();
          this.handleClose();
          this.dialogVisible = false;
        }
      });
    },
    // 删除楼宇
    delBuilding(id) {
      this.$confirm("是否确认删除当前楼宇?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await delBuildingApi(id);
        this.getBuildingList();
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      });
    },
    // 编辑楼宇(回显)
    async editBuilding(id) {
      const res = await editBuildingApi(id);
      this.ruleForm.id = res.data.id;
      this.ruleForm.name = res.data.name;
      this.ruleForm.floors = res.data.floors;
      this.ruleForm.area = res.data.area;
      this.ruleForm.propertyFeePrice = res.data.propertyFeePrice;
      this.dialogVisible = true;
    },
  },
  created() {
    this.getBuildingList();
  },
};
</script>
<style lang="scss" scoped>
.search {
  display: flex;
  width: 300px;
}
.page {
  text-align: right;
  margin-top: 20px;
}
</style>
