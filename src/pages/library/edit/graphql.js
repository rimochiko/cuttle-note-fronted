export default {
    createPost,
    updatePost,
    getOnePost
}

function createPost (args) {
    if (args.groupId) {
        if (args.parentId) {
            return `
            mutation {
                data:
                groupTextPostSave (
                    token: "${args.token}",
                    userId: "${args.userId}",
                    title: "${args.title || '无标题'}",
                    content: "${args.content}",
                    isAuth: ${args.Auth ? args.Auth : 1},
                    publish: ${args.publish},
                    parentId: ${args.parentId},
                    groupId: ${args.groupId}
                ) {
                    code,
                    postId,
                    date
                }
            }`;        
        } else {
            return `
            mutation {
                data:
                groupTextPostSave (
                    token: "${args.token}",
                    userId: "${args.userId}",
                    title: "${args.title || '无标题'}",
                    content: "${args.content}",
                    isAuth: ${args.Auth ? args.Auth : 1},
                    publish: ${args.publish},
                    groupId: ${args.groupId}
                ) {
                    code,
                    postId,
                    date
                }
            }`;         
        }
    } else {
        if (args.parentId) {
            return `
            mutation {
                data:
                userTextPostSave (
                    token: "${args.token}",
                    userId: "${args.userId}",
                    title: "${args.title || '无标题'}",
                    content: "${args.content}",
                    isAuth: ${args.Auth ? args.Auth : 1},
                    publish: ${args.publish},
                    parentId: ${args.parentId}
                ) {
                    code,
                    postId,
                    date
                }
            }`;        
        } else {
            return `
            mutation {
                data:
                userTextPostSave (
                    token: "${args.token}",
                    userId: "${args.userId}",
                    title: "${args.title || '无标题'}",
                    content: "${args.content}",
                    isAuth: ${args.Auth ? args.Auth : 1},
                    publish: ${args.publish}
                ) {
                    code,
                    postId,
                    date
                }
            }`;         
        }
    }

}

function updatePost (args) {
    return `
    mutation {
        data:
        userTextPostUpdate (
            postId: ${args.postId},
            token: "${args.token}",
            userId: "${args.userId}",
            title: "${args.title || '无标题'}",
            content: "${args.content}",
            isAuth: ${args.Auth ? args.Auth : 1},
            publish: ${args.publish},
        ) {
            code,
            date,
            postId
        }
    }`;
}

function getOnePost (args) {
    return `
    query {
      data:
      post(
        userId:"${args.userId}",
        postId: ${args.postId},
        token: "${args.token}"
      ) {
        code,
        post {
          author {
            nickname
            id
          }
          belongGroup {
              nickname
              id
          }
          recentTime
          recentUser {
            nickname
            id
          }
          title
          content,
          parent,
          status,
          auth,
          type
        }
      }
    }
    `
  }