<template>
<div>
    <el-button type="primary" @click="add">添加</el-button>
    <!-- 添加弹框 -->
    <v-add :info="info" ref="add"></v-add>
    <!-- 列表 -->
    <v-list @click="edit($event)"></v-list>
</div>
</template>
<script>
import vAdd from "./components/add";
import vList from "./components/list";
export default {
components:{
    vAdd,
    vList
},
data(){
return{
    info: {
        show: false,
        title: "添加商品",
        isAdd: true,
      },
};
},
methods:{
    // 点击了添加按钮
    add(){
        this.info.show=true;
        this.info.title="添加商品",
        this.info.isAdd=true;
    
    },
    // 编辑
    edit(id){
        this.info.show=true;
        this.info.title="编辑商品",
        this.$refs.add.getDetail(id);
    }
},
mounted(){}
};
</script>
<style>
</style>