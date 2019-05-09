import axios from "axios";

export default {
    getRecentViews
}

function getRecentViews (args) {
    const query = `
    query {
        recent:
        getUserView(
          token: "${args.token}",
          userId: "${args.userId}"
        ) {
          code
          posts {
            id
            title
            group {
              id
              avatar
              nickname
            }
            author {
              id
              avatar
              nickname
            }
            type,
            date
          }
        }
    }
    `
    return axios.post('/graphql', {query});
}