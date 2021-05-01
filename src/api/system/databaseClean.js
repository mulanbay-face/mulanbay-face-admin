import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/databaseClean/getData',
    method: 'get',
    params: query
  })
}

export function getDatabaseClean(id) {
  return request({
    url: '/databaseClean/get',
    method: 'get',
    params: { id }
  })
}

export function getCounts(id) {
  return request({
    url: '/databaseClean/getCounts',
    method: 'get',
    params: { id }
  })
}

export function truncate(id) {
  return request({
    url: '/databaseClean/truncate',
    method: 'get',
    params: { id }
  })
}


export function createDatabaseClean(data) {
  return request({
    url: '/databaseClean/create',
    method: 'post',
    data
  })
}

export function manualClean(data) {
  return request({
    url: '/databaseClean/manualClean',
    method: 'post',
    data
  })
}


export function updateDatabaseClean(data) {
  return request({
    url: '/databaseClean/edit',
    method: 'post',
    data
  })
}

export function deleteDatabaseClean(ids) {
  const data = {
      ids
  }
  return request({
    url: '/databaseClean/delete',
    method: 'post',
    data
  })
}
