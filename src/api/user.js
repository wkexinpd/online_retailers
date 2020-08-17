import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/shop-impl-member/web/login',
    method: 'post',
    data
  })
}

// export function getInfo() {
//   return request({
//     url: '/shop-impl-member/web/index',
//     method: 'get'
//   })
// }

export function getInfo(token) {
  return request({
    url: '/shop-impl-member/web/index',
    method: 'get',
    params: {token}
  })
}

export function sendSms(phone) {
  return request({
    url: '/shop-impl-member/web/sendSms',
    method: 'post',
    params: {phone}
  })
}

export function logout(token) {
  return request({
    url: '/shop-impl-member/web/logout',
    method: 'post',
    params: {token}
  })
}

export function registerSendSms(phone) {
  return request({
    url: '/shop-impl-member/web/register/sendSms',
    method: 'post',
    params: {phone}
  })
}

export function register(data) {
  return request({
    url: '/shop-impl-member/Register',
    method: 'post',
    data
  })
}
