import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/user/getData',
    method: 'get',
    params: query
  })
}

export function getUser(id) {
  return request({
    url: '/user/get',
    method: 'get',
    params: { id }
  })
}

export function getUserWxpayInfo(userId) {
  return request({
    url: '/user/getUserWxpayInfo',
    method: 'get',
    params: { userId }
  })
}

export function editUserWxpayInfo(data) {
  return request({
    url: '/user/editUserWxpayInfo',
    method: 'post',
    data
  })
}

export function offlineUser(userId) {
  return request({
    url: '/user/offline',
    method: 'post',
    data: { userId }
  })
}

export function deleteUserData(userId) {
  return request({
    url: '/user/deleteUserData',
    method: 'post',
    data: { userId }
  })
}

export function initUserData(userId) {
  return request({
    url: '/user/initUserData',
    method: 'post',
    data: { userId }
  })
}


export function getUserRoleTree(userId,separate,needRoot) {
  return request({
    url: '/user/getUserRoleTree',
    method: 'get',
    params: {
      userId:userId,
      separate:separate,
      needRoot:needRoot
    }
  })
}

export function getSystemMonitorTree(userId,separate,needRoot) {
  return request({
    url: '/user/getSystemMonitorTree',
    method: 'get',
    params: {
      userId:userId,
      separate:separate,
      needRoot:needRoot
    }
  })
}

export function saveSystemMonitor(data) {
  return request({
    url: '/user/saveSystemMonitor',
    method: 'post',
    data
  })
}

export function createUser(data) {
  return request({
    url: '/user/create',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/user/edit',
    method: 'post',
    data
  })
}
export function deleteUser(ids) {
  const data = {
      ids
  }
  return request({
    url: '/user/delete',
    method: 'post',
    data
  })
}

export function getUserResidentCity() {
  return request({
    url: '/user/getResidentCity',
    method: 'get'
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/user/uploadAvatar',
    method: 'post',
    data: data
  })
}

// 获取用户详细信息
export function getProfile() {
  return request({
    url: '/user/getProfile',
    method: 'get'
  })
}

export function editProfile(data) {
  return request({
    url: '/user/editProfile',
    method: 'post',
    data: data
  })
}

export function editPassword(data) {
  return request({
    url: '/user/editPassword',
    method: 'post',
    data: data
  })
}
