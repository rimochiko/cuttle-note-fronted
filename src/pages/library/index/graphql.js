import axios from "axios";

export default {
    userPostQuery,
    groupPostQuery,
    userDelPostQuery,
    groupDelPostQuery,
    getOnePost,
    addFollow,
    cancelFollow,
    getOwnerInfo
}

const USER = "user";

function userPostQuery (args) {
    return `
    query {
      data:
      userPosts(
       userId: "${args.userId}",
       token: "${args.token}",
       type: 0,
       author: "${args.author}"
     ) {
       code,
       posts {
        id
        status
        title
        author,
        parentId,
        children {
          id
          status
          title
          author,
          parentId,
          children {
            id,
            status,
            title,
            author,
            parentId,
            children {
              id,
              status,
              title,
              author
              parentId
            }
          }
        }
       }
     }
   }`;
}

function groupPostQuery (args) {
    return `
    query {
      data:
      groupPosts(
       userId: "${args.userId}",
       token: "${args.token}",
       type: 0,
       groupId: "${args.groupId}"
     ) {
       code,
       posts {
        id
        status
        title
        author,
        parentId,
        children {
          id
          status
          title
          author,
          parentId,
          children {
            id,
            status,
            title,
            author,
            parentId,
            children {
              id,
              status,
              title,
              author
              parentId
            }
          }
        }
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
      return axios.post('/graphql', {query})
}