// 平台属性管理模块的请求文件
import request from '@/utils/request'

// 获取一级分类数据接口
export const reqCategory1List = () =>
  request({
    url: '/admin/product/getCategory1',
    method: 'get'
  })

// 获取二级分类数据接口
export const reqCategory2List = (category1Id) =>
  request({
    url: `/admin/product/getCategory2/${category1Id}`,
    method: 'get'
  })

// 获取三级分类数据接口
export const reqCategory3List = (category2Id) =>
  request({
    url: `/admin/product/getCategory3/${category2Id}`,
    method: 'get'
  })

// 获取平台属性的接口
export const reqAttrList = (category1Id, category2Id, category3Id) =>
  request({
    url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,
    method: 'get'
  })

// 添加或更新属性与属性值接口 /admin/product/saveAttrInfo post
export const reqAddAttr = (data) =>
  request({
    url: '/admin/product/saveAttrInfo',
    method: 'post',
    data
    /* {
       "attrName": "string", 属性名
       "attrValueList": [ 属性值列表
         {
          "attrId": 0,  属性的 id
           "valueName": "string"  属性值的名称
         }
       ],
       "categoryId": 0,  实际是category3id
       "categoryLevel": 0, categoryLevel的值是3
     }*/
  })
