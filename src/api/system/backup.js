import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/backup/getData',
    method: 'get',
    params: query
  })
}

export function deleteFile(fileName) {
  const data = {
      fileName
  }
  return request({
    url: '/backup/delete',
    method: 'post',
    data
  })
}