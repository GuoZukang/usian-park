<template>
  <div>
    <el-container>
      <el-header>
        <div>
          <span style="cursor: pointer" @click="$router.go(-1)">
            <i class="el-icon-back" style="font-size: 20px"></i>&nbsp;
            <span>返回</span>
          </span>
          <span style="color: #eee">&emsp;|&emsp;</span>
          <span>{{
            this.$route.query.mode == "add" ? "添加企业" : "编辑企业"
          }}</span>
        </div>
        <div>{{ name }}</div>
      </el-header>
      <el-main>
        <div class="box1">
          <div class="title">企业信息</div>
          <el-form
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            size="mini"
            :inline="true"
            class="demo-form-inline"
          >
            <el-form-item label="企业名称:" prop="name">
              <el-input
                class="ipt"
                v-model="ruleForm.name"
                placeholder="请输入企业名称"
              ></el-input>
            </el-form-item>
            <el-form-item label="法人:" prop="legalPerson">
              <el-input
                class="ipt"
                v-model="ruleForm.legalPerson"
                placeholder="请输入法人"
              ></el-input>
            </el-form-item>
            <el-form-item label="注册地址:" prop="registeredAddress">
              <el-input
                class="ipt"
                v-model="ruleForm.registeredAddress"
                placeholder="请输入注册地址"
              ></el-input>
            </el-form-item>
            <el-form-item label="所在行业:" prop="industryCode">
              <el-select
                class="ipt"
                v-model="ruleForm.industryCode"
                placeholder="请选择所在行业"
              >
                <el-option
                  v-for="item in industry"
                  :label="item.industryName"
                  :value="item.industryCode"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="营业执照:" prop="businessLicenseUrl">
              <el-upload
                action="https://jsonplaceholder.typicode.com/posts/"
                :http-request="uploadFiles"
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
        </div>
        <div class="box2">
          <div class="title">联系人信息</div>
          <el-form
            :inline="true"
            class="demo-form-inline"
            :model="ruleForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            size="mini"
          >
            <el-form-item label="企业联系人:" prop="contact">
              <el-input
                class="ipt"
                v-model="ruleForm.contact"
                placeholder="请输入企业联系人"
              ></el-input>
            </el-form-item>
            <el-form-item label="联系电话:" prop="contactNumber">
              <el-input
                class="ipt"
                v-model="ruleForm.contactNumber"
                placeholder="请输入联系电话"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
      </el-main>
      <el-footer>
        <el-button size="mini" @click="resetForm">重置</el-button>
        <el-button type="primary" size="mini" @click="addEnterprise"
          >确定</el-button
        >
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import {
  getIndustryApi,
  uploadFilesApi,
  addEnterpriseApi,
  detailEnterpriseApi,
  editEnterpriseApi,
} from "@/api/enterprise";
import { mapGetters } from "vuex";
export default {
  name: "Add",
  data() {
    return {
      ruleForm: {
        name: "",
        legalPerson: "",
        registeredAddress: "",
        industryCode: "",
        businessLicenseUrl: "",
        businessLicenseId: "",
        contact: "",
        contactNumber: "",
      },
      rules: {
        name: [{ required: true, message: "请输入企业名称", trigger: "blur" }],
        legalPerson: [
          { required: true, message: "请输入法人", trigger: "blur" },
        ],
        registeredAddress: [
          { required: true, message: "请输入注册地址", trigger: "blur" },
        ],
        industryCode: [
          { required: true, message: "请选择所在行业", trigger: "blur" },
        ],
        businessLicenseUrl: [
          { required: true, message: "请上传营业执照", trigger: "blur" },
        ],
        contact: [
          { required: true, message: "请输入企业联系人", trigger: "blur" },
        ],
        contactNumber: [
          { required: true, message: "请输入联系电话", trigger: "blur" },
        ],
      },
      industry: [],
      fileList: [],
    };
  },
  methods: {
    // 查询企业所属行业列表
    async getIndustry() {
      const { data } = await getIndustryApi();
      this.industry = data;
    },
    // 上传文件
    async uploadFiles(params) {
      const file = params.file;
      if (file.size > 5 * 1024 * 1024) {
        this.$message.error("文件大小不能超过5M");
        return false;
      }
      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", "businessLicense");
      const res = await uploadFilesApi(formData);
      this.ruleForm.businessLicenseId = res.data.id;
      this.ruleForm.businessLicenseUrl = res.data.url;
    },
    // 添加/编辑企业
    addEnterprise() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          if (this.$route.query.mode == "edit") {
            delete this.ruleForm.businessLicenseName;
            delete this.ruleForm.industryName;
            delete this.ruleForm.rent;
            await editEnterpriseApi(this.ruleForm);
          } else {
            await addEnterpriseApi(this.ruleForm);
          }
          this.$router.go(-1);
          this.$message.success("操作成功");
        }
      });
    },
    onPreview(params) {
      window.open(this.ruleForm.businessLicenseUrl);
    },
    // 重置
    resetForm() {
      this.$refs.ruleForm.resetFields();
    },
    // 编辑(回显)
    async detailEnterprise() {
      const { data } = await detailEnterpriseApi(this.$route.query.id);
      this.ruleForm = data;
    },
  },
  created() {
    this.getIndustry();
    if (this.$route.query.mode == "edit") {
      this.detailEnterprise();
    }
  },
  computed: {
    ...mapGetters(["name"]),
    // true 表示上传成功  false 表示未成功
    uploadButtonStatus() {
      return !!this.ruleForm.businessLicenseId || false;
    },
  },
};
</script>
<style lang="scss" scoped>
.el-header {
  display: flex;
  justify-content: space-between;
  line-height: 60px;
}
.el-main {
  height: calc(100vh - 120px);
  background-color: #f4f6f8;
}
.el-footer {
  text-align: center;
  line-height: 60px;
}
.box1,
.box2 {
  width: 80%;
  margin: auto;
  margin-bottom: 20px;
  overflow: hidden;
  background-color: #fff;
  font-size: 14px;
  .title {
    width: 80px;
    text-align: center;
    border-left: 2px solid #4770ff;
    margin-top: 20px;
  }
}
.demo-form-inline {
  width: 80%;
  margin: auto;
  margin-top: 10px;
  .ipt {
    width: 280px;
  }
}
</style>
