import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/dictGroup/getData',
    method: 'get',
    params: query
  })
}

export function getDictGroup(id) {
  return request({
    url: '/dictGroup/get',
    method: 'get',
    params: { id }
  })
}

export function createDictGroup(data) {
  return request({
    url: '/dictGroup/create',
    method: 'post',
    data
  })
}

export function updateDictGroup(data) {
  return request({
    url: '/dictGroup/edit',
    method: 'post',
    data
  })
}
export function deleteDictGroup(ids) {
  const data = {
      ids
  }
  return request({
    url: '/dictGroup/delete',
    method: 'post',
    data
  })
}


export function getDictGroupTree(idField,needRoot) {
  return request({
    url: '/dictGroup/getDictGroupTree',
    method: 'get',
    params: {
      idField:idField,
      needRoot:needRoot
    }
  })
}
