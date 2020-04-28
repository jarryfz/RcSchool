import axios from 'axios'
import store from '@/store'
// import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  // baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})
const getToken = 'eyJhbGciOiJIUzI1NiJ9.eyJleHAiOjE1ODU3MDUwNDIsImlhdCI6MTU4NTYxODY0Miwic3RhZmZJZCI6MSwianRpIjoiMmIzNTg2MWEwYWE4NDVlOGEzMDI2NWE1YjU5ZTc0MWYuMTU4NTYxODY0Mjk2OCJ9.AcwUQLr4Ngz7vA_O07lWE50JxKClY0c0zy1sdEWVJBY';
service.defaults.baseURL = "http://www.zrfc.com";
// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['token'] = getToken
    }
    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code !== 200) {
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        // to re-login
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    return Promise.reject(error)
  }
)

export default service