import axios from 'axios'

export default function(sql) {
  return new Promise((resolve, reject) => {
    axios.get(`https://service-7ttbmmzx-1252006172.ap-shanghai.apigateway.myqcloud.com/release/exeSQL12?sql=${sql}`).then(resp => {
      if (resp.status === 200) {
        resolve(resp.data.body)
      } else {
        reject(new Error('network error'))
      }
    })
  })
}
