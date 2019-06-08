import axios from 'axios';

export default {
    login,
    register,
    checkMail,
    checkName
}

function login (args) {
    const query = `
    mutation {
      data:
      userLogin(
       userId: "${args.name}",
       password: "${args.password}") {
         code,
         msg,
         result {
          token,
          id,
          avatar,
          nickname
         }
       }
     }`;
      
    return axios.post('/graphql', {query})
}

function register (args) {
  const query = `
  mutation {
    data:
    userSave(
      userId: "${args.name}",
      password: "${args.password}",
      mail: "${args.mail}"
    ) {
      code,
      msg,
      result {
        token,
        id,
        avatar,
        nickname
      }
    }
  }`;
  
  return axios.post('/graphql', {query})
}

function checkMail (args) {
  const query = `query {
    data:
    isMailNone(mail: "${args.mail}") {
      code,
      msg,
      result
    }
  }`;
    
  return axios.post('/graphql', {query});
}

function checkName (args) {
  const query = `query {
    data:
    isUserNone(userId: "${args.name}") {
      code,
      msg,
      result
    }
  }`;

  return axios.post('/graphql', {query})
}