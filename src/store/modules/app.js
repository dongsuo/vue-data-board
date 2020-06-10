import i18n from '@/i18n'

const app = {
  namespaced: true,
  state: {
    lang: undefined
  },
  mutations: {
    SET_LANG: (state, lang) => {
      state.lang = lang
      i18n.locale = lang
    }
  }
}

export default app
