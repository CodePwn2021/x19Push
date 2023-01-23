## 已停止维护
由于后续的更新涉及到部分不可公开代码，因此已停止维护，实在是抱歉。
# x19Push
![https://github.com/CodePwn2021/x19Push/blob/main/LICENSE](https://img.shields.io/badge/License-AGPL--3.0-green)   ![](https://img.shields.io/badge/node->=16.14.2-brightgreen)   ![](https://img.shields.io/badge/Version-1.0.9-blue)

 <div align=center><img src="./x19push_icon.png" width = "250" height = "250" alt="x19push_icon" align=center/></div>

## 介绍
- 可推送《我的世界》中国版（网易）的开发者留言板和组件评论到QQ频道。  
- 可用于提醒开发者及时回复评论/留言
- 可用于舆情检测（例如多人联合给组件评低分），协助开发者团队推出对应的控舆方案。
## 项目创建原因
我发现大多数开发者，包括我在内，有时会碍于一些原因，导致他们不能经常打开客户端查看组件评论和留言板。  
原因可能是急着处理现实世界的事情，也可能是正在制作新组件。  
为了尽可能不让开发者们因为需要打开客户端才能去查看评论或留言板而浪费时间，且保证开发者们能高效处理这些评论或留言，所以我创建了这个项目。
## 如何开始部署
```bash
cd ./x19push
npm install

# 第一次启动，需要使用这个命令进行登录和配置操作
npm run app

# 后续挂服务器后台，可以Ctrl+C，然后用这个
npm run start
```
按照上述进行配置后，[前往查看Bot命令列表](https://github.com/CodePwn2021/x19push/blob/main/cmds.md)。
## 免责声明
**⚠️一切开发皆为学习对应的开发思想以及开发语言，禁止用于商业或非法用途**  
⚠️该项目**并未违反**网易的用户协议，因为请求网易服务器的token实际上**并非**由本项目的代码获取、生成，可自行查看server.js和x19.js。
**使用后造成的后果和本项目开发者无关，用户需自行承担使用责任**  
禁止删除代码中涉及版权的提示
## 特别感谢
| 组织/人物 | 相关信息 |
|:----:|:----:|
| 大肥免办公室 | 让我想到创建这个项目 |
| Bouldev | 提供测试用API |
| [Yunzai-Bot](https://github.com/Le-niao/Yunzai-Bot) | 让我参考了构建思想 |

## 引用的开源库
[oicq](https://github.com/takayama-lily/oicq)  
[oicq-guild](https://github.com/takayama-lily/oicq-guild)  
axios  
node-schedule  
sqlite3(node)  
pm2