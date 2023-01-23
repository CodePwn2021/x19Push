import { getUserLevel } from "../utils/sql.js"
import { getModuleDetail } from "../http/x19.js"

const main = {
  config: {
    description: "获取开发者ID",
    isSimpleCommand: true
  },
  
  default: {
    description: "获取开发者ID",
    help: "!!getdevid <item_id>\nitem_id是组件ID",
    cmd: getDeveloperId
  }
};

async function getDeveloperId(msg) {
  let senderId = msg.sender.tiny_id;
  let senderLevel = await getUserLevel(senderId);
  if(senderLevel === "user") return msg.reply("你还不是管理员，不能执行此命令！");
  
  msg.reply("请稍等片刻，正在获取。。。");
  let target = msg.raw_message.split(' ')[1];
  if(target === "") return msg.reply("请正确输入组件ID\n提示：\n"+main.default.help);
  let result = await getModuleDetail(target);
  if(result.code !== 0) return msg.reply("组件不存在，请检查组件ID输入");
  let item_name = result.entity.res_name;
  let item_id = result.entity.item_id;
  let dev_name = result.entity.developer_name;
  let dev_id = result.entity.developer_id;
  msg.reply(`组件名称：${item_name}\n组件ID：${item_id}\n开发者呢称：${dev_name}\n开发者ID：${dev_id}`);
}

export { main }