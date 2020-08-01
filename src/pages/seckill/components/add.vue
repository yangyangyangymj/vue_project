<template>
  <div class="add">
    <el-dialog :title="info.title" :visible.sync="info.show">
      <el-form :model="form" :rules="rules" ref="form">
        <el-form-item label="活动名称" prop="title" label-width="80px">
          <el-input v-model="form.title" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="活动期限" label-width="80px">
          <el-date-picker
            v-model="value1"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changetime"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="一级分类" label-width="80px">
          <el-select v-model="form.first_cateid" @change="changeFirstCateId()">
            <el-option label="请选择" value disabled></el-option>
            <!-- 动态数据 -->
            <el-option
              v-for="item in cateList"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="二级分类" label-width="80px">
          <el-select v-model="form.second_cateid" @change="changeSecondGoodsId()">
            <el-option label="请选择" value disabled></el-option>
            <!-- 动态数据 -->
            <el-option
              v-for="item in secondCateArr"
              :key="item.id"
              :label="item.catename"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品" label-width="80px">
          <el-select v-model="form.goodsid">
            <el-option label="请选择" value disabled></el-option>
            <!-- 动态数据 -->
            <el-option
              v-for="item in attrsArr"
              :key="item.id"
              :label="item.goodsname"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="状态" label-width="80px">
          <el-switch v-model="form.status" :active-value="1" :inactive-value="2"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="add('form')" v-if="info.isAdd">添 加</el-button>
        <el-button type="primary" @click="update('form')" v-else>修 改</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  requestSeckillAdd,
  requestSeckillDetail,
  requestSeckillUpdate,
  requestGoodsList,
} from "../../../util/request";
import { successAlert, warningAlert } from "../../../util/alert";
import { mapGetters, mapActions } from "vuex";
export default {
  props: ["info"],
  components: {},
  computed: {
    ...mapGetters({
      // 分类的一级列表
      cateList: "cate/list",
      list: "seckill/list",
      goodsList: "goods/list",
    }),
  },
  data() {
    return {
      //表单验证
      rules: {
        title: [
          { required: true, message: "请输入活动名称", trigger: "blur" },
          { min: 2, max: 5, message: "长度在 2 到 5 个字符", trigger: "blur" },
        ],
      },
      //二级分类的数组
      secondCateArr: [],
      //商品
      attrsArr: [],
      value1: [],
      form: {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      },
    };
  },
  methods: {
    ...mapActions({
      // 获取分类列表
      requestCateList: "cate/requestList",
      // 获取商品列表
      requestGoodsList: "goods/requestList",
      // 获取秒杀列表
      requestList: "seckill/requestList",
    }),
    // 时间改变
    changetime(e) {
      this.form.begintime = Date.parse(e[0]);
      this.form.endtime = Date.parse(e[1]);
    },
    // 修改了一级分类
    changeFirstCateId(bool) {
      let index = this.cateList.findIndex(
        (item) => item.id == this.form.first_cateid
      );
      this.secondCateArr = this.cateList[index].children;
      // 传了true,second_cateid就不置空;没传就置空
      if (!bool) {
        this.form.second_cateid = "";
      }
    },
    // 商品
    changeSecondGoodsId(bool) {
      requestGoodsList({
        fid: this.form.first_cateid,
        sid: this.form.second_cateid,
      }).then((res) => {
        this.attrsArr = res.data.list;
      });
      if (!bool) {
        this.form.goodsid = "";
      }
    },

    //重置内容
    empty() {
      //二级分类的数组
      this.secondCateArr = [];
      //商品规格属性值
      this.attrsArr = [];
      this.form = {
        title: "",
        begintime: "",
        endtime: "",
        first_cateid: "",
        second_cateid: "",
        goodsid: "",
        status: 1,
      };
    },
    //取消
    cancel() {
      this.info.show = false;
      if (!this.info.isAdd) {
        this.empty();
      }
    },
    //点击了添加按钮
    add(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          requestSeckillAdd(this.form).then((res) => {
            if (res.data.code == 200) {
              successAlert(res.data.msg);
              //重置form数据
              this.empty();
              //弹框消失
              this.cancel();
              //再次请求list数据
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
    //获取某一条数据
    getDetail(id) {
      requestSeckillDetail({ id: id }).then((res) => {
        this.form = res.data.list;
        this.form.id = id;
        //根据一级分类计算出二级分类的数组
        this.changeFirstCateId(true);
        this.value1 = [
          new Date(parseInt(res.data.list.begintime)),
          new Date(parseInt(res.data.list.endtime)),
        ];
      });
    },
    //修改
    update(form) {
      this.$refs[form].validate((valid) => {
        if (valid) {
          requestSeckillUpdate(this.form).then((res) => {
            if (res.data.code == 200) {
              successAlert(res.data.msg);
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
  mounted() {
    if (this.cateList.length == 0) {
      this.requestCateList();
    }
  },
};
</script>
<style scoped lang="stylus">
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

.box-img {
  width: 100px;
  height: 100px;
  border: 1px dashed #ccc;
  position: relative;

  h3 {
    width: 100%;
    height: 100%;
    text-align: center;
    line-height: 100px;
  }

  img {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
  }

  input {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
  }
}
</style>