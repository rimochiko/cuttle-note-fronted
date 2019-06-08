import axios from "axios";
export default {
    userPostQuery,
    groupPostQuery,
    userDelPostQuery,
    groupDelPostQuery,
    getOnePost,
    addFollow,
    cancelFollow,
    getOwnerInfo,
    deleteAllDraft,
    deletePost,
    postListQuery
}

const USER = "user";

function userPostQuery (args) {
    const query = `
    query {
      drafts:
      draftPosts(
        userId: "${args.userId}",
        token: "${args.token}",
        type: 0,
        isFind: ${args.isFind}
      ) {
        code,
        msg,
        result {
          id
          title
          recentTime
        }
      }
      posts:
      userPosts(
       userId: "${args.userId}",
       token: "${args.token}",
       type: 0,
       author: "${args.author}"
     ) {
       code,
       msg,
       result {
        id
        status
        title
        parent
        children {
          id
          status
          title
          parent,
          children {
            id,
            status,
            title,
            parent,
            children {
              id,
              status,
              title,
              parent
            }
          }
        }
       }
     }
   }`;
   return axios.post('/graphql', {query});
}

function groupPostQuery (args) {
    const query = `
    query {
      drafts:
      draftPosts(
        userId: "${args.userId}",
        token: "${args.token}",
        type: 0,
        isFind: ${args.isFind},
        groupId: "${args.groupId}"
      ) {
        code,
        msg,
        result {
          id
          status
          title
          recentTime
          parent
        }
      }
      posts:
      groupPosts(
       userId: "${args.userId}",
       token: "${args.token}",
       type: 0,
       groupId: "${args.groupId}"
     ) {
       code,
       msg,
       result {
        id
        status
        title
        parent,
        children {
          id
          status
          title
          parent,
          children {
            id,
            status,
            title,
            parent,
            children {
              id,
              status,
              title,
              parent
            }
          }
        }
       }
     }
   }`;
   return axios.post('/graphql', {query});
}

function postListQuery ({
  token,
  userId,
  groupId,
  author,
  isFind
}) {
  if (groupId) {
    return groupPostQuery({
      userId,
      token,
      groupId,
      isFind
    })
  } else {
    return userPostQuery({
      userId,
      token,
      author,
      isFind
   })
  }
}


function userDelPostQuery (args) {
    const query = `
    mutation {
      data:
      postDelete(
        userId:"${args.userId}",
        postId:${args.postId},
        token:"${args.token}"
      ) {
        code,
        msg
      }
    }`
    return axios.post('/graphql', {query});
}

function groupDelPostQuery (args) {
    const query = `
    mutation {
        data:
        postDelete(
            userId:"${args.userId}",
            postId:${args.postId},
            token:"${args.token}",
            groupId:"${args.groupId}",
        ) {
          code,
          msg
        }
    }`
    return axios.post('/graphql', {query});
}

function getOnePost (args) {
  const query = `
  query {
    data:
    post(
      userId:"${args.userId}",
      postId:${args.postId},
      token: "${args.token}"
    ) {
      code,
      msg,
      result {
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
    ) {
      code,
      msg
    }
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
    ) {
      code,
      msg
    }
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
          followId: "${params.owner}"
         ) {
           code,
           msg,
           result
         }
         data:
         userOne(
           userId:"${params.owner}"
         ) {
           code,
           msg,
           result {
            avatar
            id
            nickname             
           }
        }
       }`:
       `query {
         data:
         groupOne(
           groupId:"${params.owner}"
         ) {
            code,
            msg,
            result {
            avatar
            id
            nickname             
            }
         }
       }`;
      return axios.post('/graphql', {query})
}

function deletePost ({
  token,
  userId,
  groupId,
  postId
}) {
  if (groupId) {
    return groupDelPostQuery({
      userId,
      postId,
      token,
      groupId
    });
  } else {
    return userDelPostQuery({
      userId,
      postId,
      token
    });
  }
}

function deleteAllDraft ({
  token,
  userId,
  groupId
}) {
  let query;
  if (groupId) {
      query = `
        mutation {
            data:
            postAllRemove(
                token: "${token}",
                userId: "${userId}",
                groupId: "${groupId}",
                isDraft: 1,
                type: 0,
            )
        }
      `
  } else {
    query = `
    mutation {
        data:
        postAllRemove(
            token: "${token}",
            userId: "${userId}",
            isDraft: 1,
            type: 0
        )
    }
    `
  }
  return axios.post('/graphql', {query});
}

