import axios from 'axios';

export default {
    like,
    unlike
}

function like (args) {
    const query = `
    mutation {
      data:
      postLike (
          postId: ${args.id},
          token: "${args.token}",
          userId: "${args.userId}"
      )
    }
  `
  return axios.post('/graphql', {query})
}

function unlike(args) {
    const query = `
          mutation {
            data:
            postUnlike (
                postId: ${args.id},
                token: "${args.token}",
                userId: "${args.userId}"
            )
          }
        `;
    return axios.post('/graphql', {query})
}