// 将四个模块请求的接口函数同意暴露
import * as trademark from './product/tradeMark'
import * as attr from './product/Attr'
import * as sku from './product/Sku'
import * as spu from './product/Spu'
import * as user from './acl/user'
import role from './acl/role'
import permission from './acl/permission'

export default {
  trademark,
  attr,
  sku,
  spu,
  user,
  role,
  permission
}
