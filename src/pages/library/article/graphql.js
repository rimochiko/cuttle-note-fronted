import axios from 'axios';

export default {
    like,
    unLike,
    collect,
    unCollect,
    comment
}

function like (args) {
    const query = `
    mutation {
      data:
      postLike (
          postId: ${args.id},
          token: "${args.token}",
          userId: "${args.userId}"
      ){
        code,
        msg
      }
    } 
  `
  return axios.post('/graphql', {query})
}

function unLike(args) {
    const query = `
          mutation {
            data:
            postUnlike (
                postId: ${args.id},
                token: "${args.token}",
                userId: "${args.userId}"
            ) {
              msg,
              code
            }
          }
        `;
    return axios.post('/graphql', {query})
}

function collect ({postId, token, userId}) {
    const query = `
    mutation {
      data:
      postCollect (
          postId: ${postId},
          token: "${token}",
          userId: "${userId}"
      ) {
        code,
        msg
      }
    }
  `
  return axios.post('/graphql', {query})
}

function unCollect ({postId, token, userId}) {
  const query = `
  mutation {
    data:
    postUncollect (
        postId: ${postId},
        token: "${token}",
        userId: "${userId}"
    ) {
      code,
      msg
    }
  }
`
return axios.post('/graphql', {query})
}

function comment ({postId, token, userId, replyId, comment}) {
  const query = replyId ? `
          mutation {
            data:
            postComment (
                postId: ${postId},
                token: "${token}",
                userId: "${userId}",
                replyId: ${replyId},
                content: "${escape(comment)}",
            ) {
                code
                msg
                result {
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
            }
          }
        `: `
        mutation {
          data:
          postComment (
              postId: ${postId},
              token: "${token}",
              userId: "${userId}",
              content: "${escape(comment)}",
          ) {
              code
              msg
              result {
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
          }
        }
      `;
      return axios.post('/graphql', {query})
}