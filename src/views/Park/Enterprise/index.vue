<template>
  <div>
    <!-- 搜索 -->
    <el-form
      size="mini"
      :inline="true"
      :model="formInline"
      class="demo-form-inline"
    >
      <el-form-item label="企业名称:">
        <el-input
          v-model="formInline.name"
          placeholder="请输入企业名称"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="search">查询</el-button>
      </el-form-item>
    </el-form>
    <!-- 添加企业 -->
    <el-button
      type="primary"
      size="mini"
      style="margin: 10px 0"
      @click="goAdd"
      v-auth-btn="'park:enterprise:add_edit'"
      >添加企业</el-button
    >
    <!-- 表格 -->
    <el-table
      @expand-change="handleExpandChange"
      :data="enterpriseList"
      style="width: 100%; margin-bottom: 10px"
    >
      <el-table-column type="expand">
        <template v-slot="{ row }">
          <el-table :data="row.children" style="width: 100%">
            <el-table-column
              prop="buildingName"
              label="租赁楼宇"
            ></el-table-column>
            <el-table-column label="租赁起止时间">
              <template v-slot="{ row }">
                {{ row.startTime }}至{{ row.endTime }}
              </template>
            </el-table-column>
            <el-table-column prop="status" label="合同状态">
              <template v-slot="{ row }">
                <el-tag v-if="row.status == 0">待生效</el-tag>
                <el-tag v-else-if="row.status == 1" type="success"
                  >生效中</el-tag
                >
                <el-tag v-else-if="row.status == 2" type="danger"
                  >已到期</el-tag
                >
                <el-tag v-else-if="row.status == 3" type="info" color="#fff"
                  >已退租</el-tag
                >
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template v-slot="{ row }">
                <el-button
                  type="text"
                  :disabled="row.renewFlag == 0"
                  @click="openRelet(row)"
                  v-auth-btn="'park:rent:add_surrender'"
                  >续租</el-button
                >
                <el-button
                  type="text"
                  :disabled="row.exitFlag === 0"
                  @click="quitRent(row.id)"
                  v-auth-btn="'park:rent:add_surrender'"
                  >退租</el-button
                >
                <el-button
                  type="text"
                  :disabled="row.status !== 3"
                  @click="delRent(row.id)"
                  v-auth-btn="'park:rent:add_surrender'"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column type="index" label="序号"></el-table-column>
      <el-table-column label="企业名称" prop="name"></el-table-column>
      <el-table-column label="联系人" prop="contact"></el-table-column>
      <el-table-column label="联系电话" prop="contactNumber"></el-table-column>
      <el-table-column label="操作" prop="existContractFlag">
        <template v-slot="{ row }">
          <el-button
            type="text"
            @click="openAdd(row.id)"
            v-auth-btn="'park:rent:add_surrender'"
            >添加合同</el-button
          >
          <el-button
            type="text"
            @click="goDetail(row.id)"
            v-auth-btn="'park:enterprise:query'"
            >查看</el-button
          >
          <el-button
            type="text"
            @click="goEdit(row.id)"
            v-auth-btn="'park:enterprise:add_edit'"
            >编辑</el-button
          >
          <el-button
            type="text"
            :disabled="row.existContractFlag == 1"
            @click="delEnterprise(row.id)"
            v-auth-btn="'park:enterprise:remove'"
            >删除</el-button
          >
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
    <!-- 添加合同 -->
    <el-dialog
      :title="ruleForm.type == 0 ? '添加合同' : '续租合同'"
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
        <el-form-item label="租赁楼宇" prop="buildingId">
          <el-select
            v-if="ruleForm.type == 0"
            style="width: 100%"
            v-model="ruleForm.buildingId"
            placeholder="请选择租赁楼宇"
            :disabled="ruleForm.type == 1"
          >
            <el-option
              v-for="(item, index) in rentBuilding"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
          <el-input v-else disabled v-model="building"></el-input>
        </el-form-item>
        <el-form-item label="租赁起止时间" prop="date">
          <el-date-picker
            v-model="date"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="租赁合同">
          <el-upload
            action="https://jsonplaceholder.typicode.com/posts/"
            :http-request="handleUpload"
            :on-preview="onPreview"
            multiple
            :limit="3"
            :file-list="fileList"
          >
            <el-button
              :disabled="uploadButtonStatus"
              size="small"
              :type="uploadButtonStatus ? 'success' : 'primary'"
              >{{ uploadButtonStatus ? "已上传" : "上传文件" }}</el-button
            >

            <div slot="tip" class="el-upload__tip">
              支持扩展名：.doc .docx .pdf, 文件大小不得超过5M
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="handleClose">取 消</el-button>
        <el-button size="mini" type="primary" @click="addContract"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  getEnterpriseListApi,
  delEnterpriseApi,
  getRentListApi,
  uploadFilesApi,
  addContractApi,
  quitRentApi,
  delRentApi,
} from "@/api/enterprise";
import { getRentBuildingApi } from "@/api/building";
export default {
  name: "Enterprise",
  data() {
    return {
      formInline: {
        name: "",
        page: 1,
        pageSize: 10,
      },
      total: 0,
      enterpriseList: [],
      dialogVisible: false,
      ruleForm: {
        buildingId: "",
        startTime: "",
        endTime: "",
        contractUrl: "",
        contractId: "",
        type: "",
        enterpriseId: "",
      },
      rules: {
        buildingId: [
          { required: true, message: "请选择租赁楼宇", trigger: "blur" },
        ],
      },
      rentBuilding: [],
      date: [],
      fileList: [],
      building: "",
    };
  },
  methods: {
    // 获取企业列表数据
    async getEnterpriseList() {
      const { data } = await getEnterpriseListApi(this.formInline);
      this.enterpriseList = data.rows.map((item) => {
        return {
          ...item,
          children: [],
        };
      });
      this.total = data.total;
    },
    // 分页
    handleSizeChange(num) {
      this.formInline.pageSize = num;
      this.getEnterpriseList();
    },
    handleCurrentChange(num) {
      this.formInline.page = num;
      this.getEnterpriseList();
    },
    // 搜索
    search() {
      this.getEnterpriseList();
    },
    // 跳转到添加企业
    goAdd() {
      this.$router.push({
        path: "/park/enterprise/add",
        query: {
          mode: "add",
        },
      });
    },
    // 删除企业
    delEnterprise(id) {
      this.$confirm("是否确认删除当前企业?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await delEnterpriseApi(id);
        this.getEnterpriseList();
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      });
    },
    // 跳转到查看企业
    goDetail(id) {
      this.$router.push("/park/enterprise/detail/" + id);
    },
    // 跳转到编辑企业
    goEdit(id) {
      this.$router.push({
        path: "/park/enterprise/add",
        query: {
          mode: "edit",
          id: id,
        },
      });
    },
    // 查询可租赁楼宇
    async getRentBuilding() {
      const { data } = await getRentBuildingApi();
      this.rentBuilding = data;
    },
    // 获取展开行数据
    async handleExpandChange(row) {
      const { data } = await getRentListApi(row.id);
      row.children = data;
      this.ruleForm.enterpriseId = row.id;
    },
    // 打开添加合同
    async openAdd(id) {
      this.ruleForm.type = 0;
      this.ruleForm.enterpriseId = id;
      this.getRentBuilding();
      this.dialogVisible = true;
    },
    // 关闭添加合同
    handleClose() {
      this.$refs.ruleForm.resetFields();
      this.ruleForm = {
        buildingId: "",
        startTime: "",
        endTime: "",
        contractUrl: "",
        contractId: "",
        type: "",
        enterpriseId: "",
      };
      this.date = [];
      this.dialogVisible = false;
    },
    // 文件预览
    onPreview(params) {
      window.open(this.ruleForm.contractUrl);
    },
    // 上传文件
    async handleUpload(params) {
      // 1. 获取到上传的文件
      const file = params.file;
      // 2. 判断上传文件的大小
      if (file.size > 5 * 1024 * 1024) {
        this.$message.error("文件大小不能超过5M");
        return false;
      }
      // 3. 将文件转化为form data (重点)
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "contract");
      // 4. 调用接口实现上传
      const res = await uploadFilesApi(formData);
      this.ruleForm.contractUrl = res.data.url;
      this.ruleForm.contractId = res.data.id;
    },
    // 添加/续租合同
    addContract() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          await addContractApi(this.ruleForm);
          this.handleClose();
          this.getEnterpriseList();
          this.$message.success("操作成功");
        }
      });
    },
    // 退租租赁合同
    quitRent(id) {
      this.$confirm("退租不可撤回，是否确认退租当前楼宇?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await quitRentApi(id);
        this.getEnterpriseList();
        this.$message.success("操作成功");
      });
    },
    // 删除租赁合同
    delRent(id) {
      this.$confirm("是否确认删除当前合同?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(async () => {
        await delRentApi(id);
        this.getEnterpriseList();
        this.$message.success("操作成功");
      });
    },
    // 打开租赁合同
    openRelet(row) {
      this.building = row.buildingName;
      this.ruleForm.buildingId = row.buildingId;
      this.ruleForm.type = 1;
      this.date = [row.startTime, row.endTime];
      this.dialogVisible = true;
    },
  },
  watch: {
    date(value) {
      this.ruleForm.startTime = value[0];
      this.ruleForm.endTime = value[1];
    },
  },
  created() {
    this.getEnterpriseList();
  },
  computed: {
    // true 表示上传成功  false 表示未成功
    uploadButtonStatus() {
      return !!this.ruleForm.contractId || false;
    },
  },
};
</script>
<style lang="scss" scoped>
.page {
  text-align: right;
  margin-top: 20px;
}
</style>
