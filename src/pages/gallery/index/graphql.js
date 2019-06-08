import axios from 'axios'
export default {
    getOwnerInfo,
    userPostQuery,
    groupPostQuery,
    userDelPostQuery,
    groupDelPostQuery,
    getOnePost,
    cancelFollow,
    addFollow,
    deleteAllDraft,
    deletePost,
    postListQuery
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
      ) {
        msg
        code
        result
      }
      data:
      userOne(
        userId:"${params.owner}"
      ) {
        msg
        code
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
        msg
        code
        result {
          avatar
          id
          nickname          
        }
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
    ) {
      msg
      code
      result
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
      msg
      code
      result
    }
  }
  `;
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

function userPostQuery (args) {
    const query = `
    query {
      drafts:
      draftPosts(
        userId: "${args.userId}",
        token: "${args.token}",
        type: 1,
        isFind: ${args.isFind}
      ) {
        code,
        msg,
        result {
          id
          status
          title
          recentTime
        }
      }
      posts:
      userCharts(
       userId: "${args.userId}",
       token: "${args.token}",
       author: "${args.author}"
       type: 1
     ) {
       code,
       msg,
       result {
        id
        status
        title
        url
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
        type: 1,
        isFind: ${args.isFind}
      ) {
        code,
        msg,
        result {
          id
          status
          title
          recentTime
        }
      }
      posts:
      groupCharts(
       userId: "${args.userId}",
       token: "${args.token}",
       type: 1,
       groupId: "${args.groupId}"
     ) {
       code,
       msg,
       result {
        id
        status
        title
        url
       }
     }
   }`;
   return axios.post('/graphql', {query});
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
        msg,
        result
      }
    }`
    return axios.post('/graphql', {query});
}

function groupDelPostQuery (args) {
    const query =  `
    mutation {
        data:
        postDelete(
            userId:"${args.userId}",
            postId:${args.postId},
            token:"${args.token}",
            groupId:"${args.groupId}",
        ) {
          code,
          msg,
          result
        }
    }`
    return axios.post('/graphql', {query});
}

function getOnePost (args) {
  const query =  `
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
        status,
        auth,
        type
      }
    }
  }
  `
  return axios.post('/graphql', {query});
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
                type: 1,
            ) {
              code,
              msg
            }
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
            type: 1
        ) {
          code,
          msg
        }
    }
    `
  }
  return axios.post('/graphql', {query});
}