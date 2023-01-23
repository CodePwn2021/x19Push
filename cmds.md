## 命令列表
### admin
!!admin add @target <DeveloperID>  
添加一个管理员  
DeveloperID可通过 !!getdevid 组件ID 来获取


!!admin remove @target  
移除一个管理员


!!admin query  
查询自己是否为管理员
### getdevid
!!getdevid <item_id>  
通过组件id查找开发者ID  
item_id：组件id
### help
!!help  
懂得都懂
### search
!!search <keywords>  
通过关键词查找想要的组件ID  
keywords: 关键词
### sub
!!sub add <type> <id>  
添加一个订阅  
type: 订阅类型，只能是dev（开发者留言板）和item（组件评论区）


!!sub remove <id>  
移除一个订阅  
id: 要移除的id


!!sub remove_all  
清空全部订阅，仅主人可使用


!!sub list
列出当前子频道的订阅列表