import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/spiderApi/spiderLog/getData',
    method: 'get',
    params: query
  })
}
