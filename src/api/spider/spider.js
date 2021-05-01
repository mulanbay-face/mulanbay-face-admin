import request from '@/utils/request'

export function addTask(ids) {
  const data = {
      ids
  }
  return request({
    url: '/spiderApi/spider/addTask',
    method: 'post',
    data
  })
}