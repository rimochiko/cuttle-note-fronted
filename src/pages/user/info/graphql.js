import axios from 'axios';

export default {
    getInfoList,
    getUserInfo,
    searchUsers,
    sendMessage,
    acceptInvite
}

function getInfoList(args) {
    const query = `
    query {
        data:
        getInfoList(
          token: "${args.token}",
          userId: "${args.userId}"
        ) {
          code,
          msg,
          result {
            id
            from {
              id
              avatar
              nickname,
              des
            }
            date
            content
          }
        }
    }`;
   
    return axios.post('/graphql', {query});
}

function getUserInfo(args){
    const query = `
    query {
        data:
        getUserInfo(
          token: "${args.token}",
          userId: "${args.userId}",
          fromId: "${args.fromId}"
        ) {
          code,
          msg,
          result {
            id
            from {
              id
              avatar
              nickname
            }
            date
            content
            type
            status,
            detail
          }
        }
    }`;

    return axios.post('/graphql', {query});
}

function searchUsers(args){
  const query = `
  query {
    data:
    userFind(
      token: "${args.token}",
      userId: "${args.userId}",
      search: "${args.search}"
    ) {
      code,
      msg,
      result {
        id
        avatar
        nickname
      }
    }
  }`;

  return axios.post('/graphql', {query});
}

function sendMessage (args) {
  const query = `
  mutation {
    data:
    infoCreate(
      token: "${args.token}",
      userId: "${args.userId}",
      objectId: "${args.objectId}",
      content: "${args.content}"
    ) {
      code,
      msg,
      result {
        id
        from {
          id
          nickname
          avatar
        }
        date
        content
      }
    }
  }`;
  return axios.post('/graphql', {query});
}


function acceptInvite (args) {
  const query = `
  mutation {
    data:
    groupJoin(
      userId: "${args.userId}",
      token: "${args.token}",
      infoId: ${args.infoId}
    )
  } {
    code,
    msg
  }
  `
  return axios.post('/graphql', {query});
}