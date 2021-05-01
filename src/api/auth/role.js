import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/role/getData',
    method: 'get',
    params: query
  })
}

export function changeRoleStatus(id,status) {
  const data = {
      id,
      status
  }
  return request({
    url: '/role/changeStatus',
    method: 'post',
    params: data
  })
}


export function getRole(id) {
  return request({
    url: '/role/get',
    method: 'get',
    params: { id }
  })
}

export function getRoleTree(needRoot) {
  return request({
    url: '/role/getRoleTree',
    method: 'get',
    params: {
      needRoot:needRoot
    }
  })
}

export function getRoleFunctionTree(roleId,separate,needRoot) {
  return request({
    url: '/role/getRoleFunctionTree',
    method: 'get',
    params: {
      roleId:roleId,
      separate:separate,
      needRoot:needRoot
    }
  })
}

export function saveUserRole(data) {
  return request({
    url: '/role/saveUserRole',
    method: 'post',
    data
  })
}

export function refreshSystemConfig() {
  return request({
    url: '/role/refreshSystemConfig',
    method: 'post'
  })
}

export function saveRoleFunction(data) {
  return request({
    url: '/role/saveRoleFunction',
    method: 'post',
    data
  })
}


export function createRole(data) {
  return request({
    url: '/role/create',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/role/edit',
    method: 'post',
    data
  })
}
export function deleteRole(ids) {
  const data = {
      ids
  }
  return request({
    url: '/role/delete',
    method: 'post',
    data
  })
}
