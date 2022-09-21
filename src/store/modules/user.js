import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter, anyRoutes, asyncRoutes, constantRoutes } from '@/router'
import router from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    routes: [],
    roles: [],
    buttons: [],
    // 对比之后（项目中已有的异步路由，与服务器返回的标记信息进行对比）
    resultAsyncRoutes: [],
    // 用户最终需要展示的全部路由
    resultAllRoutes: []
  }
}

const state = getDefaultState()

// 唯一修改 state 的地方
const mutations = {
  // 重置 state
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  // 存储 token
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  // 存储用户信息
  SET_USERINFO: (state, userInfo) => {
    // 用户名
    state.name = userInfo.name
    // 用户头像
    state.avatar = userInfo.avatar
    // 菜单权限标记
    state.routes = userInfo.routes
    // 按钮权限的标记
    state.buttons = userInfo.buttons
    // 角色
    state.roles = userInfo.roles
  },
  // 最终计算出的异步路由
  SET_RESULTSYNCROUTES: (state, asyncRoutes) => {
    // vuex 保存当前用户的异步路由
    state.resultAsyncRoutes = asyncRoutes
    // 计算出当前用户需要展示的所有路由信息
    state.resultAllRoutes = constantRoutes.concat(
      state.resultAsyncRoutes,
      anyRoutes
    )
    // 给路由添加新的路由
    router.addRoutes(state.resultAllRoutes)
  }
}

// 定义一个函数：两个数组进行对比——对不出当前用户显示哪些异步路由
const computedAsyncRoutes = (asyncRoutes, routes) => {
  return asyncRoutes.filter((item) => {
    // 如果数组没有当前元素返回 -1
    if (routes.indexOf(item.name) != -1) {
      if (item.children && item.children.length) {
        // 递归：遍历出 2 3 4 5级路由
        item.children = computedAsyncRoutes(item.children, routes)
      }
      return true
    }
  })
}

const actions = {
  // user login
  async login({ commit }, userInfo) {
    const { username, password } = userInfo
    let result = await login({
      username: username.trim(),
      password: password
    })
    if (result.code === 20000) {
      // vuex 存储 token
      commit('SET_TOKEN', result.data.token)
      // 在本地存储 token
      setToken(result.data.token)
      return 'ok'
    } else {
      return Promise.reject(new Error('faile'))
    }
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then((response) => {
          // 获取用户信息：返回的数据包含用户名name、用户头像avatar、routes
          // routes 为 不同用户应该展示哪些菜单的标记
          // roles 用户角色的信息
          // buttons 按钮的信息 按钮权限用的标记
          const { data } = response

          if (!data) {
            return reject('Verification failed, please Login again.')
          }

          // vuex 存储用户全部的信息
          commit('SET_USERINFO', data)
          commit(
            'SET_RESULTSYNCROUTES',
            computedAsyncRoutes(asyncRoutes, data.routes)
          )
          resolve(data)
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token)
        .then(() => {
          removeToken() // must remove  token  first
          resetRouter()
          commit('RESET_STATE')
          resolve()
        })
        .catch((error) => {
          reject(error)
        })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise((resolve) => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
