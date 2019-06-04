import { getToken, setToken, removeToken } from '@/utils/auth'
const user = {
  state: {
    token: getToken(),
    avatar: 'https://wpimg.wallstcn.com/3fce7247-d863-4e3d-a0de-d30aaef7358a'
  },
  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    }
  },
  actions: {
    // 用户名登录
    Login({ commit }, token) {
      return new Promise((resolve, reject) => {
        commit('SET_TOKEN', token)
        setToken(token)
        resolve()
      })
    },
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
        removeToken()
        resolve()
      })
    }
  }
}

export default user
