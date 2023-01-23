import fs from "fs"
import schedule from "node-schedule"
import { isAdminEmpty } from "./utils/sql.js"
import { taskExec } from "./task.js"
import { refreshSession } from "./http/server.js"

// 设置时区为上海
process.env.TZ = "Asia/Shanghai";
// 拉取&解析package.json
const packageJson = JSON.parse(fs.readFileSync("./package.json","utf8"));
global.isInit = false;

async function init() {
  if(isInit !== false) {
    return;
  }
  // 提前定义sessionid
  global.x19push_sessionid = 'NULL';
  // 加载命令
  await loadCommand();
  // 初始化session-id
  await refreshSession();
  console.log("\n      _  ___  ____            _\n" +
"__  _/ |/ _ \\|  _ \\ _   _ ___| |__\n" +
"\\ \\/ / | (_) | |_) | | | / __| '_ \\\n" +
" >  <| |\\__, |  __/| |_| \\__ \\ | | |\n" +
"/_/\\_\\_|  /_/|_|    \\__,_|___/_| |_|\n\n" +
"Version: " + packageJson.version +
"\nRepository: https://github.com/x19Project/x19Push");
  // 第一次启动绑定主人
  bindFirstMaster();
  // 指定启动时间
  global.x19push_startupTime = Math.round(new Date() / 1000);
  // 进行一次推送
  taskExec();
  let job = schedule.scheduleJob(BotConfig.push.pushCron, async () => {
    taskExec();
  });
  global.isInit = true;
}

async function loadCommand() {
  global.Command = {};
  let dirs = await fs.promises.readdir('./lib/cmds');
  for (let value of dirs) {
    if(value.indexOf('.bak') !== -1 || value.indexOf('test') !== -1) continue;
    let cmdName = value.replace('.js','');
    Command[cmdName] = await import(`./cmds/${value}`);
  }
  return Promise.resolve(1);
}

async function bindFirstMaster() {
  let isEmpty = await isAdminEmpty();
  if(!isEmpty) {
    return;
  }
  global.BindCode = (Math.random().toFixed(6).slice(-6)).toString();
  let yellow = "\x1b[1;33m";
  let green = "\x1b[0;32m";
  let clear = "\x1b[0m";
  console.log(`${yellow}初次启动提示：请在频道输入 ${green}${BindCode} ${yellow}完成主人绑定${clear}`);
}

export { init }