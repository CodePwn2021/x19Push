async function sqlInit() {
  /*
   ======
   push表
   ======
   id 对应的id
   type 类型（1：开发者留言板/2：组件评论区）
   name 名称
   sublist 推送到的频道列表（在里面存一个数组，按照数组指引轮询发送）
   latest_uid 最新的uid
   ======
   admin表
   ======
   id 频道用户id
   （这个值在QQ是不可见的）
   developer_id 开发者ID
   is_master 是否为主人
   （主人可以给别人授权）
  */
  let isExists = await isPushTableExists();
  if(!isExists) {
    let pushTable = PushDatabase.prepare(`CREATE TABLE push (id TEXT NOT NULL, type INT NOT NULL, name TEXT NOT NULL, sublist TEXT NOT NULL, latest_uid TEXT NOT NULL);`);
    let adminTable = PushDatabase.prepare(`CREATE TABLE admin (id TEXT NOT NULL, developer_id TEXT NOT NULL, is_master BOOLEAN NOT NULL)`);
    return new Promise((resolve,reject) => {
      pushTable.run(() => {
        adminTable.run(() => {
          resolve(1);
        });
      });
    });
  }
}

async function isPushTableExists() {
  return new Promise((resolve,reject)=>{
    PushDatabase.all(`SELECT count(*) FROM sqlite_master WHERE name = 'push';`,(err,res)=>{
      let result = res[0]["count(*)"];
      resolve(result);
    });
  });
}

export { sqlInit }