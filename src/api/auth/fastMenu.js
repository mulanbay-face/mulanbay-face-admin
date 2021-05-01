import request from '@/utils/request'

/**
 * 获取用户首页快捷菜单
 */
export function getIndexFastMenu() {
  return request({
    url: '/fastMenu/getList',
    method: 'get'
  })
}

export function getMenuTree() {
  return request({
    url: '/fastMenu/getMenuTree',
    method: 'get'
  })
}

export function saveFastMenu(data) {
  return request({
    url: '/fastMenu/saveFastMenu',
    method: 'post',
    data
  })
}
