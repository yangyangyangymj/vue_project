import {requestBannerList} from "../../util/request"

const state = {
    //列表数据
    list: [],
    
}
const mutations = {
    //修改list
    changeList(state, arr) {
        state.list = arr;
    },
    
}
const actions = {
    //获取列表数据
   
    requestList(context) {
        requestBannerList().then(res => {
            context.commit("changeList", res.data.list)
        })
    },
}
const getters = {
    list(state) {
        return state.list
    },
}
export default {
    state,
    mutations,
    actions,
    getters,
    namespaced: true
}