import axios from 'axios';


export default {
  getMembers,
  getGroupEasy,
  searchUsers,
  inviteUser
}

function getGroupEasy (args) {
    const query = 
            `query {
              data:
              groupEasy(
                id:"${args.id}\
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
    groupMembers (
        groupId: ${args.groupId}
    ) {
        id,
        nickname,
        avatar,
        role
    }
  `;

  return axios.post('/graphql', {query});
}

function searchUsers (args) {
  const query = `
    userFind(
      token: ${args.token},
      userId: ${args.userId},
      search: ${args.search}
    ) {
      id,
      avatar,
      nickname
    }
   `;
   return axios.post('/graphql', {query});
}

function inviteUser (args) {
  const query = `
    groupInviteUser (
      token: ${args.token},
      userId: ${args.userId},
      users: ${args.users}
    )
  `;
  return axios.post('/graphql', {query});
}