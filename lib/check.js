import fs from "fs"
import sqlite3 from "sqlite3"
import readline from "readline"
import { sqlInit } from "./utils/sqlinit.js"

if(!fs.existsSync("./node_modules")) {
  console.log("请使用npm install或其他命令进行安装。");
  process.exit();
}

let rl;

function question(query) {
  return new Promise((resolve) => {
    if (!rl) return;
    rl.question(query.trim(), resolve);
  });
}

async function check() {
  if(fs.existsSync("./config/config.js")) {
    global.BotConfig = (await import("../config/config.js")).config;
  } else {
    rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    let account,password,adminQQ,sessionidUrl,tokenUrl,requestToken;
    console.log("请根据提示输入，输入完毕后回车，某一项错误请使用Ctrl+C结束，然后重新运行。");
    console.log("其他设置，编辑config.js以修改。");
    account = await question("请输入Bot的QQ：\n");
    if(Number(account) === NaN) {
      console.log("QQ输入错误，请重新输入！");
      return await check();
    }
    
    password = await question("请输入Bot的密码：\n");
    if(password.toString() === "") {
      console.log("密码为空。");
      console.log("若需要重新设置，请结束进程后编辑config/config.js");
      password = "";
      return await check();
    }

    sessionidUrl = await question("请输入获取sessionid的地址：\n");
    if(sessionidUrl.startsWith("http://")) {
      console.log("http协议是不安全的，但我们不会加以阻止。");
    }
    
    tokenUrl = await question("请输入获取请求网易token的地址：\n");
    if(tokenUrl.startsWith("http://")) {
      console.log("http协议是不安全的，但我们不会加以阻止。");
    }
    
    requestToken = await question("请输入token：\n");
    if(requestToken.toString() === "") {
      console.log("token输入有误");
      requestToken = "123456";
    }
    
    let defaultConfig = fs.readFileSync("./config/config_default.js").toString();
    defaultConfig = defaultConfig.replace(`account: "0",`,`account: "${account}",`);
    defaultConfig = defaultConfig.replace(`password: "123456",`,`password: "${password}",`);
    defaultConfig = defaultConfig.replace(`adminQQ: [123456],`,`adminQQ: [${adminQQ}],`);
    defaultConfig = defaultConfig.replace(`sessionidUrl: "",`,`sessionidUrl: "${sessionidUrl}",`);
    defaultConfig = defaultConfig.replace(`tokenUrl: "",`,`tokenUrl: "${tokenUrl}",`);
    defaultConfig = defaultConfig.replace(`requestToken: ""`,`requestToken: "${requestToken}"`);
    fs.writeFileSync("./config/config.js",defaultConfig);
    console.log("已完成初期设定，其他设置请编辑config/config.js。");
    global.BotConfig = (await import("../config/config.js")).config;
    BotConfig.beginSet = true;
  }
  
    if(!fs.existsSync("./data")) {
      fs.mkdirSync("./data");
    }
    global.PushDatabase = await new sqlite3.Database('data/push.db');
    await sqlInit();
}
  
process.on("exit", async (code) => {
  if(PushDatabase !== undefined) {
    PushDatabase.close();
  }
});

export { check }