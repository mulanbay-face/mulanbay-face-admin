import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/taskTrigger/getData',
    method: 'get',
    params: query
  })
}

export function getTaskTrigger(id) {
  return request({
    url: '/taskTrigger/get',
    method: 'get',
    params: { id }
  })
}

export function getScheduleDetail(id) {
  return request({
    url: '/taskTrigger/getScheduleDetail',
    method: 'get',
    params: { id }
  })
}

export function createTaskTrigger(data) {
  return request({
    url: '/taskTrigger/create',
    method: 'post',
    data
  })
}

export function updateTaskTrigger(data) {
  return request({
    url: '/taskTrigger/edit',
    method: 'post',
    data
  })
}

export function deleteTaskTrigger(ids) {
  const data = {
      ids
  }
  return request({
    url: '/taskTrigger/delete',
    method: 'post',
    data
  })
}

export function resetTaskTriggerTotalCount(id) {
  const data = {
      id
  }
  return request({
    url: '/taskTrigger/resetTotalCount',
    method: 'post',
    data
  })
}

export function resetTaskTriggerFailCount(id) {
  const data = {
      id
  }
  return request({
    url: '/taskTrigger/resetFailCount',
    method: 'post',
    data
  })
}

export function getTaskTriggerTree(needRoot) {
  return request({
    url: '/taskTrigger/getTaskTriggerTree',
    method: 'get',
    params: {
      needRoot:needRoot
    }
  })
}

export function getTaskTriggerCategoryTree(groupField,needRoot) {
  return request({
    url: '/taskTrigger/getTaskTriggerCategoryTree',
    method: 'get',
    params: {
      groupField:groupField,
      needRoot:needRoot
    }
  })
}

export function getParaDefine(className) {
  return request({
    url: '/taskTrigger/getParaDefine',
    method: 'get',
    params: {
      className:className
    }
  })
}

export function getScheduleInfo() {
  return request({
    url: '/taskTrigger/getScheduleInfo',
    method: 'get'
  })
}

export function manualNew(data) {
  return request({
    url: '/taskTrigger/manualNew',
    method: 'post',
    data
  })
}

export function refreshSchedule(data) {
  return request({
    url: '/taskTrigger/refreshSchedule',
    method: 'post',
    data
  })
}
