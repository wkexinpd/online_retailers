import request from '@/utils/request'

export function userGetOrder(page,limit,u_id,status,isAdmin,data) {
  return request({
    url: `/shop-impl-order/GetOrder?page=${page}&limit=${limit}&u_id=${u_id}&status=${status}&isAdmin=${isAdmin}`,
    method: 'post',
    data
  })
}

export function updateOrderMessage(data) {
  return request({
    url: `/shop-impl-order/updateOrderMessage`,
    method: 'post',
    data
  })
}

export function updateOrderAddress(data) {
  return request({
    url: `/shop-impl-order/updateOrderAddress`,
    method: 'post',
    data
  })
}

export function deleteOrder(id) {
  return request({
    url: `/shop-impl-order/delete?id=${id}`,
    method: 'delete'
  })
}
