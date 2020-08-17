import request from '@/utils/request'

export function getGoodsDataList(data, page, limit) {
  return request({
    url: `/shop-impl-goods/showGoods?page=${page}&limit=${limit}`,
    method: 'post',
    data
  })
}

export function getTree() {
  return request({
    url: `/shop-impl-goods/getTree`,
    method: 'get'
  })
}

export function addCategory(data) {
  return request({
    url: `/shop-impl-goods/addCategory`,
    method: 'post',
    data
  })
}

export function addGood(data) {
  return request({
    url: `/shop-impl-goods/addGood`,
    method: 'post',
    data
  })
}

export function addSpec(data) {
  return request({
    url: `/shop-impl-goods/addSpec`,
    method: 'post',
    data
  })
}

export function updateGoods(data) {
  return request({
    url: '/shop-impl-goods/updateGood',
    method: 'post',
    data
  })
}

export function deleteGood(good_id) {
  return request({
    url: `/shop-impl-goods/deleteGood?good_id=${good_id}`,
    method: 'delete'
  })
}

export function deleteSpec(id) {
  return request({
    url: `/shop-impl-goods/deleteSpec?id=${id}`,
    method: 'delete'
  })
}

export function updateSpec(data) {
  return request({
    url: `/shop-impl-goods/updateSpec`,
    method: 'post',
    data
  })
}
