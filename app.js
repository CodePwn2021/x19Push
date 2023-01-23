import { check } from "./lib/check.js"
import { init } from "./lib/init.js"
import { createClient } from "oicq"
import { GuildApp } from "oicq-guild"

import { cmdMgr } from "./lib/cmdmgr.js"
import { addAdmin } from "./lib/utils/sql.js"

process.title = "x19push";

await check();

// 创建oicq Bot客户端
const Bot = createClient(BotConfig.bot.account,{
  platform: BotConfig.bot.platform,
  log_level: BotConfig.bot.log_level,
  resend: false
})

global.Bot = Bot;

// 滑动&密码登录
Bot.on("system.login.slider", function (e) {
  console.log("输入ticket，然后回车：");
  process.stdin.once("data", ticket => this.submitSlider(String(ticket).trim()))
}).login(BotConfig.bot.password)

// 设备锁
Bot.on("system.login.device", function (e) {
  console.log("完成设备锁验证，回车以继续登录");
  process.stdin.once("data", () => {
    this.login();
  });
});

// 账号或密码错误
Bot.on("system.login.error", function (e) {
  if (e.code == 1) this.logger.error("请编辑config/config.js，修改为正确的账号和密码");
  process.exit();
});

// 监听上线
Bot.on("system.online", async () => {
  await init();
});

/* Guild App */

// 创建一个GuildApp并和Bot客户端绑定
const BotGuild = GuildApp.bind(Bot)

global.BotGuild = BotGuild;

// 列出频道列表
/*
BotGuild.on("ready", function () {
  console.log("My guild list:")
  console.log(this.guilds)
})
*/

// 监听频道消息
BotGuild.on("message", e => {
  // console.log(e)
  
  try {
    if(e.raw_message === BindCode) {
      addAdmin(e.sender.tiny_id,"OWNER",true);
      e.reply("绑定成功");
      delete global.BindCode;
    }
  } catch {}
  if(e.raw_message.startsWith("!!")) {
    cmdMgr(e);
  }
})