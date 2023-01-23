import { getUserLevel } from "../utils/sql.js"
import { searchModules } from "../http/x19.js"

const main = {
  config: {
    description: "搜索组件",
    isSimpleCommand: true
  },
  
  "default": {
    description: "搜索组件",
    help: "!!search <keywords>\nkeywords是组件关键字",
    cmd: searchModuleCmd
  }
};

async function searchModuleCmd(msg) {
  let senderId = msg.sender.tiny_id;
  let senderLevel = await getUserLevel(senderId);
  if(senderLevel === "user") return msg.reply("你还不是管理员，不能执行此命令");
  
  let keywords = msg.raw_message.split(' ')[1];
  if(keywords === "" || keywords === undefined) return msg.reply("请正确输入要搜索的组件名称\n提示：\n"+main["default"].help);
  msg.reply("请稍等片刻，正在搜索。。。");
  let searchResult = await searchModules(keywords);
  let str = "以下是搜索结果（仅展示前五个）：";
  
  if(searchResult.entities.length === 0) {
    str = "未搜索到结果，可能你的关键词比较特殊呢～";
    msg.reply(str);
    return;
  }
  
  for (let value of searchResult.entities) {
    let id = value.item_id;
    let name = value.res_name;
    let diamond = value.diamond;
    let emerald = value.points;
    let price_str = "";
    
    if(diamond === 0 && emerald === 0) {
      price_str = "免费"
    } else if(diamond !== 0 && emerald === 0) {
      price_str = `${diamond} 钻石（${diamond/100}￥）`
    } else {
      price_str = `${emerald} 绿宝石`
    }
    
    let dev_name = value.developer_name;
    str = str + `\n\n组件名称：${name}\n组件ID：${id}\n价格：${price_str}\n开发者呢称：${dev_name}`;
  }
  str = str + "\n\n提示：若需要获取开发者ID，请使用\n!!getdevid 组件ID";
  msg.reply(str);
}

export { main }