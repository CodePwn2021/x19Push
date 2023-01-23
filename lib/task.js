import { getAllSubscribes,refreshTask } from "./utils/sql.js"
import { getModuleComment,getDeveloperComment } from "./http/x19.js"
import { sendMsgToGuild,formatTime } from "./utils/tool.js"

async function taskExec() {
  // console.log("尝试进行一次推送。。。");
  let subs = await getAllSubscribes();
  if(subs.length === 0) return;
  let taskList = [];
  for(let value of subs) {
    let id = value.id;
    let type = value.type;
    let name = value.name;
    let sublist = value.sublist;
    let latest_uid = value.latest_uid;
    if(sublist.length === 0) continue;
    taskList.push(checkx19(id,type,name,sublist,latest_uid));
  }
  Promise.all(taskList).then((res) => {
    // console.log("pull&push success!");
  }).catch((err) => {
    console.log("本次推送存在异常，已跳过。错误为："+err);
  });
}

async function checkx19(id,type,name,sublist,latest_uid) {
  let result,player_name,player_uid,send_time,score,comment,push_content;
  switch(type) {
    case 1: // 开发者留言板
      result = await getDeveloperComment(id);
      if(result.code !== 0) break;
      if((result.entity.master_comment_list).length === 0) break;
      player_name = result.entity.master_comment_list[0].nickname;
      player_uid = result.entity.master_comment_list[0].uid.toString();
      send_time = result.entity.master_comment_list[0].publish_time;
      comment = result.entity.master_comment_list[0].user_comment;
      push_content = `开发者 ${name} 的留言板有新留言！\n呢称：${player_name}\nUID：${player_uid}\n发布时间：${formatTime(send_time,true)}\n留言：${comment}`;
      break;
    case 2: // 组件评论区
      result = await getModuleComment(id);
      if(result.code !== 0) break;
      if((result.entity.comment_list).length === 0) break;
      player_name = result.entity.comment_list[0].nickname;
      player_uid = result.entity.comment_list[0].uid.toString();
      send_time = result.entity.comment_list[0].publish_time;
      score = result.entity.comment_list[0].stars;
      comment = result.entity.comment_list[0].user_comment;
      push_content = `组件 ${name} 有新评论！\n呢称：${player_name}\nUID：${player_uid}\n发布时间：${formatTime(send_time,true)}\n评分：${score} 鸡腿\n评论：${comment}`;
      break;
    
    default:
      push_content = "推送类型异常";
      break;
  }
  if(push_content === undefined) return;
  await refreshTask(id,player_uid);
  if(send_time < x19push_startupTime || latest_uid === player_uid) return;
    sublist.forEach((value) => {
    let guild = value.split("#")[0];
    let channel = value.split("#")[1];
    sendMsgToGuild(guild,channel,push_content);
  });
}

export { taskExec }