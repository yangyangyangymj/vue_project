<template>
  <div class="add">
    <el-dialog :title="info.title" :visible.sync="info.show">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="标题" prop="title" label-width="80px">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="图片" label-width="80px">
          <el-upload
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :on-change="changeImg"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="状态" label-width="80px">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer xiugai">
        <el-button class="xiugaibtn" type="primary" @click="add('form')" v-if="info.isAdd">添 加</el-button>
        <el-button class="xiugaibtn" type="primary" @click="update('form')" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { mapGetters, mapActions } from "vuex";
import { successAlert, warningAlert } from "../../../util/alert";
import {
  requestBannerAdd,
  requestBannerUpdate,
  requestBannerDetail,
} from "../../../util/request";
export default {
  props: ["info"],
  components: {},
  computed: {
    ...mapGetters({
      bannerList: "banner/list",
    }),
  },
  data() {
    return {
      //表单验证
      rules: {
        title: [
          { required: true, message: "请输入标题", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" },
        ],
      },
      //图片地址
      imageUrl: "",
      //提交给后端的数据
      form: {
        title: "",
        img: null,
        status: 1,
      },
    };
  },
  methods: {
    ...mapActions({
      // 获取分类列表
      requestList: "banner/requestList",
    }),

    // 图片发生了修改
    changeImg(e) {
      let file = e.raw;
      this.imageUrl = URL.createObjectURL(file);
      this.form.img = file;
    },

    //  添加
    add(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          requestBannerAdd(this.form).then((res) => {
            if (res.data.code == 200) {
              successAlert(res.data.msg);
              // 重置form
              this.empty();
              // 弹框消失
              this.cancel();
              this.requestBannerList();
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

    //置空
    empty() {
      //图片地址
      this.imageUrl = "";
      //提交给后端的数据
      this.form = {
        title: "",
        img: null,
        status: 1,
      };
    },
    // 取消
    cancel() {
      this.info.show = false;
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    //获取一条数据
    getDetail(id) {
      // console.log(id)
      //ajax
      requestBannerDetail({ id: id }).then((res) => {
        // console.log(res.data)
        this.form = res.data.list;
        this.form.id = id;
        this.imageUrl = this.$imgPre + this.form.img;
      });
    },
    //点击了修改
    update(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          requestBannerUpdate(this.form).then((res) => {
            if (res.data.code == 200) {
              successAlert("修改成功");
              this.empty();
              this.cancel();
              this.requestList();
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
};
</script>
<style scoped lang="stylus">
.add >>> .el-form-item__content {
  display: flex !important;
}

.add >>> .el-input {
  flex: 1;
}

.add >>> .el-button {
  width: auto;
}

// 穿透
.add >>> .el-upload {
  border: 1px dashed #d9d9d9 !important;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.add >>> .el-upload:hover {
  border: 1px dashed #409eff !important;
}

.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}

.avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.el-dialog__footer .xiugai {
  text-align: left;
}

.xiugaibtn {
  margin-left: 80px;
}
</style>