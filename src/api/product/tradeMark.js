// 主要获取的品牌管理的数据
import request from '@/utils/request'
// 获取品牌列表的接口
export const reqTradeMarkList = (page, limit) =>
  request({
    url: `/admin/product/baseTrademark/${page}/${limit}`,
    method: 'GET'
  })

// 新增或更新品牌接口
export const reqAddOrUpdateTradeMark = (tradeMark) => {
  // 带给服务器的数据携带ID ---- 修改品牌
  if (tradeMark.id) {
    return request({
      url: '/admin/product/baseTrademark/update',
      method: 'PUT',
      data: tradeMark
    })
  } else {
    // 新增品牌
    return request({
      method: 'POST',
      url: '/admin/product/baseTrademark/save',
      data: tradeMark
    })
  }
}

// 根据 id 删除品牌
export const reqDeleteTradeMark = (id) =>
  request({
    url: `/admin/product/baseTrademark/remove/${id}`,
    method: 'delete'
  })
