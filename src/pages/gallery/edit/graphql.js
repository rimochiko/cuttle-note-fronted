import axios from 'axios'
export default {
    createChart,
    updateChart,
    getOnePost
}

const MIND = "mind",
      FLOW = "flow",
      GROUP = "group",
      USER = "user";

function createChart (args) {
    const query = !args.groupId ? `
    mutation {
        data:
        userImagePostSave (
            token: "${args.token}",
            userId: "${args.userId}",
            title: "${args.title}",
            content: "${escape(args.content)}",
            isAuth: ${args.auth ? 1 : 0},
            publish: ${args.publish},
            imgbase: "${args.imgBase || ''}"
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
            title: "${args.title}",
            content: "${escape(args.content)}",
            isAuth: ${args.auth ? 1 : 0},
            publish: ${args.publish},
            imgbase: "${args.imgBase || ''}"
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
        data: encodeURIComponent("query")+"="+encodeURIComponent(query)
     })}


function updateChart (args) {
    const query = !args.groupId ? `
    mutation {
        data:
        userImgPostUpdate (
            token: "${args.token}",
            postId: ${args.postId},
            userId: "${args.userId}",
            title: "${args.title}",
            content: "${escape(args.content)}",
            isAuth: ${args.auth ? 1 : 0},
            publish: ${args.publish},
            imgbase: "${args.imgBase || ''}"
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
            postId: ${args.postId},
            title: "${args.title}",
            content: "${escape(args.content)}",
            isAuth: ${args.auth ? 1 : 0},
            publish: ${args.publish},
            imgbase: "${args.imgBase || ''}"
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
    return axios.post('graphql', {query})
  }