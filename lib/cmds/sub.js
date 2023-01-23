import { getUserLevel,getUserDeveloperID,addTask,removeTask,isTaskSubscribed,removeTaskAll,getSubscribeList,getAllSubscribes } from "../utils/sql.js"
import { getModuleDetail,getDeveloperProfile } from "../http/x19.js"

const main = {
  config: {
    description: "订阅命令",
    isSimpleCommand: false
  },
  
  sub: {
    add: {
      description: "订阅指定类型",
      help: "!!sub add <taskType> <id>\ntaskType是订阅类型\nid是目标ID",
      cmd: add
    },
    
    remove: {
      description: "移除某项订阅",
      help: "!!sub remove <id>\nid是目标ID",
      cmd: remove
    },
    
    remove_all: {
      description: "移除当前子频道订阅的全部内容",
      help: "!!sub remove_all",
      cmd: removeAll
    },
    
    list: {
      description: "列出当前所在子频道订阅的列表",
      help: "!!sub list",
      cmd: listTask
    }
  }
};

async function add(msg) {
  let params = msg.raw_message.split(' ');
  if(params.length !== 4) return msg.reply("请正确输入命令！\n提示：\n"+main.sub.add.help);
  
  let taskType = params[2];
  let target = params[3];
  
  if (taskType === "" || target === "") return msg.reply("请正确输入命令！\n提示：\n"+main.sub.add.help);
  
  let senderId = msg.sender.tiny_id;
  let senderLevel = await getUserLevel(senderId);
  if(senderLevel === "user") return msg.reply("你还不是管理员，不能添加订阅！");
  
  let guild = msg.guild_id;
  let sub = msg.channel_id;
  
  let taskSub,senderDeveloperID;
  
  switch(taskType) {
    case "dev":
      let developerProfile = await getDeveloperProfile(target);
      if(developerProfile.code !== 0) return msg.reply("貌似不存在这位开发者呢");
      
      senderDeveloperID = await getUserDeveloperID(senderId);
      if(senderDeveloperID !== target && senderDeveloperID !== "OWNER") return msg.reply("你无权订阅他人开发者留言板");
      
      taskSub = await isTaskSubscribed(target,guild,sub);
      if(taskSub) return msg.reply("本子频道已订阅指定事件");
      
      let developerName = (developerProfile.entity.developer_name).replace(' ','');
      await addTask(target,1,developerName,guild,sub);
      msg.reply("已成功在此子频道添加开发者 "+developerName+" 的留言板订阅！");
      break;
    
    case "item":
      let itemDetail = await getModuleDetail(target);
      if(itemDetail.code !== 0) return msg.reply("貌似这个组件不存在呢");
      
      let ItemDeveloperID = itemDetail.entity.developer_id;
      senderDeveloperID = await getUserDeveloperID(senderId);
      if(String(ItemDeveloperID) !== senderDeveloperID && senderDeveloperID !== "OWNER") return msg.reply("你无权订阅他人组件评论区");
      
      taskSub = await isTaskSubscribed(target,guild,sub);
      if(taskSub) return msg.reply("本子频道已订阅指定事件");
      
      let itemName = (itemDetail.entity.res_name).replace(' ','');
      await addTask(target,2,itemName,guild,sub);
      msg.reply("已成功在此子频道添加组件 "+itemName+" 的评论区订阅！");
      break;
    
    default:
      msg.reply("订阅类型只能是dev或item！");
      break;
  }
}

async function remove(msg) {
  let target = msg.raw_message.split(' ')[2];
  if (target === "") return msg.reply("请正确输入命令！\n提示：\n"+main.sub.remove.help);
  
  let senderId = msg.sender.tiny_id;
  let senderLevel = await getUserLevel(senderId);
  if(senderLevel === "user") return msg.reply("你还不是管理员，不能移除订阅！");
  
  let guild = msg.guild_id;
  let sub = msg.channel_id;
  
  let taskSub = await isTaskSubscribed(target,guild,sub);
  
  if(!taskSub) return msg.reply("在此子频道并没有找到该订阅记录");
  await removeTask(target,guild,sub);
  msg.reply("成功移除订阅！");
}

async function removeAll(msg) {
  let senderId = msg.sender.tiny_id;
  let senderLevel = await getUserLevel(senderId);
  if(senderLevel !== "master") return msg.reply("只有主人才可移除全部订阅");
  await removeTaskAll();
  msg.reply("移除全部订阅成功！");
}

async function listTask(msg) {
  let sub = `${msg.guild_id}#${msg.channel_id}`;
  let senderId = msg.sender.tiny_id;
  let senderLevel = await getUserLevel(senderId);
  if(senderLevel === "user") return msg.reply("你还不是管理员，不能查看订阅列表！");
  
  let all_sub = await getAllSubscribes();
  let result = "当前子频道订阅列表：";
  let sub_count = 0;
  for(let value of all_sub) {
    let id = value.id;
    let name = value.name;
    let type = value.type;
    let list = value.sublist;
    if(!list.includes(sub)) continue;
    sub_count = sub_count + 1;
    switch(type) {
      case 1: // 开发者留言板
        result = result + `\n\n开发者 ${name} 的留言板\n开发者ID：${id}`;
        break;
        
      case 2: //组件评论区
       result = result + `\n\n组件 ${name} 的评论区\n组件ID：${id}`;
       break;
       
      default:
       result = result + `\n\n[未知]`;
       break;
    }
  }
  
  if(sub_count === 0) {
    result = "当前子频道没有订阅任何内容";
  }
  msg.reply(result);
}

export { main }