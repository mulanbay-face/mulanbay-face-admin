import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/dictItem/getData',
    method: 'get',
    params: query
  })
}

export function getDictItem(id) {
  return request({
    url: '/dictItem/get',
    method: 'get',
    params: { id }
  })
}

export function createDictItem(data) {
  return request({
    url: '/dictItem/create',
    method: 'post',
    data
  })
}

export function updateDictItem(data) {
  return request({
    url: '/dictItem/edit',
    method: 'post',
    data
  })
}
export function deleteDictItem(ids) {
  const data = {
      ids
  }
  return request({
    url: '/dictItem/delete',
    method: 'post',
    data
  })
}
