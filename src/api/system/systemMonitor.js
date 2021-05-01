import request from '@/utils/request'

export function getSystemDetail() {
  return request({
    url: '/system/getSystemDetail',
    method: 'get'
  })
}

export function stat(resourceType) {
  return request({
    url: '/system/stat',
    method: 'get',
    params: { resourceType }
  })
}
