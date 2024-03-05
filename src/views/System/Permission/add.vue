<template>
  <div>
    <el-container>
      <el-header>
        <div style="margin-top: 15px">
          <el-page-header
            @back="$router.go(-1)"
            :content="$route.query.id ? '编辑角色' : '添加角色'"
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
            <!-- 第一步 -->
            <div class="roleInfo" v-show="active == 1">
              <div class="title">角色信息</div>
              <div style="width: 450px; margin: 20px auto">
                <el-form
                  size="mini"
                  :model="ruleForm"
                  :rules="rules"
                  ref="ruleForm"
                  label-width="100px"
                  class="demo-ruleForm"
                >
                  <el-form-item label="角色名称" prop="roleName">
                    <el-input
                      v-model="ruleForm.roleName"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="角色描述" prop="remark">
                    <el-input
                      type="textarea"
                      v-model="ruleForm.remark"
                      placeholder="请输入"
                    ></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <!-- 第二步 -->
            <div v-show="active == 2" class="permissions">
              <div class="title">权限配置</div>
              <div class="module">
                <div class="module-item" v-for="item in allTree" :key="item.id">
                  <div class="menu-title">{{ item.title }}</div>
                  <el-tree
                    :data="item.children"
                    show-checkbox
                    :props="{ label: 'title' }"
                    default-expand-all
                    :expand-on-click-node="false"
                    node-key="id"
                    ref="tree"
                  >
                  </el-tree>
                </div>
              </div>
            </div>
            <!-- 第三步 -->
            <div v-show="active == 3" class="permissions">
              <div class="title">检查并完成</div>
              <div class="form">
                <div class="form-name">
                  <span style="color: #909399">角色名称：</span
                  >{{ ruleForm.roleName }}
                </div>
                <div class="form-name">
                  <span style="color: #909399">角色描述：</span
                  >{{ ruleForm.remark }}
                </div>
                <div class="form-name">
                  <span style="color: #909399">角色权限：</span>
                </div>
              </div>
              <div class="module">
                <div
                  class="module-item"
                  v-for="item in disabledTreeList"
                  :key="item.id"
                >
                  <div class="menu-title">{{ item.title }}</div>
                  <el-tree
                    :data="item.children"
                    show-checkbox
                    :props="{ label: 'title' }"
                    default-expand-all
                    :expand-on-click-node="false"
                    node-key="id"
                    ref="diabledTree"
                    :default-checked-keys="diabledTree"
                  >
                  </el-tree>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-main>
      <el-footer>
        <el-button v-if="active != 1" size="mini" @click="lastStep"
          >上一步</el-button
        >
        <el-button
          v-if="active != 3"
          size="mini"
          type="primary"
          @click="nextStep"
          >下一步</el-button
        >
        <el-button
          v-if="active == 3"
          size="mini"
          type="primary"
          @click="addRole"
          >确认添加</el-button
        >
      </el-footer>
    </el-container>
  </div>
</template>

<script>
import {
  getAllTreeApi,
  addRoleApi,
  getRoleDetailApi,
  editRoleApi,
} from "@/api/permission";
import { mapGetters } from "vuex";
import { addDisabled } from "@/utils";
export default {
  name: "Add",
  data() {
    return {
      active: 1,
      ruleForm: {
        roleName: "",
        remark: "",
        perms: [],
      },
      rules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
        ],
      },
      allTree: [],
      diabledTree: [],
      disabledTreeList: [],
    };
  },
  methods: {
    // 查询所有功能权限(树形)
    async getAllTree() {
      const { data } = await getAllTreeApi();
      this.allTree = data;
      this.disabledTreeList = JSON.parse(JSON.stringify(data));
    },
    // 上一步
    lastStep() {
      this.active--;
    },
    // 下一步
    nextStep() {
      if (this.active == 1) {
        this.$refs.ruleForm.validate((valid) => {
          if (valid) {
            this.active++;
          }
        });
      } else if (this.active == 2) {
        this.ruleForm.perms = [];
        this.$refs.tree.forEach((tree) => {
          this.ruleForm.perms.push(tree.getCheckedKeys());
        });
        // 如果长度为零 没有选中任何东西
        if (this.ruleForm.perms.flat().length === 0) {
          this.$message({
            type: "error",
            message: "请至少选择一个权限点",
          });
        } else {
          // 进入到下一页
          this.active++;
          this.diabledTree = this.ruleForm.perms.flat();
          addDisabled(this.disabledTreeList);
        }
      }
    },
    async addRole() {
      try {
        if (this.$route.query.id) {
          await editRoleApi(this.ruleForm);
        } else {
          await addRoleApi(this.ruleForm);
        }
        this.$router.push("/system/permission");
        this.$message.success("操作成功");
      } catch (error) {
        console.log(error);
      }
    },
    async getRoleDetail() {
      const { data } = await getRoleDetailApi(this.$route.query.id);
      const { perms, remark, roleId, roleName } = data;
      this.ruleForm = { perms, remark, roleId, roleName };
      this.$refs.tree.forEach((tree, index) => {
        tree.setCheckedKeys(this.ruleForm.perms[index]);
      });
    },
  },
  created() {
    this.getAllTree();
  },
  mounted() {
    if (this.$route.query.id) {
      this.getRoleDetail();
    }
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
  width: 650px;
  background-color: #fff;
  padding: 15px 0;
  font-size: 14px;
}
::v-deep .el-step__title {
  font-size: 12px;
}
::v-deep .el-step__icon.is-text {
  width: 10px;
  height: 10px;
  border: 1.5px solid;
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
.title {
  width: 80px;
  text-align: center;
  border-left: 2px solid #4770ff;
}
.permissions {
  width: 650px;
  font-size: 14px;
  padding: 15px 0;
  background-color: #fff;
  .module {
    width: 80%;
    display: flex;
    flex-wrap: wrap;
    margin: auto;
    .module-item {
      width: 33%;
      text-align: center;
      border-right: 1px solid #e4e7ec;
      border-bottom: 1px solid #e4e7ec;
      .menu-title {
        width: 90%;
        height: 30px;
        background-color: #f5f7fa;
        margin: auto;
        margin-top: 30px;
        margin-bottom: 10px;
        font-size: 12px;
        text-align: center;
        line-height: 30px;
      }
    }
  }
}
.left {
  position: fixed;
  top: 0;
  left: 0;
}
.form {
  margin-left: 60px;
}
.form-name {
  margin-top: 15px;
}
</style>
