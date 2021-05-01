import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/systemConfig/getData',
    method: 'get',
    params: query
  })
}

export function getSystemConfig(id) {
  return request({
    url: '/systemConfig/get',
    method: 'get',
    params: { id }
  })
}

export function createSystemConfig(data) {
  return request({
    url: '/systemConfig/create',
    method: 'post',
    data
  })
}

export function updateSystemConfig(data) {
  return request({
    url: '/systemConfig/edit',
    method: 'post',
    data
  })
}

export function deleteSystemConfig(ids) {
  const data = {
      ids
  }
  return request({
    url: '/systemConfig/delete',
    method: 'post',
    data
  })
}

export function refreshCache() {
  return request({
    url: '/systemConfig/refreshCache',
    method: 'post'
  })
}