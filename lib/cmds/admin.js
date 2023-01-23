import { addAdmin,removeAdmin,getUserLevel } from "../utils/sql.js"
import { getDeveloperProfile } from "../http/x19.js"

const main = {
  config: {
    description: "管理员命令",
    isSimpleCommand: false
  },
  
  sub: {
    add: {
      description: "添加一个管理员",
      help: "!!admin add @target <DeveloperID>\nDeveloperID可通过 !!getdevid 组件ID 来获取",
      cmd: add
    },
    
    remove: {
      description: "移除一个管理员",
      help: "!!admin remove @target",
      cmd: remove
    },
    
    query: {
      description: "查询自己的权限等级",
      help: "!!admin query",
      cmd: query
    }
  }
};

async function add(msg) {
  let params = msg.raw_message.split(' ');
  if(params.length !== 4) return msg.reply("请正确输入命令！\n提示：\n"+main.sub.add.help);
  
  let dev_id = params[3];
  
  let senderId = msg.sender.tiny_id;
  let targetId;
  try {
    targetId = msg.message[1].id;
  } catch {
    msg.reply("你还没@要添加的管理呢");
    return;
  }
  let senderLevel = await getUserLevel(senderId);
  if(senderLevel !== "master") {
    msg.reply("只有主人才能使用本命令");
    return;
  }
  
  let developerProfile = await getDeveloperProfile(dev_id);
  if(developerProfile.code !== 0) return msg.reply("开发者ID不存在");
  
  let removeResult = await addAdmin(targetId,dev_id,false);
  switch(removeResult) {
    case "success":
      msg.reply("成功添加管理员");
      break;
    case "admin_exists":
      msg.reply("目标已是管理员");
      break;
    default:
      msg.reply("未知错误");
      break;
  }
}

async function remove(msg) {
  let senderId = msg.sender.tiny_id;
  let targetId;
  try {
    targetId = msg.message[1].id;
  } catch {
    msg.reply("你还没@要移除的管理呢");
    return;
  }
  let senderLevel = await getUserLevel(senderId);
  if(senderLevel !== "master") {
    msg.reply("只有主人才能使用本命令");
    return;
  }
  let removeResult = await removeAdmin(targetId);
  switch(removeResult) {
    case "success":
      msg.reply("成功移除管理员");
      break;
    case "admin_not_exists":
      msg.reply("目标不是管理员");
      break;
    default:
      msg.reply("未知错误");
      break;
  }
}

async function query(msg) {
  let senderId = msg.sender.tiny_id;
  let senderLevel = await getUserLevel(senderId);
  let permission = "未知";
  switch(senderLevel) {
    case "master":
      permission = "主人";
      break;
    case "admin":
      permission = "管理员";
      break;
    case "user":
      permission = "用户";
      break;
  }
  msg.reply(`你当前的权限：${permission}`);
}

export { main }