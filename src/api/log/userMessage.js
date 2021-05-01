import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/userMessage/getData',
    method: 'get',
    params: query
  })
}

export function getUserMessage(id) {
  return request({
    url: '/userMessage/get',
    method: 'get',
    params: { id }
  })
}

export function getLatestMessage() {
  return request({
    url: '/userMessage/getLatestMessage',
    method: 'get'
  })
}

export function getUserMessageByUser(id) {
  return request({
    url: '/userMessage/getByUser',
    method: 'get',
    params: { id }
  })
}

export function createUserMessage(data) {
  return request({
    url: '/userMessage/create',
    method: 'post',
    data
  })
}

export function sendUserMessage(data) {
  return request({
    url: '/userMessage/send',
    method: 'post',
    data
  })
}

export function editUserMessage(data) {
  return request({
    url: '/userMessage/edit',
    method: 'post',
    data
  })
}

export function deleteUserMessage(ids) {
  const data = {
      ids
  }
  return request({
    url: '/userMessage/delete',
    method: 'post',
    data
  })
}

export function resendUserMessage(id) {
  return request({
    url: '/userMessage/resend',
    method: 'get',
    params: { id }
  })
}
