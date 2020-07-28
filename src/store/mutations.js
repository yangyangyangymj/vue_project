export const state={
    user:null
}
export const mutations={
    changeUser(state,user){
        state.user=user;
    }
}
export const getters={
    user(state){
        return state.user;
    }
}