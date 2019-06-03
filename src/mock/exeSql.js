import fetch from '@/utils/fetch'

export default function(sql) {
  return fetch({
    url: `/exesql?sql=${sql}`
  })
}
