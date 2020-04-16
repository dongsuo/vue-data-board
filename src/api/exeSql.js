import fetch from '@/utils/fetch'
import axios from 'axios'

export default function() {
  const source = axios.CancelToken.source()
  return {
    cancel() {
      source.cancel('cancel')
    },
    fetch(data) {
      return fetch({
        url: `/exesql`,
        cancelToken: source.token,
        method: 'POST',
        data
      })
    }
  }
}
