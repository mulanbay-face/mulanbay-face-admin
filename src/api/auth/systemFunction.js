import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/systemFunction/getList',
    method: 'get',
    params: query
  })
}

export function getSystemFunction(id) {
  return request({
    url: '/systemFunction/get',
    method: 'get',
    params: { id }
  })
}

export function getSystemFunctionMenuTree() {
  return request({
    url: '/systemFunction/getSystemFunctionMenuTree',
    method: 'get'
  })
}

export function getSystemFunctionTree(needRoot) {
  return request({
    url: '/systemFunction/getSystemFunctionTree',
    method: 'get',
    params: { needRoot }
  })
}

export function getDomainClassNamesTree() {
  return request({
    url: '/systemFunction/getDomainClassNamesTree',
    method: 'get'
  })
}

export function createSystemFunction(data) {
  return request({
    url: '/systemFunction/create',
    method: 'post',
    data
  })
}

export function updateSystemFunction(data) {
  return request({
    url: '/systemFunction/edit',
    method: 'post',
    data
  })
}

export function deleteSystemFunction(ids) {
  const data = {
      ids
  }
  return request({
    url: '/systemFunction/delete',
    method: 'post',
    data
  })
}

export function refreshSystemConfig() {
  return request({
    url: '/systemFunction/refreshSystemConfig',
    method: 'post'
  })
}