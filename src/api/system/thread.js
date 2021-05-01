import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/thread/getData',
    method: 'get',
    params: query
  })
}

export function getThreadInfo(id) {
  return request({
    url: '/thread/getThreadInfo',
    method: 'get',
    params: { id }
  })
}
