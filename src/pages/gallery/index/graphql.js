import axios from 'axios'
export default {
    getOwnerInfo,
    userPostQuery,
    groupPostQuery,
    userDelPostQuery,
    groupDelPostQuery,
    getOnePost
}


const USER = "user"

function getOwnerInfo (params, userId) {
    const query = params.obj === USER ? `
    query {
      isFollow:
      isFollowed(
       userId:"${userId}",
       token: "",
       followId: "${params.owner}"
      )
      data:
      userEasy(
        id:"${params.owner}"
      ) {
       avatar
       id
       nickname
     }
    }`:
    `query {
      data:
      groupEasy(
        id:"${params.owner}"
      ) {
        id
        avatar
        nickname
      }
    }`;
   return axios.post('/graphql', {query});
}

function addFollow (args) {
  const query = `
  mutation {
    data:
    followUser(
      userId: "${args.userId}",
      token: "${args.token}",
      followId: "${args.followId}"
    )
  }
  `;
  return axios.post('/graphql', {query});
}

function cancelFollow (args) {
  const query = `
  mutation {
    data:
    unfollowUser(
      userId: "${args.userId}",
      token: "${args.token}",
      followId: "${args.followId}"
    )
  }
  `;
  return axios.post('/graphql', {query});
}

function userPostQuery (args) {
    return `
    query {
      data:
      userCharts(
       userId: "${args.userId}",
       token: "${args.token}",
       type: 1,
       author: "${args.author}"
     ) {
       code,
       drafts {
        id
        status
        title
        date
        author
       }
       posts {
        id
        status
        title
        author,
        url
       }
     }
   }`;
}

function groupPostQuery (args) {
    return `
    query {
      data:
      groupCharts(
       userId: "${args.userId}",
       token: "${args.token}",
       type: 1,
       groupId: "${args.groupId}"
     ) {
       code,
       drafts {
        id
        status
        title
        date
        author
       }
       posts {
        id
        status
        title
        author,
        url
       }
     }
   }`;
}


function userDelPostQuery (args) {
    return `
    mutation {
      data:
      postDelete(
        userId:"${args.userId}",
        postId:${args.postId},
        token:"${args.token}"
      )
    }`
}

function groupDelPostQuery (args) {
    return `
    mutation {
        data:
        postDelete(
            userId:"${args.userId}",
            postId:${args.postId},
            token:"${args.token}",
            groupId:"${args.groupId}",
        )
    }`
}

function getOnePost (args) {
  return `
  query {
    data:
    post(
      userId:"${args.userId}",
      postId:${args.postId},
      token: "${args.token}"
    ) {
      code,
      post {
        id,
        author {
          nickname,
          id
        }
        createTime
        title
        content
        comments {
          id
          creatorId
          creatorName
          receiverId
          receiverName
          avatar
          content
          date
          parentId
        }
        likeNum
        isLike
        viewNum
        isCollect,
        parent,
        status,
        auth,
        type
      }
    }
  }
  `
}