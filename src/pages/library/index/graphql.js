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
      data:
      userPosts(
       userId: "${args.userId}",
       token: "${args.token}",
       type: 0,
       author: "${args.author}"
     ) {
       code,
       drafts {
        id
        status
        title
        date
        author
        parentId
       }
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
   return axios.post('/graphql', {query});
}

function groupPostQuery (args) {
    const query = `
    query {
      data:
      groupPosts(
       userId: "${args.userId}",
       token: "${args.token}",
       type: 0,
       groupId: "${args.groupId}"
     ) {
       code,
       drafts {
        id
        status
        title
        date
        author
        parentId
       }
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
   return axios.post('/graphql', {query});
}

function postListQuery ({
  token,
  userId,
  groupId,
  author
}) {
  if (groupId) {
    return groupPostQuery({
      userId,
      token,
      groupId
    })
  } else {
    return userPostQuery({
      userId,
      token,
      author
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
      )
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
        )
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

function getOwnerInfo (params, userId) {
  const query = params.obj === USER ? `
       query {
         isFollow:
         isFollowed(
          userId:"${userId}",
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

