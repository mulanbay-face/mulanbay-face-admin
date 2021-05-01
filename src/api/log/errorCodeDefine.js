import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/errorCodeDefine/getData',
    method: 'get',
    params: query
  })
}

export function getErrorCodeDefine(code) {
  return request({
    url: '/errorCodeDefine/get',
    method: 'get',
    params: { code }
  })
}


export function createErrorCodeDefine(data) {
  return request({
    url: '/errorCodeDefine/create',
    method: 'post',
    data
  })
}

export function updateErrorCodeDefine(data) {
  return request({
    url: '/errorCodeDefine/edit',
    method: 'post',
    data
  })
}
export function deleteErrorCodeDefine(ids) {
  const data = {
      ids
  }
  return request({
    url: '/errorCodeDefine/delete',
    method: 'post',
    data
  })
}

export function reloadCacheConfig() {
  return request({
    url: '/errorCodeDefine/reloadCacheConfig',
    method: 'post'
  })
}
