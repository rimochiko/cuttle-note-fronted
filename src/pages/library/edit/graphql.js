import axios from 'axios';

export default {
    createPost,
    updatePost,
    getOnePost,
    uploadImage,
    sendEditStatus,
    deleteDraft
}

function createPost (args) {
    let query;
    if (args.groupId) {
        if (args.parentId) {
            query = `
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
            query = `
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
            query = `
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
            query = `
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

    return axios({
        url: '/graphql',
        method: 'post',
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: encodeURIComponent("query")+"="+encodeURIComponent(query)
     })

}

function updatePost (args) {
    const query = `
    mutation {
        data:
        userTextPostUpdate (
            postId: ${args.postId || 0},
            token: "${args.token}",
            userId: "${args.userId}",
            title: "${args.title || '无标题'}",
            content: "${args.content}",
            isAuth: ${args.Auth ? args.Auth : 1},
            publish: ${args.publish},
            draftId: ${args.draftId || 0}
        ) {
            code,
            date,
            postId
        }
    }`;
    return axios({
        url: '/graphql',
        method: 'post',
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: encodeURIComponent("query")+"="+encodeURIComponent(query)
     })
}

function getOnePost (args) {
    const query = `
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
    return axios({
        url: '/graphql',
        method: 'post',
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: encodeURIComponent("query")+"="+encodeURIComponent(query)
     })
  }

  function uploadImage ({userId, token, imgbase}) {
      const query = `
      mutation {
        data:
        uploadImage(
            userId: "${userId}",
            token: "${token}",
            imgbase: "${imgbase}"            
        ) {
            code,
            url
        }
      }
      `;
      return axios({
        url: '/graphql',
        method: 'post',
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: encodeURIComponent("query")+"="+encodeURIComponent(query)
     })
  }

  function sendEditStatus ({postId, userId, token, isLock}) {
    let query;
    if (isLock) {
        query = `
        mutation {
            data:
            lockPost(
                postId: ${postId},
                userId: "${userId}",
                token: "${token}"
            )
        }
        `;
    } else {
        query = `
        mutation {
            data:
            unlockPost(
                postId: ${postId},
                userId: "${userId}",
                token: "${token}"
            )
        }
        `
    }

    return axios.post('/graphql', {query});
  }

  function deleteDraft ({token, userId, postId}) {
      const query = `
        postDelete(
            postId: ${postId},
            token: "${token}",
            userId: "${userId}",
            absolute: 1
        )
      `;
      return axios.post('/graphql', {query});   
  }