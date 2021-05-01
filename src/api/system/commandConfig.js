import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/commandConfig/getData',
    method: 'get',
    params: query
  })
}

export function getCommandConfig(id) {
  return request({
    url: '/commandConfig/get',
    method: 'get',
    params: { id }
  })
}

export function createCommandConfig(data) {
  return request({
    url: '/commandConfig/create',
    method: 'post',
    data
  })
}

export function updateCommandConfig(data) {
  return request({
    url: '/commandConfig/edit',
    method: 'post',
    data
  })
}

export function deleteCommandConfig(ids) {
  const data = {
      ids
  }
  return request({
    url: '/commandConfig/delete',
    method: 'post',
    data
  })
}

export function sendCmd(data) {
  return request({
    url: '/commandConfig/sendCmd',
    method: 'post',
    data
  })
}

