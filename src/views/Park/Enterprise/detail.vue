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
          <span>查看企业</span>
        </div>
        <div>{{ name }}</div>
      </el-header>
      <el-main>
        <div class="box1">
          <div class="title">企业信息</div>
          <table>
            <tr>
              <td class="name">企业名称：</td>
              <td>{{ info.name }}</td>
              <td class="name">法人：</td>
              <td>{{ info.legalPerson }}</td>
            </tr>
            <tr>
              <td class="name">注册地址：</td>
              <td>{{ info.registeredAddress }}</td>
              <td class="name">所在行业：</td>
              <td>{{ info.industryName }}</td>
            </tr>
            <tr>
              <td class="name">营业执照：</td>
              <td>
                <img
                  :src="info.businessLicenseUrl"
                  alt=""
                  style="width: 250px"
                />
              </td>
            </tr>
          </table>
        </div>
        <div class="box1">
          <div class="title">联系人信息</div>
          <table style="margin-bottom: 40px">
            <tr>
              <td class="name">企业联系人：</td>
              <td>{{ info.contact }}</td>
              <td class="name">联系电话：</td>
              <td>{{ info.contactNumber }}</td>
            </tr>
          </table>
        </div>
        <div class="box1">
          <div class="title">租赁记录</div>
          <el-table :data="list" border style="width: 88%; margin: 20px auto">
            <el-table-column
              type="index"
              label="序号"
              width="50"
            ></el-table-column>
            <el-table-column
              prop="name"
              label="租赁楼宇"
              width="90"
            ></el-table-column>
            <el-table-column prop="status" label="合同状态" width="80">
              <template v-slot="{ row }">
                <el-tag v-if="row.status == 0">待生效</el-tag>
                <el-tag v-else-if="row.status == 1" type="success"
                  >生效中</el-tag
                >
                <el-tag v-else-if="row.status == 2" type="danger"
                  >已到期</el-tag
                >
                <el-tag v-else-if="row.status == 3" type="info">已退租</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="租赁起止时间" width="180">
              <template v-slot="{ row }">
                {{ row.startTime + "至" + row.endTime }}
              </template>
            </el-table-column>
            <el-table-column prop="contractName" label="租赁合同" width="220">
              <template v-slot="{ row }">
                <el-button type="text" @click="open(row.contractUrl)">{{
                  row.contractName
                }}</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="录入时间"
              width="160"
            ></el-table-column>
            <el-table-column label="操作" width="80">
              <template v-slot="{ row }">
                <el-button type="text" @click="download(row)"
                  >合同下载</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { detailEnterpriseApi, downloadApi } from "@/api/enterprise";
import FileSaver from "file-saver";
import _ from "lodash";
export default {
  name: "Detail",
  data() {
    return {
      info: {},
      list: [],
    };
  },
  methods: {
    async detailEnterprise() {
      const res = await detailEnterpriseApi(this.$route.params.id);
      this.info = res.data;
      this.list = res.data.rent;
    },
    open(contractUrl) {
      window.open(contractUrl);
    },
    async download(row) {
      const res = await downloadApi(row.contractId);
      FileSaver.saveAs(res, row.contractName);
    },
  },
  computed: {
    ...mapGetters(["name"]),
  },
  created() {
    this.detailEnterprise();
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
  height: calc(100vh - 60px);
  background-color: #f4f6f8;
}
.box1,
.box2,
.box3 {
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
table {
  width: 80%;
  margin: auto;
  tr {
    height: 40px;
  }
  .name {
    width: 86px;
    color: #909399;
    text-align: right;
  }
}
</style>
