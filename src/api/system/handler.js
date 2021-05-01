import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/handler/getData',
    method: 'get',
    params: query
  })
}

export function getHandlerInfo(className) {
  return request({
    url: '/handler/getHandlerInfo',
    method: 'get',
    params: { className }
  })
}

export function getSupportCmd(className) {
  return request({
    url: '/handler/getSupportCmd',
    method: 'get',
    params: { className }
  })
}


export function handCmd(data) {
  return request({
    url: '/handler/handCmd',
    method: 'post',
    data
  })
}

export function check(data) {
  return request({
    url: '/handler/check',
    method: 'post',
    data
  })
}

export function reload(data) {
  return request({
    url: '/handler/reload',
    method: 'post',
    data
  })
}
