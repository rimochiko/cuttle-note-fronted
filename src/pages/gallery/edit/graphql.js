import axios from 'axios'
export default {
    createChart,
    updateChart,
    getOnePost
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