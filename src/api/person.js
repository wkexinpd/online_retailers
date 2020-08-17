import request from '@/utils/request'

export function getPersonList(data,page,limit) {
  return request({
    url: `/shop-impl-member/getAllUser?page=${page}&limit=${limit}`,
    method: 'post',
    data
  })
}

export function updatePerson(data){
  return request({
    url: `/shop-impl-member/update`,
    method: 'post',
    data
  })
}

export function deletePerson(id) {
  return request({
    url: `/shop-impl-member/delete`,
    method: 'get',
    params: {id}
  })
}
