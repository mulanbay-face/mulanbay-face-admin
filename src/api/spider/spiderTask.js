import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/spiderApi/spiderTask/getData',
    method: 'get',
    params: query
  })
}

export function getSpiderTask(id) {
  return request({
    url: '/spiderApi/spiderTask/get',
    method: 'get',
    params: { id }
  })
}

export function createSpiderTask(data) {
  return request({
    url: '/spiderApi/spiderTask/create',
    method: 'post',
    data
  })
}

export function updateSpiderTask(data) {
  return request({
    url: '/spiderApi/spiderTask/edit',
    method: 'post',
    data
  })
}

export function deleteSpiderTask(ids) {
  const data = {
      ids
  }
  return request({
    url: '/spiderApi/spiderTask/delete',
    method: 'post',
    data
  })
}