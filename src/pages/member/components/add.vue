<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.show">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="手机号" prop="phone" label-width="80px">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname" label-width="80px">
          <el-input v-model="form.nickname"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="80px">
          <el-tooltip content="留空则不修改" placement="bottom" effect="light">
            <el-input v-model="form.password" show-password></el-input>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="状态" label-width="80px">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer xiugai">
        <el-button type="primary" @click="update('form')" class="xiugaibtn">修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  requestMemberDetail,
  requestMemberUpdate,
} from "../../../util/request";
import { successAlert, warningAlert } from "../../../util/alert";
import { mapGetters, mapActions } from "vuex";

export default {
  props: ["info"],

  components: {},
  computed: {
    ...mapGetters({
      memberList: "member/list",
    }),
  },
  data() {
    return {
      //表单验证
      rules: {
        phone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { min: 11, max: 11, message: "长度在 11 个字符", trigger: "blur" },
        ],
        nickname: [
          { required: true, message: "请输入昵称", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" },
        ],
      },
      //  提交给后端的数据
      form: {
        uid: "",
        nickname: "",
        password: "",
        password: "",
        status: 1,
      },
    };
  },
  methods: {
    ...mapActions({
      //   requestRoleList: "role/requestList",
      requestMemberList: "member/requestList",
    }),
    // 重置内容
    empty() {
      this.form = {
        uid: "",
        nickname: "",
        password: "",
        password: "",
        status: 1,
      };
    },
    cancel() {
      this.info.show = false;
      if (!this.info.isAdd) {
        this.empty();
      }
    },

    //获取某一条数据
    getDetail(id) {
      console.log(id);
      requestMemberDetail({ uid: id }).then((res) => {
        this.form = res.data.list;
        this.form.password = "";
      });
    },
    //修改
    update(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          requestMemberUpdate(this.form).then((res) => {
            if (res.data.code == 200) {
              successAlert("修改成功");
              this.empty();
              this.cancel();
              this.requestMemberList();
            } else {
              warningAlert(res.data.msg);
            }
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
  mounted() {
    // 如果之前的menu的list没有请求，就发请求，请求过了，就不发
    // if (this.roleList.length === 0) {
    //   this.requestRoleList();
    // }
  },
};
</script>
<style>
.el-dialog__footer .xiugai {
  text-align: left;
}
.xiugaibtn {
  margin-left: 80px;
}
</style>
