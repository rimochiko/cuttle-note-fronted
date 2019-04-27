export default {
    userPostQuery,
    groupPostQuery,
    userDelPostQuery,
    groupDelPostQuery,
    getOnePost
}

function userPostQuery (args) {
    return `
    query {
      data:
      userPosts(
       userId: "${args.userId}",
       token: "${args.token}",
       type: ${args.type},
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
       type: ${args.type},
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