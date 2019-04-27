import UserApi from './user';
import GroupApi from './group';
import PostApi from './post';
import fetch from 'cross-fetch';

const API = {
    user: UserApi,
    group: GroupApi,
    post: PostApi
}

function fetchPost (apiObj, apiType, body) {
    // 发送头部
    let initHeaders = new Headers()
    initHeaders.append('Accept', 'application/json, text/plain, */*')
    initHeaders.append('Content-Type', 'application/x-www-form-urlencoded')
    
    let args = API[apiObj][apiType].args;
    let arr = args.map((key => {
      console.log(key);
      return `${key}:"${body[key]}"`;
    }));
    console.log(arr);
    console.log(arr.join(','));
    // 发送内容
    let content = `{
      ${API[apiObj][apiType].name}:
      ${API[apiObj][apiType].func}(${arr.join(',')})
    }`;

    console.log(content);


    const init = {
      method: 'POST',
      credentials: 'include', 
      headers: initHeaders,
      body: content
    }

    return fetch(
      API[apiObj].base,
      init
    );
}

function fetchGet (apiObj, apiType, body) {
  let args = API[apiObj][apiType].args;
  let arr = args.map((key => {
    console.log(key);
    return `${key}:"${body[key]}"`;
  }));
  // 发送内容
  let content = `{
    ${API[apiObj][apiType].name}:
    ${API[apiObj][apiType].func}(${arr.join(',')})
  }`;

  console.log(content);

  const init = {
    method: 'GET',
    credentials: 'include', 
    body: content
  }

  return fetch(
    API[apiObj].base,
    init
  );
}

export {
    fetchPost,
    fetchGet
}