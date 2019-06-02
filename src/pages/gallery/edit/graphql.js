import axios from 'axios'
export default {
    createChart,
    updateChart,
    getOnePost,
    sendEditStatus,
    deleteDraft,
    lockPost
}

function createChart (args) {
    const query = !args.groupId ? `
    mutation {
        data:
        userImagePostSave (
            token: "${args.token}",
            userId: "${args.userId}",
            title: "${args.title || "无标题"}",
            content: "${escape(args.content)}",
            isAuth: ${args.auth ? 1 : 0},
            publish: ${args.publish},
            imgbase: "${args.imgbase || ''}"
        ) {
            code
            postId
            date
        }
    }`: `
    mutation {
        data:
        groupImagePostSave (
            token: "${args.token}",
            userId: "${args.userId}",
            title: "${args.title || "无标题"}",
            content: "${escape(args.content)}",
            isAuth: ${args.auth ? 1 : 0},
            publish: ${args.publish},
            imgbase: "${args.imgbase || ''}"
            groupId: ${args.groupId}
        ) {
            code
            postId
            date
        }
    }`;

   return axios({
        url: '/graphql',
        method: 'post',
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        maxContentLength: Infinity,
        data: encodeURIComponent("query")+"="+encodeURIComponent(query)
     })
    }


function updateChart (args) {
    const query = !args.groupId ? `
    mutation {
        data:
        userImgPostUpdate (
            token: "${args.token}",
            postId: ${args.postId || 0},
            draftId: ${args.draftId || 0},
            userId: "${args.userId}",
            title: "${args.title}",
            content: "${escape(args.content)}",
            isAuth: ${args.auth ? 1 : 0},
            publish: ${args.publish},
            imgbase: "${args.imgbase || ''}"
        ) {
            code
            postId
            date
        }
    }`: `
    mutation {
        data:
        groupImgPostUpdate (
            token: "${args.token}",
            userId: "${args.userId}",
            postId: ${args.postId || 0},
            draftId: ${args.draftId || 0},
            title: "${args.title}",
            content: "${escape(args.content)}",
            isAuth: ${args.auth ? 1 : 0},
            publish: ${args.publish},
            imgbase: "${args.imgbase || ''}"
            groupId: "${args.groupId}"
        ) {
            code
            postId
            date
        }
    }`;

    return axios({
        url: '/graphql',
        method: 'post',
        headers:{
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: encodeURIComponent("query")+"="+encodeURIComponent(query)
     })}

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
    return axios.post('/graphql', {query})
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
    
    function lockPost ({
        token,
        userId,
        postId
    }) {
        // 0-加锁成功,1-他人正在编辑,2-内容有变动
        const query = `
        lockPost(
            userId: "${userId}",
            token: "${token}",
            postId: ${postId}
        )
        `
        return axios.post('/graphql', {query});   
    }