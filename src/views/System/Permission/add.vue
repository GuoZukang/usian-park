<template>
  <div>
    <el-container>
      <el-header>
        <div style="margin-top: 15px">
          <el-page-header
            @back="$router.go(-1)"
            content="添加角色"
          ></el-page-header>
        </div>
        <div>{{ name }}</div>
      </el-header>
      <el-main>
        <el-row>
          <el-col :span="6">
            <div style="height: 100px">
              <el-steps direction="vertical" :active="active">
                <el-step title="角色信息"></el-step>
                <el-step title="权限信息"></el-step>
                <el-step title="检查并完成"></el-step>
              </el-steps>
            </div>
          </el-col>
          <el-col :span="18">
            <div class="roleInfo">
              <div class="title">角色信息</div>
              <div>
                <el-form
                  :model="ruleForm"
                  :rules="rules"
                  ref="ruleForm"
                  label-width="100px"
                  class="demo-ruleForm"
                >
                  <el-form-item label="活动名称" prop="name">
                    <el-input v-model="ruleForm.name"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-main>
      <el-footer>
        <el-button v-if="active != 1" size="mini">上一步</el-button>
        <el-button v-if="active != 3" size="mini" type="primary"
          >下一步</el-button
        >
        <el-button v-if="active == 3" size="mini" type="primary"
          >确认添加</el-button
        >
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Add",
  data() {
    return {
      active: 1,
      ruleForm: {},
      rules: {},
    };
  },
  computed: {
    ...mapGetters(["name"]),
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
  background-color: rgb(244, 246, 248);
}
.el-footer {
  text-align: center;
  line-height: 60px;
}
::v-deep .el-page-header__content {
  font-size: 14px;
}
.roleInfo {
  width: 600px;
  background-color: #fff;
  padding: 15px 0;
  font-size: 14px;
  .title {
    width: 80px;
    text-align: center;
    border-left: 2px solid #4770ff;
  }
}
::v-deep .el-step__title {
  font-size: 12px;
}
::v-deep .el-step__icon.is-text {
  width: 10px;
  height: 10px;
  border: 1.5px solid ;
}
::v-deep .el-step__icon-inner {
  display: none;
}
::v-deep .el-step.is-vertical .el-step__line {
  width: 1px;
  top: 14px;
  bottom: -5px;
  left: 4px;
}
::v-deep .el-step__line {
  background-color: #f0f0f0;
}
</style>
