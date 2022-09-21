import request from '@/utils/request'

// 获取spu 列表
export const reqSpuList = (page, limit, category3Id) =>
  request({
    url: `/admin/product/${page}/${limit}`,
    method: 'get',
    params: { category3Id }
  })

// 获取 spu 详情
export const reqSpu = (spuId) =>
  request({
    url: `/admin/product/getSpuById/${spuId}`,
    method: 'get'
  })

// 获取品牌数据
export const reqTradeMarkList = () =>
  request({
    url: '/admin/product/baseTrademark/getTrademarkList',
    method: 'get'
  })

// 获取 spu 图片的接口
export const reqSpuImageList = (spuId) =>
  request({
    url: `/admin/product/spuImageList/${spuId}`,
    method: 'get'
  })

// 获取平台的全部销售属性 ------ 一共 3 个
export const reqBaseSaleAttrList = () =>
  request({
    url: '/admin/product/baseSaleAttrList',
    method: 'get'
  })

// 修改 spu || 添加 spu：对于修改或者是添加spu，携带给服务器的参数大致是一样的，唯一的区别是携带的参数是否带 id
export const reqAddOrUpdateSpu = (spuInfo) => {
  // 携带的参数带有 id ------- 修改 spu
  if (spuInfo.id) {
    return request({
      url: '/admin/product/updateSpuInfo',
      method: 'post',
      data: spuInfo
    })
  } else {
    // 携带的参数不带 id ----- 添加 spu
    return request({
      url: '/admin/product/saveSpuInfo',
      method: 'post',
      data: spuInfo
    })
  }
}

// 删除 spu
export const reqDeleteSpu = (spuId) =>
  request({
    url: `/admin/product/deleteSpu/${spuId}`,
    method: 'delete',
  })
