import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/operationLog/getData',
    method: 'get',
    params: query
  })
}

export function getOperationLog(id) {
  return request({
    url: '/operationLog/get',
    method: 'get',
    params: { id }
  })
}

export function getBeanDetail(id) {
  return request({
    url: '/operationLog/getBeanDetail',
    method: 'get',
    params: { id }
  })
}

export function setOperationLogFunctionId(needReSet) {
  return request({
    url: '/operationLog/setFunctionId',
    method: 'get',
    params: { needReSet }
  })
}

export function setOperationLogIdValue() {
  return request({
    url: '/operationLog/setIdValue',
    method: 'get'
  })
}

export function getOperationLogTreeStat(query) {
  return request({
    url: '/operationLog/treeStat',
    method: 'get',
    params: query
  })
}

export function getOperationLogStat(query) {
  return request({
    url: '/operationLog/stat',
    method: 'get',
    params: query
  })
}

export function getOperationLogDateStat(query) {
  return request({
    url: '/operationLog/dateStat',
    method: 'get',
    params: query
  })
}

export function getCompareData(query) {
  return request({
    url: '/operationLog/getCompareData',
    method: 'get',
    params: query
  })
}

export function getNearstCompareData(query) {
  return request({
    url: '/operationLog/getNearstCompareData',
    method: 'get',
    params: query
  })
}

export function getEditLogData(query) {
  return request({
    url: '/operationLog/getEditLogData',
    method: 'get',
    params: query
  })
}
