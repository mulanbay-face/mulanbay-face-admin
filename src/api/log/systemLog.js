import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/systemLog/getData',
    method: 'get',
    params: query
  })
}

export function getSystemLog(id) {
  return request({
    url: '/systemLog/get',
    method: 'get',
    params: { id }
  })
}


export function getBeanDetail(id) {
  return request({
    url: '/systemLog/getBeanDetail',
    method: 'get',
    params: { id }
  })
}

export function getSystemLogAnalyseStat(query) {
  return request({
    url: '/systemLog/analyseStat',
    method: 'get',
    params: query
  })
}