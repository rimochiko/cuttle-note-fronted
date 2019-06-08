import axios from 'axios';
export default {
  updateProfile,
  getProfile
}

function updateProfile (args) {
  const query = `
    mutation {
        data:
        userUpdate(
            userId: "${args.userId}",
            token: "${args.token}",
            nickname: "${args.nickname}",
            des: "${args.des}",
            avatar: "${args.avatar}",
            location: "${args.location}",
            sex: ${args.sex}
        ) {
          code,
          msg,
          result {
            avatar
          }
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

function getProfile (args) {
    const query = `
      query {
        data:
        userOne(userId: "${args.userId}") {
            code,
            msg,
            result {
              avatar
              nickname
              des
              location
              sex
            }
        }
      }
    `;
    return axios.post('/graphql', {query});
}