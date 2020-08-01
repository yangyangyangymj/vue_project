<template>
  <div>
    <el-table :data="list" style="width: 100%;"
    >
      <el-table-column prop="title" label="活动名称" width="180"></el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-button type="primary" v-if="scope.row.status==1">启用</el-button>
          <el-button type="info" v-else>禁用</el-button>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="primary" @click="edit(scope.row.id)">编辑</el-button>
          <del-btn type="danger" @confirm="del(scope.row.id)">删除</del-btn>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { requestSeckillDelete } from "../../../util/request";
import { successAlert, warningAlert } from "../../../util/alert";
export default {
  components: {},
  computed: {
    ...mapGetters({
      list: "seckill/list",
    }),
  },
  data() {
    return {};
  },
  methods: {
    ...mapActions({
      requestList: "seckill/requestList",
    }),
    //编辑
    edit(id) {
      this.$emit("edit", id);
    },
    //删除
    del(id) {
      requestSeckillDelete({ id: id }).then((res) => {
        if (res.data.code == 200) {
          successAlert(res.data.msg);
          this.requestList();
        } else {
          warningAlert(res.data.msg);
        }
      });
    },
   
  },
  mounted() {
    this.requestList();
  },
};
</script>
<style scoped>
img {
  width: 80px;
  height: 80px;
}
</style>