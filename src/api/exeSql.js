import fetch from '@/utils/fetch'
import axios from 'axios'

export default function() {
  const source = axios.CancelToken.source()
  return {
    cancel() {
      source.cancel('cancel')
    },
    fetch(sql) {
      return fetch({
        url: `/exesql?sql=${sql}`,
        cancelToken: source.token
      })
    }
  }
}
