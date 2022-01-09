import Vue from 'vue'
import VueI18n from 'vue-i18n'
import EN from '@/lang/en'
import CN from '@/lang/cn'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

Vue.use(VueI18n)

const i18n = new VueI18n({
  locale: 'EN', // set locale
  messages: {
    EN: { ...EN, ...enLocale },
    CN: { ...CN, ...zhLocale }
  }
})
export default i18n
