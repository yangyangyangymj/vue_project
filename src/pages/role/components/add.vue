<template>
  <div>
    <el-dialog :title="info.title" :visible.sync="info.show">
      <el-form :model="form">
        <el-form-item label="角色名称" label-width="80px">
          <el-input v-model="form.rolename" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="角色权限" label-width="80px">
          <el-tree
            :data="menuList"
            show-checkbox
            node-key="id"
            :default-checked-keys="defaultKey"
            :props="defaultProps"
            ref="tree"
          ></el-tree>
        </el-form-item>
        <el-form-item label="状态" label-width="80px">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="add" v-if="info.isAdd">添 加</el-button>
        <el-button type="primary" @click="update" v-else>添 加</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  requestRoleAdd,
  requestRoleDetail,
  requestRoleUpdate,
} from "../../../util/request";
import { successAlert, warningAlert } from "../../../util/alert";
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["info"],

  components: {},
  computed: {
    ...mapGetters({
      menuList: "menu/list",
    }),
  },
  data() {
    return {
      //  提交给后端的数据
      form: {
        rolename: "",
        menus: "",
        status: 1,
      },
      defaultKey: [],
      //   树形结构的数据
      defaultProps: {
        children: "children",
        label: "title",
      },
    };
  },
  methods: {
    ...mapActions({
      requestMenuList: "menu/requestList",
      requestRoleList: "role/requestList",
    }),
    // 重置内容
    empty() {
      this.form = {
        rolename: "",
        menus: "",
        status: 1,
      };
      this.$refs.tree.setCheckedKeys([]);
    },
    cancel() {
      this.info.show = false;
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    //点击了添加按钮
    add() {
      // 获取tree的key赋值给form.menus
      this.form.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
      // 发起添加角色的请求
      requestRoleAdd(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.list);
          //重置form数据
          this.empty();
          //弹框消失
          this.cancel();
          //再次请求list数据
          this.requestRoleList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
    //获取某一条数据
    getDetail(id) {
      requestRoleDetail({ id: id }).then((res) => {
        this.form = res.data.list;
        this.form.id = id;
        this.defaultKey = JSON.parse(res.data.list.menus);
      });
    },
    //修改
    update() {
      // 获取tree 的key赋值给form.menus
      this.form.menus = JSON.stringify(this.$refs.tree.getCheckedKeys());
      requestRoleUpdate(this.form).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.empty();
          this.cancel();
          this.requestRoleList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
  },
  mounted() {
    // 如果之前的menu的list没有请求，就发请求，请求过了，就不发
    if (this.menuList.length === 0) {
      this.requestMenuList();
    }
  },
};
</script>
<style>
</style>
