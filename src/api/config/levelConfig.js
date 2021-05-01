import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/levelConfig/getData',
    method: 'get',
    params: query
  })
}

export function getLevelConfig(id) {
  return request({
    url: '/levelConfig/get',
    method: 'get',
    params: { id }
  })
}

export function createLevelConfig(data) {
  return request({
    url: '/levelConfig/create',
    method: 'post',
    data
  })
}

export function updateLevelConfig(data) {
  return request({
    url: '/levelConfig/edit',
    method: 'post',
    data
  })
}
export function deleteLevelConfig(ids) {
  const data = {
      ids
  }
  return request({
    url: '/levelConfig/delete',
    method: 'post',
    data
  })
}

export function judgeLevel(data) {
  return request({
    url: '/levelConfig/judgeLevel',
    method: 'post',
    data
  })
}


export function selfJudge(data) {
  return request({
    url: '/levelConfig/selfJudge',
    method: 'post',
    data
  })
}
