/*
  请直接复制一份到同目录，改名为config.js
  不要修改config_default.js，两个文件都不要删除！
*/
let config = {
  // debug开关
  debug: false,
  // Bot账号配置
  bot: {
    account: "0", // Bot的QQ号
    password: "123456", // Bot的密码
    log_level: "info", // 日志等级
    device: 5 // 设备类型 1=Android, 2=Android Pad, 3=Android Watch, 4=MacOS, 5=iPad
  },
  push: {
    pushCron: "0 0/3 * * * ? ", // 轮询间隔，默认3min一次，cron表达式
    /*
      ！！！注意！！！
      如果下方你填写的是代理Url
      请确保这是你自己搭建的
      否则安全性不能得到保障
      甚至导致你的token会被第三方窃取
      后果很严重！不要说我没提醒你！
    */
    sessionidUrl: "", // 获取sessionid的地址
    tokenUrl: "", // 获取请求网易token的地址
    requestToken: "" // 获取sessionid用的token
  }
}
export { config }