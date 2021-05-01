import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/scoreConfig/getData',
    method: 'get',
    params: query
  })
}

export function getScoreConfig(id) {
  return request({
    url: '/scoreConfig/get',
    method: 'get',
    params: { id }
  })
}

export function createScoreConfig(data) {
  return request({
    url: '/scoreConfig/create',
    method: 'post',
    data
  })
}

export function updateScoreConfig(data) {
  return request({
    url: '/scoreConfig/edit',
    method: 'post',
    data
  })
}
export function deleteScoreConfig(ids) {
  const data = {
      ids
  }
  return request({
    url: '/scoreConfig/delete',
    method: 'post',
    data
  })
}
