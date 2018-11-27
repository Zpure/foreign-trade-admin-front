import axios from 'axios'
import {Message} from 'element-ui'
import {getToken} from '../js/auth'

// create an axios instance
const service = axios.create({
    baseURL: process.env.BASE_API, // api 的 base_url
    timeout: 5000,
    headers: {
        "Content-Type": "application/json;"
    },
    // withCredentials:true,
})

// request interceptor
service.interceptors.request.use(
    config => {
        // Do something before request is sent
        config.headers['X-Token'] = getToken();
        return config
    },
    error => {
        // Do something with request error
        console.log(error) // for debug
        Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    response => {
        console.log(response.data);
        const res = response.data;
        if (res.code !== 1000) {
            Message({
                message: res.desc,
                type: 'error',
                duration: 5 * 1000
            })
            // 未登录
            if (res.code == 1004) {
                // this.$router.push({ path: '/login' });
                // app.$routes.push({ path: '/login' });
                // $route.replace({
                //     path: 'login',
                //     query: {redirect: router.currentRoute.fullPath}
                // })
                let href = '/#/login';
                window.open(href, '_blank');
            }
            return Promise.reject('error')
        } else {
            return response.data
        }
    },
    error => {
        console.log('err' + error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

export default service
