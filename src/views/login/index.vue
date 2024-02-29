<template>
  <div>
    <el-row>
      <el-col :span="16"><div class="left"></div></el-col>
      <el-col :span="8">
        <div class="right">
          <div style="margin-bottom: 30px; font-size: 20px">智慧园区-登录</div>
          <div style="width: 300px">
            <el-form
              size="mini"
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-width="100px"
              label-position="top"
            >
              <el-form-item label="账号" prop="username">
                <el-input v-model="ruleForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input
                  type="password"
                  show-password
                  v-model="ruleForm.password"
                ></el-input>
              </el-form-item>
              <el-form-item prop="isAgree">
                <el-checkbox v-model="ruleForm.isAgree">记住我</el-checkbox>
              </el-form-item>
              <el-form-item>
                <el-button
                  style="width: 100%"
                  type="primary"
                  @click="submitForm('ruleForm')"
                  >登录</el-button
                >
              </el-form-item>
            </el-form>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      ruleForm: {
        username: "demo",
        password: "zh@hm#23",
        isAgree: true,
      },
      rules: {
        username: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        isAgree: [
          {
            validator: (rule, value, callback) => {
              value ? callback() : callback(new Error("请勾选"));
            },
          },
        ],
      },
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(async (valid) => {
        if (valid) {
          await this.$store.dispatch("user/login", this.ruleForm);
          this.$router.push("/");
        }
      });
    },
  },
};
</script>
<style lang="scss" scoped>
.left {
  width: 100%;
  height: 100vh;
  background: url("https://fe-hmzs.itheima.net/assets/login-bg-e4ea539c.svg");
  background-color: aqua;
  border-radius: 0 50px 0 0;
}
.right {
  width: 80%;
  height: 100vh;
  display: flex;
  justify-content: center;
  justify-items: center;
  flex-direction: column;
  margin-left: 70px;
}
</style>
