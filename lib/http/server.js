import axios from "axios"

async function refreshSession() {
  // console.log("尝试请求一次ssid。。。");
  return axios({
    method: "post",
    url: BotConfig.push.sessionidUrl,
    data: {
      token: BotConfig.push.requestToken
    }
  }).then(async (res) => {
    let ssid = res.headers["set-cookie"][0].split("; ")[0].replace("ssid=","");
    global.x19push_sessionid = ssid;
    return Promise.resolve(1);
  }).catch(async (err) => {
    console.log("刷新session出问题了："+err);
  });
}

async function getToken(path,body) {
  
  return axios({
    method: "post",
    url: BotConfig.push.tokenUrl,
    headers: {
      "hsession-id": global.x19push_sessionid,
      "session-id": global.x19push_sessionid
    },
    data: {
      path: path,
      body: body
    }
  }).then(async (res) => {
    if(res.data.hasOwnProperty('success') && !res.data.success) {
      await refreshSession();
      throw Error('fuck');
    }
    return Promise.resolve(res.data);
  }).catch(async (err) => {
    console.log("获取token出问题了："+err);
  });
}

export { refreshSession,getToken }