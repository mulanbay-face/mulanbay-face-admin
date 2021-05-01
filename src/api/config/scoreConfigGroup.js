import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/scoreConfigGroup/getData',
    method: 'get',
    params: query
  })
}

export function getScoreConfigGroup(id) {
  return request({
    url: '/scoreConfigGroup/get',
    method: 'get',
    params: { id }
  })
}

export function createScoreConfigGroup(data) {
  return request({
    url: '/scoreConfigGroup/create',
    method: 'post',
    data
  })
}

export function createByTemplate(data) {
  return request({
    url: '/scoreConfigGroup/createByTemplate',
    method: 'post',
    data
  })
}

export function updateScoreConfigGroup(data) {
  return request({
    url: '/scoreConfigGroup/edit',
    method: 'post',
    data
  })
}
export function deleteScoreConfigGroup(ids) {
  const data = {
      ids
  }
  return request({
    url: '/scoreConfigGroup/delete',
    method: 'post',
    data
  })
}


export function getScoreConfigGroupTree(idField,needRoot) {
  return request({
    url: '/scoreConfigGroup/getScoreConfigGroupTree',
    method: 'get',
    params: {
      idField:idField,
      needRoot:needRoot
    }
  })
}
