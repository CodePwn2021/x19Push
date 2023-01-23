import _ from "lodash"

async function addAdmin(id,developer_id,isMaster) { // 添加管理员
  let isExists = await isAdminExists(id);
  if(!isExists) { // 如果不存在这个管理员
    return new Promise((resolve,reject) => {
      let add = PushDatabase.prepare(`INSERT INTO admin VALUES ('${id}','${developer_id}',${Boolean(isMaster)});`);
      add.run(() => {
        resolve('success');
      });
    });
  } else {
    return Promise.resolve('admin_exists');
  }
}

async function removeAdmin(id) { // 移除管理员
  let isExists = await isAdminExists(id);
  if(isExists) {
    return new Promise((resolve,reject) => {
      let remove = PushDatabase.prepare(`DELETE FROM admin WHERE id = '${id}'`);
      remove.run(() => {
        resolve('success');
      });
    });
  } else {
    return Promise.resolve('admin_not_exists');
  }
}

async function isAdminExists(id) { // 是否有这个管理员
  return new Promise((resolve,reject) => {
    PushDatabase.all(`SELECT count(*) FROM admin WHERE id = '${id}'`,(err,res) => {
      let result = res[0]["count(*)"];
      resolve(result);
    });
  });
}

async function isAdminEmpty() { // 管理员列表是否为空
  return new Promise((resolve,reject) => {
    PushDatabase.all(`SELECT count(*) FROM admin`,(err,res) => {
      let result = res[0]["count(*)"];
      if (result !== 0) {
        resolve(0);
      }
      resolve(1);
    });
  });
}

async function getUserLevel(id) { // 获取用户权限等级
  return new Promise((resolve,reject) => {
    PushDatabase.all(`SELECT * FROM admin WHERE id = '${id}'`,(err,res) => {
      if(res.length === 0) {
        resolve("user");
        return;
      }
      
      if (res[0].is_master) {
        resolve("master");
        return;
      }
      
      resolve("admin");
      return;
    });
  });
}

async function getUserDeveloperID(id) { // 获取管理的开发者ID信息
  return new Promise((resolve,reject) => {
    PushDatabase.all(`SELECT * FROM admin WHERE id = '${id}'`,(err,res) => {
      if(res.length === 0) {
        resolve('NOT_ADMIN');
        return;
      }
      
      const admin_info = res[0];
      resolve(admin_info.developer_id);
      return;
    });
  });
}
async function addTask(id,type,name,guild,sub) { // 添加订阅
  // 类型目前只有两种，1：开发者留言板，2：组件评论区
  if(Number(type) === NaN) {
    return Promise.resolve('type_not_number'); // 类型不是数字
  }
  let isExists = await isTaskExists(id); // 看看订阅是否存在
  if(isExists) { // 如果存在
    return new Promise(async (resolve,reject) => {
      let subs = await getSubscribeList(id); // 获取订阅列表
      let need_add = `${guild}#${sub}`;
      if(subs.indexOf(need_add) !== -1) {
        resolve('task_exists'); // 订阅已存在
      } else {
        subs.push(need_add); // 追加订阅
        let subs_str = JSON.stringify(subs); // 数组转换成字符串
        let modify = PushDatabase.prepare(`UPDATE push SET sublist = '${subs_str}' WHERE id = ${id}`); // 修改原本的订阅内数组，换成新的
        modify.run(() => {
          resolve('success'); // 成功
        });
      }
    });
  } else { // 如果不存在
    let subs = `["${guild}#${sub}"]`;
    return new Promise((resolve,reject) => {
      let add = PushDatabase.prepare(`INSERT INTO push VALUES('${id}',${type},'${name}','${subs}','0');`); // 追加订阅
      add.run(() => {
        resolve('success'); // 成功
      });
    });
  }
}

async function refreshTask(id,latest_uid) { // 刷新订阅最后一个uid
  return new Promise((resolve,reject) => {
    let refresh = PushDatabase.prepare(`UPDATE push SET latest_uid = '${latest_uid}' WHERE id = '${id}';`);
    refresh.run(() => {
      resolve('success');
    });
  });
}

async function removeTask(id,guild,sub) { // 移除订阅
  let isExists = await isTaskExists(id);
  if(isExists) { // 如果订阅存在
    return new Promise(async (resolve,reject) => {
      let subs = await getSubscribeList(id);
      if(subs.length === 1) { // 如果订阅的频道只有一个
        let del = PushDatabase.prepare(`DELETE FROM push WHERE id = '${id}'`); // 删除整个订阅
        del.run(() => {
          resolve('success'); // 成功
        });
      } else { // 如果有多个频道订阅
        let need_remove = `${guild}#${sub}`;
        _.pull(subs,need_remove); // 调用lodash删除元素
        let subs_str = JSON.stringify(subs);
        let modify = PushDatabase.prepare(`UPDATE push SET sublist = '${subs_str}' WHERE id = ${id}`); // 修改原本的订阅内数组，换成新的
        modify.run(() => {
          resolve('success'); // 成功
        });
      }
    });
  } else {
    return Promise.resolve('task_not_exists'); // 订阅不存在
  }
}

async function removeTaskAll() { // 完全移除订阅
  return new Promise((resolve,reject) => {
    let remove = PushDatabase.prepare(`DELETE FROM push;UPDATE sqlite_sequence SET seq = 0 WHERE name = 'push';`);
    remove.run(() => {
      resolve(1);
    });
  });
}

async function isTaskExists(id) { // 订阅事件否存在
  return new Promise((resolve,reject) => {
    PushDatabase.all(`SELECT count(*) FROM push WHERE id = '${id}'`,(err,res) => {
      let result = res[0]["count(*)"];
      resolve(result);
    });
  });
}

async function isTaskSubscribed(id,guild,sub) { // 是否在某子频道订阅
  let isExists = await isTaskExists(id);
  if(!isExists) return Promise.resolve(0);
  let taskDetail = await getSubscribeList(id);
  return Promise.resolve(taskDetail.includes(`${guild}#${sub}`));
}

async function getSubscribeList(id) { // 获取订阅了某id（事件）的频道列表，返回一个数组
  return new Promise((resolve,reject) => {
    PushDatabase.all(`SELECT sublist FROM push WHERE id = '${id}'`,(err,res) => {
      // [ "guild#sub" ]
      let result = JSON.parse(res[0].sublist);
      resolve(result);
    });
  });
}

async function getAllSubscribes() { // 获取全部订阅
  return new Promise((resolve,reject) => {
    PushDatabase.all(`SELECT * FROM push`,(err,res) => {
      res.forEach((value,index) => {
        // 返回之前把sublist转换成数组，方便处理
        res[index].sublist = JSON.parse(res[index].sublist);
      });
      resolve(res);
    });
  });
}

export { addAdmin,removeAdmin,getUserLevel,getUserDeveloperID,isAdminEmpty,addTask,refreshTask,removeTask,isTaskSubscribed,removeTaskAll,getSubscribeList,getAllSubscribes }