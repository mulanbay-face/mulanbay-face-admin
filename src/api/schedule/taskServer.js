import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/taskServer/getData',
    method: 'get',
    params: query
  })
}


export function getTaskServerTree(needRoot) {
  return request({
    url: '/taskServer/getTaskServerTree',
    method: 'get',
    params: {
      needRoot:needRoot
    }
  })
}
