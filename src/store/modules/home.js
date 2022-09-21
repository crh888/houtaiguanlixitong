import mockRequest from '@/utils/mockRequest.js'
const state = {
  list: {}
}
const mutations = {
  GETDATA (state, list) {
    state.list = list
  }
}
const actions = {
  // 发请求获取首页的 mock 数据
  async getData ({ commit }) {
    let res = await mockRequest.get('/home/list')
    if (res.code === 20000) {
      commit('GETDATA', res.data)
    }
  }
}
const getters = {}
export default {
  state,
  mutations,
  actions,
  getters
}
