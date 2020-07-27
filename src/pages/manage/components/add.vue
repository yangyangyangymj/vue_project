<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.show">
      <el-form :model="form">
        <el-form-item label="所属角色" label-width="80px">
          <el-select v-model="form.roleid">
            <el-option label="--请选择--" value disabled></el-option>
            <!-- 动态数据 -->
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.rolename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="用户名" label-width="80px">
          <el-input v-model="form.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" label-width="80px">
          <el-input v-model="form.password" show-password></el-input>
        </el-form-item>
        <el-form-item label="状态" label-width="80px">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.isAdd">添 加</el-button>
        <el-button type="primary" @click="update" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  requestManageAdd,
  requestManageDetail,
  requestManageUpdate,
} from "../../../util/request";
import { successAlert, warningAlert } from "../../../util/alert";
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["info"],

  components: {},
  computed: {
    ...mapGetters({
      roleList: "role/list",
    }),
  },
  data() {
    return {
      //  提交给后端的数据
      form: {
        roleid:"",
        username: "",
        password: "",
        status: 1,
      },
    };
  },
  methods: {
    ...mapActions({
      requestRoleList: "role/requestList",
      requestManageList: "manage/requestList",
      requestTotal:"manage/requestTotal"
    }),
    // 重置内容
    empty() {
      this.form = {
        rolename: "",
        password:"",
        status: 1,
      };
    },
    cancel() {
      this.info.show = false;
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    //点击了添加按钮
    add() {
      // 发起添加角色的请求
      requestManageAdd(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          //重置form数据
          this.empty();
          //弹框消失
          this.cancel();
          //再次请求角色list数据
          this.requestManageList();
          // 重新获取总数量
          this.requestTotal()
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //获取某一条数据
    getDetail(id) {
      requestManageDetail({ uid: id }).then((res) => {
        this.form = res.data.list;
        this.form.password=""
      });
    },
    //修改
    update() {
      requestManageUpdate(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert("修改成功");
          this.empty();
          this.cancel();
          this.requestManageList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
  },
  mounted() {
    // 如果之前的menu的list没有请求，就发请求，请求过了，就不发
    if (this.roleList.length === 0) {
      this.requestRoleList();
    }
  },
};
</script>
<style>
</style>
