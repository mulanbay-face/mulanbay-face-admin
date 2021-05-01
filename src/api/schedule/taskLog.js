import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/taskLog/getData',
    method: 'get',
    params: query
  })
}

export function getTaskLog(id) {
  return request({
    url: '/taskLog/get',
    method: 'get',
    params: { id }
  })
}

export function getLastTaskLog(taskTriggerId) {
  return request({
    url: '/taskLog/getLastTaskLog',
    method: 'get',
    params: { taskTriggerId }
  })
}

export function redo(id) {
  return request({
    url: '/taskLog/redo',
    method: 'get',
    params: { id }
  })
}

export function getTaskLogCostTimeStat(query) {
  return request({
    url: '/taskLog/costTimeStat',
    method: 'get',
    params: query
  })
}

