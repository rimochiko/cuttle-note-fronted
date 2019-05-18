import axios from "axios";

export default {
    getHomeData
}

function getHomeData (args) {
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
        },
        news:
        followUserNews(
          token: "${args.token}",
          userId: "${args.userId}"
        ) {
          code
          options {
            id
            user {
              id
              nickname
              avatar
            }
            post {
              id,
              type
              title
              link
            }
            date
            type
          }
        }
        statistic:
          getUserStatistic(
            token: "${args.token}",
            userId: "${args.userId}"
          ){
          textNum 
          dates
          imgNum 
          viewNum 
          likeNum
          charts 
          }
    }
    `
    return axios.post('/graphql', {query});
}

