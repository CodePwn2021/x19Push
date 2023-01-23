import axios from "axios"
import { getToken } from "./server.js"

async function requestNetease(path,body) {
  let tokens = await getToken(path,JSON.stringify(body));
  if(tokens["user-id"] === undefined || tokens["user-token"] === undefined) {
    return await requestNetease(path,body);
  }
  return axios({
    method: "post",
    url: "https://g79mclobt.nie.netease.com"+path,
    data: body,
    headers: {
      "user-id": tokens["user-id"],
      "user-token": tokens["user-token"],
      "user-agent": "okhttp/3.12.12"
    }
  }).then(async (res) => {
    return Promise.resolve(res.data);
  }).catch(async (err) => {
    console.log("请求+"+path+"失败："+err);
  })
}

async function searchModules(moduleName) {
  let post_data = {
    keyword: moduleName,
    offset: 0,
    length: 5,
    channel_id: 5,
    init: 0
  }
  
  let path = "/pe-item/query/search-by-keyword";
  
  return await requestNetease(path,post_data);
}

async function getModuleComment(module_id) {
  let post_data = {
    item_id: module_id.toString(),
    length: 3,
    sort_type: 3,
    order: 0
  };
  
  let path = "/pe-user-comment";
  
  return await requestNetease(path,post_data);
}

async function getModuleDetail(module_id) {
  let post_data = {
    item_id: module_id.toString(),
    channel_id: 5,
    need_record: 0
  };
  
  let path = "/pe-item-detail-v2";
  
  return await requestNetease(path,post_data);
}

async function getDeveloperProfile(developer_id) {
  let post_data = {
    id: Number(developer_id)
  };
  
  let path = "/pe-developer-homepage/load_developer_homepage/get";
  
  return await requestNetease(path,post_data);
}

async function getDeveloperComment(developer_id) {
  let post_data = {
    developer_info_id: developer_id.toString(),
    offset: 0,
    length: 3
  };
  
  let path = "/pe-developer-homepage-comment/load_comment_list";
  
  return await requestNetease(path,post_data);
}

export { searchModules,getModuleComment,getModuleDetail,getDeveloperProfile,getDeveloperComment }