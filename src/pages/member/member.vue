<template>
<div>
    <!-- 弹框 -->
    <v-add :info="info" ref="add"></v-add>
    <!-- 列表 -->
    <v-list @edit="edit($event)"></v-list>
</div>
</template>
<script>
import vAdd from "./components/add"
import vList from "./components/list"
export default {
components:{
    vAdd,
    vList
},
data(){
return{
    info:{
        show:false,
        title:"编辑会员",
        isAdd:true
    },
};
},
methods:{
    
    // 点击了编辑
    edit(id){
        this.info.show=true;
         this.info.title="编辑会员";
         this.info.isAdd=false;
        this.$refs.add.getDetail(id);
    }
},
mounted(){}
};
</script>
<style>
</style>