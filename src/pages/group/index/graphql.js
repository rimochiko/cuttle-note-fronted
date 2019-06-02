import axios from 'axios';


export default {
  getMembers,
  getGroupEasy,
  searchUsers,
  inviteUser,
  createGroup,
  checkGroupId,
  sendInvite,
  getHomeData,
  exitGroup,
  changeUserRole,
  deleteUser,
  updateGroup
}

function getGroupEasy (args) {
    const query = 
            `query {
              data:
              groupEasy(
                id:"${args.id}"
              ) {
                id
                avatar
                nickname
              }
            }`;
    return axios.post('/graphql', {query})
}

function getMembers (args) {
  const query = `
    query {
      data:
      groupMember (
          groupId: "${args.groupId}"
      ) {
          code
          member {
            id,
            nickname,
            avatar,
            role
          }
      }      
    }`;

  return axios.post('/graphql', {query});
}

function searchUsers (args) {
  const query = `
  query {
    data:
    userFind(
      token: "${args.token}",
      userId: "${args.userId}",
      search: "${args.search}"
    ) {
      code
      users {
        id
        avatar
        nickname
      }
    }
  }`;
  return axios.post('/graphql', {query});
}

function inviteUser (args) {
  const query = `
    groupInviteUser (
      token: "${args.token}",
      userId: "${args.userId}",
      users: ${args.users}
    )
  `;
  return axios.post('/graphql', {query});
}

function createGroup (args) {
  const query = `
  mutation {
   data:
   groupSave(
       token: "${args.token}",
       userId: "${args.userId}",
       groupId: "${args.tId}",
       des: "${args.tDes}",
       name: "${args.tName}",
       auth: ${args.tPublic ? 1 : 0},
       avatar: "${args.tAvatar}"
   )
  }
 `
  return axios({
     url: '/graphql',
     method: 'post',
     headers:{
       'Content-Type': 'application/x-www-form-urlencoded'
     },
     data: encodeURIComponent("query")+"="+encodeURIComponent(query)
  })
}

function checkGroupId (args) {
  const query = `
  query {
    data:
    isGroupExist(
      id: "${args.id}"
    )
  }
  `
  return axios.post('/graphql', {query})
}

function sendInvite (args) {
  let ids = [];
  args.users.forEach(item => {
    ids.push(`"${item.id}"`);
  });

  const query = `
  mutation {
    data:
    groupInviteUser (
      token: "${args.token}",
      userId: "${args.userId}",
      objects: [${ids}],
      groupId: "${args.groupId}"
    )
  }
  `;
  return axios.post('/graphql', {query})  
}

function getHomeData (args) {
  const query = `
  query {
    news:
    groupNews(
      token: "${args.token}",
      userId: "${args.userId}",
      groupId: "${args.groupId}"
    ) {
      code
      options {
        id
        user {
          id
          nickname
          avatar
        }
        post {
          id,
          type
          title
          link
        }
        date
        type
      }
    }
    statistic:
    getGroupStatistic(
      token: "${args.token}",
      userId: "${args.userId}",
      groupId: "${args.groupId}"
    ){
      textNum 
      imgNum 
      viewNum 
      likeNum
      dates
      charts 
    }
  }
  `;
  return axios.post('/graphql', {query});
}

function deleteUser (args) {
  const query = `
  mutation {
    data:
    groupExit(
      token: "${args.token}",
      userId: "${args.userId}",
      groupId: "${args.groupId}",
      objectId: "${args.objectId}"
    )
  }
  `;
  return axios.post('/graphql', {query});

}

function exitGroup ({
  token, 
  userId,
  groupId,
  objectId
}) {
  const query = `
  mutation {
    data:
    groupExit (
      token: "${token}",
      userId: "${userId}",
      groupId: "${groupId}",
      objectId: "${objectId}"
    )
  }`;
  return axios.post('/graphql', {query});
}

function changeUserRole ({
  token,
  userId,
  groupId,
  isAdmin,
  objectId
}) {
  const query = `
  mutation {
    data:
    groupRoleSet (
      token: "${token}",
      userId: "${userId}",
      groupId: "${groupId}",
      objectId: "${objectId}",
      isAdmin: ${isAdmin ? true : false}
    )
  }
  `
  return axios.post('/graphql', {query});
}

function updateGroup ({
  token,
  userId,
  groupId,
  name,
  auth,
  avatar,
  des,
  role
}) {
  if (role !== 6) {
    return;
  }

  const query = `
  mutation {
    data:
    groupUpdate(
        token: "${token}",
        userId: "${userId}",
        groupId: "${groupId}",
        des: "${des || ''}",
        name: "${name}",
        auth: ${auth ? 1 : 0},
        avatar: "${avatar}"
    )    
  }
  `
  return axios({
    url: '/graphql',
    method: 'post',
    headers:{
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: encodeURIComponent("query")+"="+encodeURIComponent(query)
 })
}