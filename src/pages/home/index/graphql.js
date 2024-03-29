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
          code,
          msg,
          result {
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
          code,
          msg,
          result {
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
            code,
            msg,
            result {
              textNum 
              dates
              imgNum 
              viewNum 
              likeNum
              charts 
            }
          }
    }
    `
    return axios.post('/graphql', {query});
}

